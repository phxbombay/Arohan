import logger from '../config/logger.js';

/**
 * RBAC Middleware
 * Restricts access to routes based on user roles and permissions
 */

/**
 * Permission definitions for each role
 * Permissions are granular actions that can be performed
 */
export const PERMISSIONS = {
    // Admin has all permissions
    admin: ['*'],

    // Physician permissions
    physician: [
        'view_patients',
        'view_vitals',
        'view_alerts',
        'manage_prescriptions',
        'view_analytics',
        'schedule_appointments',
        'view_medical_history',
        'update_patient_notes'
    ],

    // Doctor permissions (limited compared to physician)
    doctor: [
        'view_patients',
        'view_vitals',
        'view_alerts',
        'view_medical_history'
    ],

    // Patient permissions
    patient: [
        'view_own_data',
        'view_own_vitals',
        'view_own_alerts',
        'update_profile',
        'manage_emergency_contacts',
        'view_prescriptions'
    ],

    // Caregiver permissions
    caregiver: [
        'view_assigned_patients',
        'view_patient_vitals',
        'receive_alerts',
        'update_care_notes',
        'view_medication_schedule'
    ],

    // Hospital Admin permissions
    hospital_admin: [
        'view_hospital_patients',
        'view_hospital_analytics',
        'manage_staff',
        'view_billing',
        'manage_departments',
        'view_audit_logs'
    ],

    // Partner/Vendor permissions
    partner: [
        'view_api_docs',
        'manage_integrations',
        'view_device_data',
        'submit_vitals',
        'receive_webhooks'
    ]
};

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
 * Check if user has required permission
 * @param {string} permission - Required permission
 * @returns {Function} Express middleware
 */
export const requirePermission = (permission) => {
    return (req, res, next) => {
        // Check if user is authenticated
        if (!req.user) {
            logger.warn('Permission check: No user found in request', { path: req.path });
            return res.status(401).json({
                status: 'fail',
                message: 'Not authorized, please login'
            });
        }

        // Get user's permissions (from role or custom permissions)
        const userPermissions = req.user.permissions || PERMISSIONS[req.user.role] || [];

        // Check for wildcard permission (admin)
        if (userPermissions.includes('*')) {
            logger.info('Permission check: Admin access granted', {
                userId: req.user.user_id,
                permission,
                path: req.path
            });
            return next();
        }

        // Check if user has the required permission
        if (!userPermissions.includes(permission)) {
            logger.warn('Permission check: Access denied', {
                userId: req.user.user_id,
                userRole: req.user.role,
                requiredPermission: permission,
                userPermissions,
                path: req.path
            });

            return res.status(403).json({
                status: 'fail',
                message: `Access denied. Required permission: ${permission}`
            });
        }

        // User has required permission, proceed
        logger.info('Permission check: Access granted', {
            userId: req.user.user_id,
            role: req.user.role,
            permission,
            path: req.path
        });

        next();
    };
};

/**
 * Check if user has any of the required permissions
 * @param {Array<string>} permissions - Array of permissions (user needs at least one)
 * @returns {Function} Express middleware
 */
export const requireAnyPermission = (permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'fail',
                message: 'Not authorized, please login'
            });
        }

        const userPermissions = req.user.permissions || PERMISSIONS[req.user.role] || [];

        // Check for wildcard or any matching permission
        if (userPermissions.includes('*') || permissions.some(p => userPermissions.includes(p))) {
            return next();
        }

        logger.warn('Permission check: Access denied (any)', {
            userId: req.user.user_id,
            requiredPermissions: permissions,
            userPermissions
        });

        return res.status(403).json({
            status: 'fail',
            message: 'Access denied. Insufficient permissions.'
        });
    };
};

/**
 * Convenience middleware for admin-only routes
 */
export const requireAdmin = requireRole(['admin']);

/**
 * Convenience middleware for physician and admin routes
 */
export const requirePhysician = requireRole(['physician', 'admin']);

/**
 * Convenience middleware for doctor, physician, and admin routes
 */
export const requireDoctor = requireRole(['doctor', 'physician', 'admin']);

/**
 * Convenience middleware for hospital admin routes
 */
export const requireHospitalAdmin = requireRole(['hospital_admin', 'admin']);

/**
 * Convenience middleware for caregiver routes
 */
export const requireCaregiver = requireRole(['caregiver', 'admin']);

/**
 * Convenience middleware for partner/vendor routes
 */
export const requirePartner = requireRole(['partner', 'admin']);

/**
 * Convenience middleware for authenticated users (any role)
 */
export const requireAuth = requireRole(['patient', 'doctor', 'physician', 'caregiver', 'hospital_admin', 'partner', 'admin']);

/**
 * Middleware to check if user can access specific patient data
 * Physicians/doctors can access their patients, patients can access their own data
 */
export const requirePatientAccess = async (req, res, next) => {
    const { user } = req;
    const patientId = req.params.patientId || req.params.userId;

    if (!user) {
        return res.status(401).json({
            status: 'fail',
            message: 'Not authorized'
        });
    }

    // Admin has access to all
    if (user.role === 'admin') {
        return next();
    }

    // Patient can only access their own data
    if (user.role === 'patient' && user.user_id === patientId) {
        return next();
    }

    // Physicians, doctors, and caregivers need to be assigned to the patient
    if (['physician', 'doctor', 'caregiver'].includes(user.role)) {
        // TODO: Check patient assignment in database
        // For now, allow access (implement proper check in production)
        return next();
    }

    logger.warn('Patient access denied', {
        userId: user.user_id,
        userRole: user.role,
        requestedPatientId: patientId
    });

    return res.status(403).json({
        status: 'fail',
        message: 'Access denied. You do not have access to this patient.'
    });
};
