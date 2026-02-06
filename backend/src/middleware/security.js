import helmet from 'helmet';
import logger from '../config/logger.js';

/**
 * Security Middleware
 * Implements security best practices including headers, CSP, and CORS
 */

/**
 * Security headers using Helmet
 */
export const securityHeaders = helmet({
    // HTTP Strict Transport Security
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },

    // Content Security Policy
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google.com", "https://www.gstatic.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https://api.arohanhealth.com"],
            frameSrc: ["'self'", "https://www.google.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },

    // Referrer Policy
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    },

    // X-Frame-Options
    frameguard: {
        action: 'deny'
    },

    // X-Content-Type-Options
    noSniff: true,

    // X-XSS-Protection
    xssFilter: true,

    // Hide X-Powered-By
    hidePoweredBy: true
});

/**
 * CORS configuration
 */
export const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://arohanhealth.com',
            'https://www.arohanhealth.com',
            'https://app.arohanhealth.com',
            process.env.FRONTEND_URL
        ];

        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Development mode
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            logger.warn('CORS: Blocked request from unauthorized origin', { origin });
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

/**
 * Request sanitization middleware
 * Removes potentially dangerous characters from request data
 */
export const sanitizeRequest = (req, res, next) => {
    // Sanitize query parameters
    if (req.query) {
        for (let key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
            }
        }
    }

    // Sanitize body parameters
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        }
    }

    next();
};

/**
 * SQL Injection prevention middleware
 * Detects and blocks common SQL injection patterns
 */
export const preventSQLInjection = (req, res, next) => {
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
        /(UNION\s+SELECT)/i,
        /(--|\#|\/\*|\*\/)/,
        /(\bOR\b\s+\d+\s*=\s*\d+)/i,
        /(\bAND\b\s+\d+\s*=\s*\d+)/i
    ];

    const checkValue = (value) => {
        if (typeof value !== 'string') return false;
        return sqlPatterns.some(pattern => pattern.test(value));
    };

    // Check query parameters
    if (req.query) {
        for (let key in req.query) {
            if (checkValue(req.query[key])) {
                logger.warn('SQL Injection attempt detected in query', {
                    key,
                    value: req.query[key],
                    ip: req.ip,
                    userAgent: req.get('user-agent')
                });
                return res.status(400).json({
                    status: 'fail',
                    message: 'Invalid input detected'
                });
            }
        }
    }

    // Check body parameters
    if (req.body) {
        for (let key in req.body) {
            if (checkValue(req.body[key])) {
                logger.warn('SQL Injection attempt detected in body', {
                    key,
                    value: req.body[key],
                    ip: req.ip,
                    userAgent: req.get('user-agent')
                });
                return res.status(400).json({
                    status: 'fail',
                    message: 'Invalid input detected'
                });
            }
        }
    }

    next();
};

/**
 * XSS prevention middleware
 * Detects and blocks common XSS patterns
 */
export const preventXSS = (req, res, next) => {
    const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi
    ];

    const checkValue = (value) => {
        if (typeof value !== 'string') return false;
        return xssPatterns.some(pattern => pattern.test(value));
    };

    // Check all request data
    const checkObject = (obj, path = '') => {
        for (let key in obj) {
            const currentPath = path ? `${path}.${key}` : key;

            if (typeof obj[key] === 'object' && obj[key] !== null) {
                checkObject(obj[key], currentPath);
            } else if (checkValue(obj[key])) {
                logger.warn('XSS attempt detected', {
                    path: currentPath,
                    value: obj[key],
                    ip: req.ip,
                    userAgent: req.get('user-agent')
                });
                return true;
            }
        }
        return false;
    };

    if (checkObject(req.query) || checkObject(req.body)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid input detected'
        });
    }

    next();
};

/**
 * Request logging middleware for security audit
 */
export const securityAuditLog = (req, res, next) => {
    const logData = {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString(),
        userId: req.user?.user_id || 'anonymous'
    };

    // Log sensitive endpoints
    const sensitiveEndpoints = ['/api/auth', '/api/admin', '/api/users'];
    if (sensitiveEndpoints.some(endpoint => req.path.startsWith(endpoint))) {
        logger.info('Security audit: Sensitive endpoint accessed', logData);
    }

    next();
};

/**
 * Prevent parameter pollution
 */
export const preventParameterPollution = (req, res, next) => {
    // Check for duplicate parameters
    const checkDuplicates = (obj) => {
        for (let key in obj) {
            if (Array.isArray(obj[key]) && obj[key].length > 1) {
                logger.warn('Parameter pollution detected', {
                    parameter: key,
                    values: obj[key],
                    ip: req.ip
                });
                // Take the first value only
                obj[key] = obj[key][0];
            }
        }
    };

    if (req.query) checkDuplicates(req.query);
    if (req.body) checkDuplicates(req.body);

    next();
};

/**
 * IP-based access control (optional)
 * Whitelist/blacklist IP addresses
 */
export const ipAccessControl = (options = {}) => {
    const { whitelist = [], blacklist = [] } = options;

    return (req, res, next) => {
        const clientIp = req.ip || req.connection.remoteAddress;

        // Check blacklist first
        if (blacklist.length > 0 && blacklist.includes(clientIp)) {
            logger.warn('Blocked IP address', { ip: clientIp });
            return res.status(403).json({
                status: 'fail',
                message: 'Access denied'
            });
        }

        // Check whitelist (if configured)
        if (whitelist.length > 0 && !whitelist.includes(clientIp)) {
            logger.warn('IP not in whitelist', { ip: clientIp });
            return res.status(403).json({
                status: 'fail',
                message: 'Access denied'
            });
        }

        next();
    };
};

export default {
    securityHeaders,
    corsOptions,
    sanitizeRequest,
    preventSQLInjection,
    preventXSS,
    securityAuditLog,
    preventParameterPollution,
    ipAccessControl
};
