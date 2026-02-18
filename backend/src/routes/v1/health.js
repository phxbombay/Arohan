import express from 'express';
import pool from '../../config/db.js';

const router = express.Router();

router.get('/db-check', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
        const [users] = await pool.query('SELECT email, role FROM users LIMIT 5');

        res.json({
            status: 'ok',
            message: 'Database connected successfully',
            user_count: rows[0].count,
            users: users,
            db_config: {
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                user: process.env.DB_USER
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

export default router;
