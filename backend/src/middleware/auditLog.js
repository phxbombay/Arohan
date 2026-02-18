import logger from '../config/logger.js';
import pool from '../config/db.js';

/**
 * Audit Log Middleware
 * Logs important security and user events
 */

export const auditLog = async (action, resource, metadata = {}) => {
    try {
        const userId = metadata.userId || null;
        const ipAddress = metadata.ipAddress || null;
        const userAgent = metadata.userAgent || null;

        // Check if metadata column exists in DB, if not index.js sets it up differently or we skip
        // Current schema: actor_user_id, action, target_record_id (UUID), ip_address, user_agent, timestamp
        // We will skip target_record_id if resource is not UUID, and skip metadata if no column.

        const targetId = (resource && /^[0-9a-fA-F-]{36}$/.test(resource)) ? resource : null;

        await pool.query(
            `INSERT INTO audit_logs (actor_user_id, action, target_record_id, ip_address, user_agent, timestamp)
       VALUES (?, ?, ?, ?, ?, NOW())`,
            [userId, action, targetId, ipAddress, userAgent]
        );

        logger.info('Audit log created', {
            userId,
            action,
            resource, // Logged here even if not in DB
            metadata  // Logged here
        });
    } catch (error) {
        logger.error('Failed to create audit log', { error: error.message });
    }
};

/**
 * Middleware to automatically log API requests
 */
export const auditMiddleware = (action) => {
    return async (req, res, next) => {
        try {
            await auditLog(action, req.path, {
                userId: req.user?.user_id,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
                method: req.method,
                body: req.body,
            });
        } catch (error) {
            logger.error('Audit middleware error', { error: error.message });
        }
        next();
    };
};

/**
 * Log authentication events
 */
export const logAuthEvent = async (event, userId, success, metadata = {}) => {
    await auditLog(`auth_${event}`, 'auth', {
        userId,
        success,
        ...metadata,
    });
};

/**
 * Log RBAC events
 */
export const logAccessControl = async (userId, resource, action, granted) => {
    await auditLog('access_control', resource, {
        userId,
        action,
        granted,
    });
};

export default { auditLog, auditMiddleware, logAuthEvent, logAccessControl };
