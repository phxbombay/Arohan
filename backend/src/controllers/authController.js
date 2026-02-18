import { authService } from '../services/authService.js';
import logger from '../config/logger.js';

/**
 * Helper to set refresh token cookie
 */
const setTokenCookie = (res, token) => {
    const cookieOptions = {
        httpOnly: true,
        secure: false, // process.env.NODE_ENV === 'production', // FORCE FALSE FOR DEBUGGING
        sameSite: 'lax', // Relaxed from strict for debugging
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
    console.log('🍪 Setting Cookie:', { token: token?.substring(0, 10) + '...', options: cookieOptions });
    res.cookie('refreshToken', token, cookieOptions);
};

// @desc    Register a new user
// @route   POST /v1/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { full_name, email, password, role, phone_number } = req.body;

        const result = await authService.register({
            full_name,
            email,
            password,
            role,
            phone_number
        });

        // Set refresh token cookie
        setTokenCookie(res, result.refreshToken);

        res.status(201).json({
            user_id: result.user.user_id,
            full_name: result.user.full_name,
            email: result.user.email,
            role: result.user.role,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            message: result.message
        });
    } catch (error) {
        logger.error('Register Error:', { error: error.message, stack: error.stack });
        next(error);
    }
};

// @desc    Verify Registration OTP
// @route   POST /v1/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res, next) => {
    try {
        const { user_id, otp_code } = req.body;

        const result = await authService.verifyRegistration(user_id, otp_code);

        setTokenCookie(res, result.refreshToken);

        res.json({
            user_id: result.user.user_id,
            full_name: result.user.full_name,
            email: result.user.email,
            role: result.user.role,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken, // Return refresh token for non-browser clients
            message: 'Account verified successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Resend Registration OTP
// @route   POST /v1/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res, next) => {
    try {
        const { user_id } = req.body;

        await authService.resendRegistrationOTP(user_id);

        res.json({ message: 'Verification code resent successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /v1/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        logger.info('Login attempt', { email });

        const result = await authService.login(email, password);

        setTokenCookie(res, result.refreshToken);

        const loginResponse = {
            user_id: result.user.user_id,
            full_name: result.user.full_name,
            email: result.user.email,
            role: result.user.role,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken // Return refresh token for non-browser clients
        };

        // DEBUG: Write to file
        const fs = await import('fs');
        const logMsg = `LOGIN SUCCESS: ${new Date().toISOString()} - Email: ${email} - Role: ${result.user.role}\n`;
        try {
            fs.appendFileSync('login_debug.log', logMsg);
        } catch (e) { console.error("Log failed", e); }

        logger.info('Login successful - sending response', {
            email: loginResponse.email,
            role: loginResponse.role,
            roleType: typeof loginResponse.role
        });

        res.json(loginResponse);
    } catch (error) {
        logger.error('Login Error:', { error: error.message, stack: error.stack });
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /v1/auth/refresh-token
// @access  Public (via Cookie or Body)
export const refreshToken = async (req, res, next) => {
    try {
        // Check cookie first, then body
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        const result = await authService.refreshAccessToken(refreshToken);

        setTokenCookie(res, result.refreshToken);

        res.json({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken // Return new refresh token
        });
    } catch (error) {
        // Only clear cookie if it exists (don't clear if using body token)
        if (req.cookies.refreshToken) {
            res.clearCookie('refreshToken');
        }
        logger.error('Refresh Token Error:', { error: error.message });
        next(error);
    }
};

// @desc    Logout user
// @route   POST /v1/auth/logout
// @access  Public
export const logoutUser = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        await authService.logout(refreshToken);

        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        logger.error('Logout Error:', { error: error.message });
        next(error);
    }
};
