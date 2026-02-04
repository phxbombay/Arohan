/**
 * Base Application Error Class
 * All custom errors inherit from this
 */
export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation Error (400)
 * Used for input validation failures
 */
export class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 400);
        this.errors = errors;
        this.name = 'ValidationError';
    }
}

/**
 * Authentication Error (401)
 * Used for authentication failures
 */
export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

/**
 * Authorization Error (403)
 * Used for permission/authorization failures
 */
export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403);
        this.name = 'AuthorizationError';
    }
}

/**
 * Not Found Error (404)
 * Used when resource doesn't exist
 */
export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

/**
 * Conflict Error (409)
 * Used for conflicts like duplicate entries
 */
export class ConflictError extends AppError {
    constructor(message = 'Resource conflict') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

/**
 * Rate Limit Error (429)
 * Used when rate limits are exceeded
 */
export class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429);
        this.name = 'RateLimitError';
    }
}

/**
 * Database Error (500)
 * Used for database-related errors
 */
export class DatabaseError extends AppError {
    constructor(message = 'Database operation failed', originalError = null) {
        super(message, 500, false);
        this.originalError = originalError;
        this.name = 'DatabaseError';
    }
}

/**
 * External Service Error (502/503)
 * Used for third-party service failures
 */
export class ExternalServiceError extends AppError {
    constructor(service, message = 'External service unavailable') {
        super(message, 503, false);
        this.service = service;
        this.name = 'ExternalServiceError';
    }
}

// Default export for backward compatibility
export default AppError;
