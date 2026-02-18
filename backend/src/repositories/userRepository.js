import pool from '../config/db.js';
import crypto from 'crypto';

/**
 * User Repository - Data Access Layer
 * Handles all database operations for users
 */

// Helper for Node 14 compatibility (crypto.randomUUID is Node 15.6+)
const generateUUID = () => {
    if (crypto.randomUUID) return crypto.randomUUID();
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};

export const userRepository = {
    /**
     * Find user by email
     * @param {string} email 
     * @returns {Promise<Object|null>}
     */
    async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    },

    /**
     * Find user by ID
     * @param {string} userId 
     * @returns {Promise<Object|null>}
     */
    async findById(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE user_id = ?',
            [userId]
        );
        return rows[0] || null;
    },

    /**
     * Create new user
     * @param {Object} userData 
     * @returns {Promise<Object>}
     */
    async create(userData) {
        const { full_name, email, password_hash, role = 'patient', phone_number, is_active = true } = userData;
        const user_id = generateUUID();

        // Check if this is the FIRST user in the system
        const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
        const isFirstUser = userCount[0].count === 0;

        // If first user, force ADMIN role
        const finalRole = isFirstUser ? 'admin' : (role || 'patient');

        await pool.query(
            `INSERT INTO users (user_id, full_name, email, password_hash, role, phone_number, is_active) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user_id, full_name, email, password_hash, finalRole, phone_number, is_active]
        );

        return { user_id, full_name, email, role: finalRole };
    },

    /**
     * Update user password
     * @param {string} userId 
     * @param {string} passwordHash 
     * @returns {Promise<boolean>}
     */
    async updatePassword(userId, passwordHash) {
        const [result] = await pool.query(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [passwordHash, userId]
        );
        return result.affectedRows > 0;
    },

    /**
     * Check if email exists
     * @param {string} email 
     * @returns {Promise<boolean>}
     */
    async emailExists(email) {
        const [rows] = await pool.query(
            'SELECT 1 FROM users WHERE email = ?',
            [email]
        );
        return rows.length > 0;
    },

    /**
     * Get user profile (without sensitive data)
     * @param {string} userId 
     * @returns {Promise<Object|null>}
     */
    async getProfile(userId) {
        const [rows] = await pool.query(
            'SELECT user_id, full_name, email, role, created_at FROM users WHERE user_id = ?',
            [userId]
        );
        return rows[0] || null;
    },

    async activateAccount(userId) {
        await pool.query(
            'UPDATE users SET is_active = TRUE WHERE user_id = ?',
            [userId]
        );
    }
};
