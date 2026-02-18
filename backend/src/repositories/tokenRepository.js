import pool from '../config/db.js';
import crypto from 'crypto';

/**
 * Token Repository - Data Access Layer
 * Handles all database operations for refresh tokens
 */

export const tokenRepository = {
    /**
     * Store new refresh token
     * @param {string} userId 
     * @param {string} tokenHash 
     * @returns {Promise<Object>}
     */
    async create(userId, tokenHash) {
        const id = crypto.randomUUID();
        await pool.query(
            `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) 
             VALUES (?, ?, ?, NOW() + INTERVAL 7 DAY)`,
            [id, userId, tokenHash]
        );
        return { id };
    },

    /**
     * Find valid refresh token
     * @param {string} tokenHash 
     * @returns {Promise<Object|null>}
     */
    async findValid(tokenHash) {
        const [rows] = await pool.query(
            `SELECT * FROM refresh_tokens 
             WHERE token_hash = ? 
             AND expires_at > NOW() 
             AND revoked_at IS NULL`,
            [tokenHash]
        );
        return rows[0] || null;
    },

    /**
     * Revoke token by ID
     * @param {string} tokenId 
     * @returns {Promise<boolean>}
     */
    async revoke(tokenId) {
        const [result] = await pool.query(
            'UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = ?',
            [tokenId]
        );
        return result.affectedRows > 0;
    },

    /**
     * Revoke token by hash
     * @param {string} tokenHash 
     * @returns {Promise<boolean>}
     */
    async revokeByHash(tokenHash) {
        const [result] = await pool.query(
            'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?',
            [tokenHash]
        );
        return result.affectedRows > 0;
    },

    /**
     * Revoke all tokens for a user
     * @param {string} userId 
     * @returns {Promise<number>}
     */
    async revokeAllForUser(userId) {
        const [result] = await pool.query(
            'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL',
            [userId]
        );
        return result.affectedRows;
    },

    /**
     * Clean up expired tokens
     * @returns {Promise<number>}
     */
    async cleanExpired() {
        const [result] = await pool.query(
            `DELETE FROM refresh_tokens WHERE expires_at < NOW() - INTERVAL 30 DAY`
        );
        return result.affectedRows;
    }
};
