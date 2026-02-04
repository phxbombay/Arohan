import pool from '../config/db.js';

/**
 * User Repository - Data Access Layer
 * Handles all database operations for users
 */

export const userRepository = {
    /**
     * Find user by email
     * @param {string} email 
     * @returns {Promise<Object|null>}
     */
    async findByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    },

    /**
     * Find user by ID
     * @param {string} userId 
     * @returns {Promise<Object|null>}
     */
    async findById(userId) {
        const result = await pool.query(
            'SELECT * FROM users WHERE user_id = $1',
            [userId]
        );
        return result.rows[0] || null;
    },

    /**
     * Create new user
     * @param {Object} userData 
     * @returns {Promise<Object>}
     */
    async create(userData) {
        const { full_name, email, password_hash, role = 'patient' } = userData;

        const result = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, role) 
             VALUES ($1, $2, $3, $4) 
             RETURNING user_id, full_name, email, role`,
            [full_name, email, password_hash, role]
        );

        return result.rows[0];
    },

    /**
     * Update user password
     * @param {string} userId 
     * @param {string} passwordHash 
     * @returns {Promise<boolean>}
     */
    async updatePassword(userId, passwordHash) {
        const result = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE user_id = $2',
            [passwordHash, userId]
        );
        return result.rowCount > 0;
    },

    /**
     * Check if email exists
     * @param {string} email 
     * @returns {Promise<boolean>}
     */
    async emailExists(email) {
        const result = await pool.query(
            'SELECT 1 FROM users WHERE email = $1',
            [email]
        );
        return result.rows.length > 0;
    },

    /**
     * Get user profile (without sensitive data)
     * @param {string} userId 
     * @returns {Promise<Object|null>}
     */
    async getProfile(userId) {
        const result = await pool.query(
            'SELECT user_id, full_name, email, role, created_at FROM users WHERE user_id = $1',
            [userId]
        );
        return result.rows[0] || null;
    }
};
