import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import pool from '../config/db.js';
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';
import { auditLog } from '../middleware/auditLog.js';

export const setupTwoFactor = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `ArohanHealth (${req.user.email})`,
        });

        // Store temp secret in DB (or memory - here we store but not enable yet)
        await pool.query(
            'UPDATE users SET two_factor_secret = $1 WHERE user_id = $2',
            [secret.base32, userId]
        );

        // Generate QR code
        const dataUrl = await qrcode.toDataURL(secret.otpauth_url);

        res.json({
            secret: secret.base32,
            qrCode: dataUrl,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyTwoFactor = async (req, res, next) => {
    try {
        const { token } = req.body;
        const userId = req.user.user_id;

        const result = await pool.query(
            'SELECT two_factor_secret FROM users WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            throw new AppError('User not found', 404);
        }

        const { two_factor_secret } = result.rows[0];

        const verified = speakeasy.totp.verify({
            secret: two_factor_secret,
            encoding: 'base32',
            token: token,
        });

        if (verified) {
            // Enable 2FA
            await pool.query(
                'UPDATE users SET two_factor_enabled = TRUE WHERE user_id = $1',
                [userId]
            );

            await auditLog('enable_2fa', 'users', { userId });

            res.json({ message: '2FA enabled successfully' });
        } else {
            throw new AppError('Invalid token', 400);
        }
    } catch (error) {
        next(error);
    }
};

export const validateTwoFactor = async (req, res, next) => {
    try {
        const { token, userId } = req.body; // userId provided if coming from login flow intermediate step

        // In a real login flow, userId would come from a temporary session or signed partial token
        // For simplicity here, we assume standard auth middleware might be skipped or handle this
        // This controller method is usually for the /auth/2fa/verify endpoint during login

        let targetUserId = userId;
        if (req.user) targetUserId = req.user.user_id;

        const result = await pool.query(
            'SELECT two_factor_secret FROM users WHERE user_id = $1',
            [targetUserId]
        );

        if (result.rows.length === 0) {
            throw new AppError('User not found', 404);
        }

        const { two_factor_secret } = result.rows[0];

        const verified = speakeasy.totp.verify({
            secret: two_factor_secret,
            encoding: 'base32',
            token: token,
        });

        if (verified) {
            // If this was part of login, we would issue the full JWT here
            res.json({ verified: true });
        } else {
            throw new AppError('Invalid token', 400);
        }

    } catch (error) {
        next(error);
    }
}
