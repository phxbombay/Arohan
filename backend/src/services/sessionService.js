import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/db.js';
import logger from '../config/logger.js';

/**
 * Session Management Service
 * Handles refresh tokens, session tracking, and multi-device management
 */

/**
 * Generate access and refresh tokens
 */
export const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
        { id: userId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
};

/**
 * Create a new session
 */
export const createSession = async (userId, refreshToken, deviceInfo = {}) => {
    try {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        const { rows } = await pool.query(
            `INSERT INTO user_sessions (user_id, refresh_token, device_info, ip_address, user_agent, expires_at)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING session_id`,
            [
                userId,
                refreshToken,
                JSON.stringify(deviceInfo),
                deviceInfo.ipAddress || null,
                deviceInfo.userAgent || null,
                expiresAt
            ]
        );

        logger.info('Session created', { userId, sessionId: rows[0].session_id });
        return rows[0].session_id;
    } catch (error) {
        logger.error('Failed to create session', { error: error.message, userId });
        throw error;
    }
};

/**
 * Verify and refresh access token
 */
export const refreshAccessToken = async (refreshToken) => {
    try {
        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );

        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }

        // Check if session exists and is active
        const { rows } = await pool.query(
            `SELECT user_id, expires_at, is_active 
             FROM user_sessions 
             WHERE refresh_token = $1`,
            [refreshToken]
        );

        if (rows.length === 0) {
            throw new Error('Session not found');
        }

        const session = rows[0];

        if (!session.is_active) {
            throw new Error('Session is inactive');
        }

        if (new Date(session.expires_at) < new Date()) {
            throw new Error('Session expired');
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { id: session.user_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
        );

        // Update session activity
        await pool.query(
            'UPDATE user_sessions SET last_activity = NOW() WHERE refresh_token = $1',
            [refreshToken]
        );

        logger.info('Access token refreshed', { userId: session.user_id });

        return { accessToken, userId: session.user_id };
    } catch (error) {
        logger.error('Token refresh failed', { error: error.message });
        throw error;
    }
};

/**
 * Revoke a session (logout)
 */
export const revokeSession = async (refreshToken) => {
    try {
        await pool.query(
            'UPDATE user_sessions SET is_active = false WHERE refresh_token = $1',
            [refreshToken]
        );

        logger.info('Session revoked');
    } catch (error) {
        logger.error('Failed to revoke session', { error: error.message });
        throw error;
    }
};

/**
 * Revoke all sessions for a user
 */
export const revokeAllSessions = async (userId) => {
    try {
        await pool.query(
            'UPDATE user_sessions SET is_active = false WHERE user_id = $1',
            [userId]
        );

        logger.info('All sessions revoked', { userId });
    } catch (error) {
        logger.error('Failed to revoke all sessions', { error: error.message, userId });
        throw error;
    }
};

/**
 * Get active sessions for a user
 */
export const getUserSessions = async (userId) => {
    try {
        const { rows } = await pool.query(
            `SELECT session_id, device_info, ip_address, created_at, last_activity, expires_at
             FROM user_sessions
             WHERE user_id = $1 AND is_active = true AND expires_at > NOW()
             ORDER BY last_activity DESC`,
            [userId]
        );

        return rows;
    } catch (error) {
        logger.error('Failed to get user sessions', { error: error.message, userId });
        throw error;
    }
};

/**
 * Create password reset token
 */
export const createPasswordResetToken = async (userId) => {
    try {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

        await pool.query(
            `INSERT INTO password_reset_tokens (user_id, token, expires_at)
             VALUES ($1, $2, $3)`,
            [userId, token, expiresAt]
        );

        logger.info('Password reset token created', { userId });
        return token;
    } catch (error) {
        logger.error('Failed to create password reset token', { error: error.message, userId });
        throw error;
    }
};

/**
 * Verify password reset token
 */
export const verifyPasswordResetToken = async (token) => {
    try {
        const { rows } = await pool.query(
            `SELECT user_id, expires_at, used
             FROM password_reset_tokens
             WHERE token = $1`,
            [token]
        );

        if (rows.length === 0) {
            throw new Error('Invalid token');
        }

        const resetToken = rows[0];

        if (resetToken.used) {
            throw new Error('Token already used');
        }

        if (new Date(resetToken.expires_at) < new Date()) {
            throw new Error('Token expired');
        }

        return resetToken.user_id;
    } catch (error) {
        logger.error('Password reset token verification failed', { error: error.message });
        throw error;
    }
};

/**
 * Mark password reset token as used
 */
export const markTokenAsUsed = async (token) => {
    try {
        await pool.query(
            'UPDATE password_reset_tokens SET used = true WHERE token = $1',
            [token]
        );

        logger.info('Password reset token marked as used');
    } catch (error) {
        logger.error('Failed to mark token as used', { error: error.message });
        throw error;
    }
};

/**
 * Clean up expired sessions and tokens
 */
export const cleanupExpired = async () => {
    try {
        const { rowCount: sessionsDeleted } = await pool.query(
            'DELETE FROM user_sessions WHERE expires_at < NOW()'
        );

        const { rowCount: tokensDeleted } = await pool.query(
            'DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = true'
        );

        logger.info('Cleanup completed', { sessionsDeleted, tokensDeleted });
    } catch (error) {
        logger.error('Cleanup failed', { error: error.message });
    }
};

export default {
    generateTokens,
    createSession,
    refreshAccessToken,
    revokeSession,
    revokeAllSessions,
    getUserSessions,
    createPasswordResetToken,
    verifyPasswordResetToken,
    markTokenAsUsed,
    cleanupExpired
};
