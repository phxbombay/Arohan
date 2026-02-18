import pool from '../config/db.js';
import logger from '../config/logger.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * @desc    Get dashboard statistics
 * @route   GET /v1/admin/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res) => {
    try {
        const [usersCountResult] = await pool.query('SELECT COUNT(*) AS count FROM users').catch(err => {
            logger.error('Stats - Users Query Error:', err);
            return [[{ count: 0 }]];
        });
        const [messagesCountResult] = await pool.query('SELECT COUNT(*) AS count FROM contact_messages').catch(err => {
            logger.error('Stats - Messages Query Error:', err);
            return [[{ count: 0 }]];
        });
        const [logsCountResult] = await pool.query('SELECT COUNT(*) AS count FROM audit_logs').catch(err => {
            logger.error('Stats - Logs Query Error:', err);
            return [[{ count: 0 }]];
        });
        const [activeUsersResult] = await pool.query('SELECT COUNT(*) AS count FROM users WHERE is_active = 1').catch(err => {
            logger.error('Stats - Active Users Query Error:', err);
            return [[{ count: 0 }]];
        });

        res.json({
            status: 'success',
            data: {
                totalUsers: parseInt(usersCountResult[0]?.count || 0),
                activeUsers: parseInt(activeUsersResult[0]?.count || 0),
                totalMessages: parseInt(messagesCountResult[0]?.count || 0),
                totalLogs: parseInt(logsCountResult[0]?.count || 0),
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error('Admin Stats Global Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error fetching stats',
            data: { totalUsers: 0, activeUsers: 0, totalMessages: 0, totalLogs: 0 }
        });
    }
};

/**
 * @desc    Get all users
 * @route   GET /v1/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');

        const safeUsers = rows.map(user => {
            const { password_hash, mfa_secret, two_factor_secret, ...safeUser } = user;
            return safeUser;
        });

        res.json({
            status: 'success',
            count: safeUsers.length,
            data: safeUsers
        });
    } catch (error) {
        logger.error('Admin Users Error:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

/**
 * @desc    Get all contact messages
 * @route   GET /v1/admin/messages
 * @access  Private/Admin
 */
export const getAllMessages = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        ).catch(err => {
            logger.error('Admin Messages Query Error:', err);
            return [[], []];
        });

        res.json({
            status: 'success',
            count: rows.length,
            data: rows
        });
    } catch (error) {
        logger.error('Admin Messages Global Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error fetching messages',
            data: []
        });
    }
};

/**
 * @desc    Get system logs
 * @route   GET /v1/admin/logs
 * @access  Private/Admin
 */
export const getSystemLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const [rows] = await pool.query(
            'SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?',
            [limit]
        ).catch(err => {
            logger.error('Admin Logs Query Error:', err);
            return [[], []];
        });

        res.json({
            status: 'success',
            count: rows.length,
            data: rows
        });
    } catch (error) {
        logger.error('Admin Logs Global Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error fetching logs',
            data: []
        });
    }
};

/**
 * @desc    Get all orders
 * @route   GET /v1/admin/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM orders ORDER BY created_at DESC'
        ).catch(err => {
            logger.error('Admin Orders Query Error:', err);
            return [[], []];
        });

        res.json({
            status: 'success',
            count: rows.length,
            data: rows
        });
    } catch (error) {
        logger.error('Admin Orders Global Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error fetching orders',
            data: []
        });
    }
};

/**
 * @desc    Create a new user
 * @route   POST /v1/admin/users
 * @access  Private/Admin
 */
export const createUser = async (req, res) => {
    try {
        const { full_name, email, password, role, phone_number, address, date_of_birth, gender } = req.body;

        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user_id = crypto.randomUUID();
        const created_at = new Date();

        await pool.query(
            `INSERT INTO users (user_id, full_name, email, password_hash, role, phone_number, address, date_of_birth, gender, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, full_name, email, hashedPassword, role, phone_number, address, date_of_birth, gender, created_at]
        );

        res.status(201).json({
            status: 'success',
            data: { user_id, full_name, email, role, created_at }
        });
    } catch (error) {
        logger.error('Create User Error:', error);
        res.status(500).json({ message: 'Server error creating user' });
    }
};
