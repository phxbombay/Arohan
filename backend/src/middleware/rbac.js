import logger from '../config/logger.js';

/**
 * RBAC Middleware
 * Restricts access to routes based on user roles
 */

/**
 * Check if user has required role
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {Function} Express middleware
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Check if user is authenticated (added by protect middleware)
        if (!req.user) {
            logger.warn('RBAC: No user found in request', { path: req.path });
            return res.status(401).json({
                status: 'fail',
                message: 'Not authorized, please login'
            });
        }

        // Check if user role is in allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            logger.warn('RBAC: Access denied', {
                userId: req.user.user_id,
                userRole: req.user.role,
                requiredRoles: allowedRoles,
                path: req.path
            });

            return res.status(403).json({
                status: 'fail',
                message: 'Access denied. Insufficient permissions.'
            });
        }

        // User has required role, proceed
        logger.info('RBAC: Access granted', {
            userId: req.user.user_id,
            role: req.user.role,
            path: req.path
        });

        next();
    };
};

/**
 * Convenience middleware for admin-only routes
 */
export const requireAdmin = requireRole(['admin']);

/**
 * Convenience middleware for doctor and admin routes
 */
export const requireDoctor = requireRole(['doctor', 'admin']);

/**
 * Convenience middleware for authenticated users (any role)
 */
export const requireAuth = requireRole(['patient', 'doctor', 'admin']);
