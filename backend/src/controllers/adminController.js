import pool from '../config/db.js';
import logger from '../config/logger.js';
import bcrypt from 'bcryptjs';

/**
 * @desc    Get dashboard statistics
 * @route   GET /v1/admin/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res) => {
    try {
        // Run queries in parallel for performance
        const [usersCount, messagesCount, logsCount, activeUsers] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM users'),
            pool.query('SELECT COUNT(*) FROM contact_messages'),
            pool.query('SELECT COUNT(*) FROM audit_logs'),
            pool.query('SELECT COUNT(*) FROM users WHERE is_active = true') // Assuming is_active column exists
        ]);

        res.json({
            status: 'success',
            data: {
                totalUsers: parseInt(usersCount.rows[0].count),
                activeUsers: parseInt(activeUsers.rows[0].count),
                totalMessages: parseInt(messagesCount.rows[0].count),
                totalLogs: parseInt(logsCount.rows[0].count),
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error('Admin Stats Error:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

/**
 * @desc    Get all users
 * @route   GET /v1/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, full_name, email, role, created_at, is_active FROM users ORDER BY created_at DESC'
        );

        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
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
        const result = await pool.query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );

        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        logger.error('Admin Messages Error:', error);
        res.status(500).json({ message: 'Server error fetching messages' });
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
        const result = await pool.query(
            'SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT $1',
            [limit]
        );

        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        logger.error('Admin Logs Error:', error);
        res.status(500).json({ message: 'Server error fetching logs' });
    }
};

/**
 * @desc    Get all orders
 * @route   GET /v1/admin/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res) => {
    try {
        // Query orders 
        // Note: 'payment_method' column name might be camelCase in DB if I used quotes, or snake_case
        // In razorpayController I used "paymentMethod". Postgres creates lowercase by default unless quoted.
        // I will assume standard snake_case or case-insensitive matching for unquoted creation.
        // Let's check schema.sql again if uncertain.
        // Schema said: paymentMethod (camelCase?)
        // Wait, schema.sql step 779: paymentMethod VARCHAR(20) ...
        // Postgres creates this as "paymentmethod" (lowercase) unless quoted "paymentMethod".
        // I should check schema creation style.
        // Step 779: CREATE TABLE IF NOT EXISTS orders ( ... paymentMethod ... )  -> lowercase 'paymentmethod'
        // But in razorpayController I used: INSERT INTO orders (... currency, status ...)
        // I did NOT specify columns in INSERT?
        // Wait, step 790: INSERT INTO orders (order_id, user_id, amount, currency, status, receipt) ...
        // I did NOT insert paymentMethod?
        // Oh, schema.sql has `paymentMethod` as REQUIRED?
        // Step 779 Line 18: paymentMethod type String... Wait, schema.sql showed Mongoose schema style in comments?
        // No, Schema.sql (Step 779) lines 163+ showed "ORDERS table" for Razorpay.
        // Line 163: order_id, user_id, amount...
        // It did NOT have paymentMethod in the SQL table definition in the "PAYMENT GATEWAY TABLES" section?
        // Let's re-read Step 779 lines 163-171.

        // Line 163: CREATE TABLE IF NOT EXISTS orders ( order_id, user_id, amount, currency, receipt, status, created_at )
        // IT DOES NOT HAVE payment_method column!
        // But `payments` table has `method`.

        // This means I can't select `payment_method` from `orders` table if it doesn't exist.
        // I should select from `orders` and maybe join `payments`?
        // Or just return what is in `orders`.

        const result = await pool.query(
            'SELECT order_id, user_id, amount, currency, status, receipt, created_at FROM orders ORDER BY created_at DESC'
        );

        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        logger.error('Admin Orders Error:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
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

        // Check if user exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const newUser = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, role, phone_number, address, date_of_birth, gender)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING user_id, full_name, email, role, created_at`,
            [full_name, email, hashedPassword, role, phone_number, address, date_of_birth, gender]
        );

        res.status(201).json({
            status: 'success',
            data: newUser.rows[0]
        });
    } catch (error) {
        logger.error('Create User Error:', error);
        res.status(500).json({ message: 'Server error creating user' });
    }
};
