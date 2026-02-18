import pool from '../config/db.js';
import crypto from 'crypto';

const generateUUID = () => {
    if (crypto.randomUUID) return crypto.randomUUID();
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};

export const otpRepository = {
    async create(otpData) {
        const { user_id, otp_code, purpose, expires_at } = otpData;
        const otp_id = generateUUID();

        await pool.query(
            'INSERT INTO user_otps (otp_id, user_id, otp_code, purpose, expires_at) VALUES (?, ?, ?, ?, ?)',
            [otp_id, user_id, otp_code, purpose, expires_at]
        );

        return { otp_id, ...otpData };
    },

    async findValid(user_id, otp_code, purpose) {
        const [rows] = await pool.query(
            `SELECT * FROM user_otps 
             WHERE user_id = ? AND otp_code = ? AND purpose = ? 
             AND is_used = FALSE AND expires_at > NOW()
             ORDER BY created_at DESC LIMIT 1`,
            [user_id, otp_code, purpose]
        );
        return rows[0] || null;
    },

    async markAsUsed(otp_id) {
        await pool.query(
            'UPDATE user_otps SET is_used = TRUE WHERE otp_id = ?',
            [otp_id]
        );
    },

    async invalidateAll(user_id, purpose) {
        await pool.query(
            'UPDATE user_otps SET is_used = TRUE WHERE user_id = ? AND purpose = ?',
            [user_id, purpose]
        );
    }
};
