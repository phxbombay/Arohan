import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import logger from '../config/logger.js';

/**
 * Protect middleware - Verifies JWT token and loads user data
 */
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Load user - use * to handle potential schema mismatches gracefully
            const [rows] = await pool.query(
                `SELECT * FROM users WHERE user_id = ?`,
                [decoded.id]
            );

            if (rows.length === 0) {
                logger.warn('Auth: User not found', { userId: decoded.id });
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            const user = rows[0];

            // Add defaults for missing columns to prevent crashes
            user.permissions = user.permissions || [];
            user.role = user.role || 'patient';

            // Check if account is locked (if column exists)
            if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
                logger.warn('Auth: Account locked', { userId: user.user_id });
                return res.status(403).json({
                    message: 'Account is locked. Please try again later or contact support.',
                    lockedUntil: user.account_locked_until
                });
            }

            // Update last login timestamp (optional, swallow error if column missing)
            try {
                await pool.query(
                    'UPDATE users SET last_login = NOW() WHERE user_id = ?',
                    [user.user_id]
                ).catch(() => { /* column likely missing */ });
            } catch (e) {
                // Ignore update failure
            }

            req.user = user;
            logger.info('Auth: User authenticated', { userId: user.user_id, role: user.role });
            next();
        } catch (error) {
            logger.error('Auth: Token verification failed', { error: error.message });

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: 'Token expired',
                    code: 'TOKEN_EXPIRED'
                });
            }

            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        logger.warn('Auth: No token provided');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * Optional auth middleware - Loads user if token present, but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const [rows] = await pool.query(
                'SELECT user_id, full_name, email, role, permissions FROM users WHERE user_id = ?',
                [decoded.id]
            );

            if (rows.length > 0) {
                req.user = rows[0];
            }
        } catch (error) {
            // Silently fail for optional auth
            logger.debug('Optional auth: Token invalid or expired');
        }
    }

    next();
};
