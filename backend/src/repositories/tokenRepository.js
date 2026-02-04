import pool from '../config/db.js';

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
        const result = await pool.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) 
             VALUES ($1, $2, NOW() + INTERVAL '7 days')
             RETURNING id`,
            [userId, tokenHash]
        );
        return result.rows[0];
    },

    /**
     * Find valid refresh token
     * @param {string} tokenHash 
     * @returns {Promise<Object|null>}
     */
    async findValid(tokenHash) {
        const result = await pool.query(
            `SELECT * FROM refresh_tokens 
             WHERE token_hash = $1 
             AND expires_at > NOW() 
             AND revoked_at IS NULL`,
            [tokenHash]
        );
        return result.rows[0] || null;
    },

    /**
     * Revoke token by ID
     * @param {string} tokenId 
     * @returns {Promise<boolean>}
     */
    async revoke(tokenId) {
        const result = await pool.query(
            'UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1',
            [tokenId]
        );
        return result.rowCount > 0;
    },

    /**
     * Revoke token by hash
     * @param {string} tokenHash 
     * @returns {Promise<boolean>}
     */
    async revokeByHash(tokenHash) {
        const result = await pool.query(
            'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1',
            [tokenHash]
        );
        return result.rowCount > 0;
    },

    /**
     * Revoke all tokens for a user
     * @param {string} userId 
     * @returns {Promise<number>}
     */
    async revokeAllForUser(userId) {
        const result = await pool.query(
            'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
            [userId]
        );
        return result.rowCount;
    },

    /**
     * Clean up expired tokens
     * @returns {Promise<number>}
     */
    async cleanExpired() {
        const result = await pool.query(
            'DELETE FROM refresh_tokens WHERE expires_at < NOW() - INTERVAL \'30 days\''
        );
        return result.rowCount;
    }
};
