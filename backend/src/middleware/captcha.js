import axios from 'axios';
import logger from '../config/logger.js';

/**
 * CAPTCHA Verification Middleware
 * Integrates with Google reCAPTCHA v3 for spam protection
 */

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const MIN_SCORE = 0.5; // Minimum score to consider valid (0.0 - 1.0)

/**
 * Verify reCAPTCHA token
 * @param {string} token - reCAPTCHA token from frontend
 * @param {string} action - Expected action name
 * @returns {Promise<Object>} - Verification result
 */
async function verifyRecaptchaToken(token, action) {
    try {
        const response = await axios.post(RECAPTCHA_VERIFY_URL, null, {
            params: {
                secret: RECAPTCHA_SECRET_KEY,
                response: token
            }
        });

        const { success, score, action: responseAction, 'error-codes': errorCodes } = response.data;

        return {
            success,
            score,
            action: responseAction,
            errorCodes,
            isValid: success && score >= MIN_SCORE && responseAction === action
        };
    } catch (error) {
        logger.error('reCAPTCHA verification error', { error: error.message });
        throw new Error('CAPTCHA verification failed');
    }
}

/**
 * Middleware to verify CAPTCHA token
 * @param {string} expectedAction - Expected action name (e.g., 'submit_form', 'login')
 */
export const verifyCaptcha = (expectedAction) => {
    return async (req, res, next) => {
        const { captchaToken } = req.body;

        // Skip in development if no secret key configured
        if (!RECAPTCHA_SECRET_KEY) {
            if (process.env.NODE_ENV === 'development') {
                logger.warn('CAPTCHA verification skipped - no secret key configured');
                return next();
            }
            return res.status(500).json({
                status: 'error',
                message: 'CAPTCHA not configured'
            });
        }

        if (!captchaToken) {
            logger.warn('CAPTCHA token missing', {
                ip: req.ip,
                path: req.path
            });
            return res.status(400).json({
                status: 'fail',
                message: 'CAPTCHA token required'
            });
        }

        try {
            const result = await verifyRecaptchaToken(captchaToken, expectedAction);

            if (!result.isValid) {
                logger.warn('CAPTCHA verification failed', {
                    ip: req.ip,
                    path: req.path,
                    score: result.score,
                    action: result.action,
                    errorCodes: result.errorCodes
                });

                return res.status(400).json({
                    status: 'fail',
                    message: 'CAPTCHA verification failed. Please try again.',
                    score: result.score
                });
            }

            // Store score in request for logging
            req.captchaScore = result.score;

            logger.info('CAPTCHA verified successfully', {
                ip: req.ip,
                path: req.path,
                score: result.score,
                action: result.action
            });

            next();
        } catch (error) {
            logger.error('CAPTCHA verification error', {
                error: error.message,
                ip: req.ip,
                path: req.path
            });

            return res.status(500).json({
                status: 'error',
                message: 'CAPTCHA verification error'
            });
        }
    };
};

/**
 * Optional CAPTCHA middleware
 * Verifies CAPTCHA if token is provided, but doesn't require it
 */
export const optionalCaptcha = (expectedAction) => {
    return async (req, res, next) => {
        const { captchaToken } = req.body;

        if (!captchaToken) {
            return next();
        }

        try {
            const result = await verifyRecaptchaToken(captchaToken, expectedAction);
            req.captchaScore = result.score;
            req.captchaVerified = result.isValid;
        } catch (error) {
            logger.error('Optional CAPTCHA verification error', { error: error.message });
            req.captchaVerified = false;
        }

        next();
    };
};

/**
 * Strict CAPTCHA middleware for high-risk operations
 * Requires higher score threshold
 */
export const strictCaptcha = (expectedAction, minScore = 0.7) => {
    return async (req, res, next) => {
        const { captchaToken } = req.body;

        if (!captchaToken) {
            return res.status(400).json({
                status: 'fail',
                message: 'CAPTCHA token required'
            });
        }

        try {
            const result = await verifyRecaptchaToken(captchaToken, expectedAction);

            if (!result.success || result.score < minScore || result.action !== expectedAction) {
                logger.warn('Strict CAPTCHA verification failed', {
                    ip: req.ip,
                    path: req.path,
                    score: result.score,
                    requiredScore: minScore
                });

                return res.status(400).json({
                    status: 'fail',
                    message: 'Security verification failed. Please try again.'
                });
            }

            req.captchaScore = result.score;
            next();
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Security verification error'
            });
        }
    };
};

export default {
    verifyCaptcha,
    optionalCaptcha,
    strictCaptcha
};
