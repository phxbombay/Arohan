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

        // Store temp secret in DB
        await pool.query(
            'UPDATE users SET two_factor_secret = ? WHERE user_id = ?',
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

        const [rows] = await pool.query(
            'SELECT two_factor_secret FROM users WHERE user_id = ?',
            [userId]
        );

        if (rows.length === 0) {
            throw new AppError('User not found', 404);
        }

        const { two_factor_secret } = rows[0];

        const verified = speakeasy.totp.verify({
            secret: two_factor_secret,
            encoding: 'base32',
            token: token,
        });

        if (verified) {
            // Enable 2FA
            await pool.query(
                'UPDATE users SET two_factor_enabled = TRUE WHERE user_id = ?',
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
        const { token, userId } = req.body;

        let targetUserId = userId;
        if (req.user) targetUserId = req.user.user_id;

        const [rows] = await pool.query(
            'SELECT two_factor_secret FROM users WHERE user_id = ?',
            [targetUserId]
        );

        if (rows.length === 0) {
            throw new AppError('User not found', 404);
        }

        const { two_factor_secret } = rows[0];

        const verified = speakeasy.totp.verify({
            secret: two_factor_secret,
            encoding: 'base32',
            token: token,
        });

        if (verified) {
            res.json({ verified: true });
        } else {
            throw new AppError('Invalid token', 400);
        }

    } catch (error) {
        next(error);
    }
}
