import logger from '../config/logger.js';
import { AppError, ValidationError, DatabaseError } from '../utils/errors.js';

/**
 * Enhanced Error Handler Middleware
 * Handles all error types with proper logging and user-friendly responses
 */
const errorHandler = (err, req, res, next) => {
    // Set default values
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log error details
    const logContext = {
        error: err.message,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method,
        ip: req.ip,
        requestId: req.id,
        userId: req.user?.user_id
    };

    // Log based on severity
    if (err.statusCode >= 500) {
        logger.error('Server Error', {
            ...logContext,
            stack: err.stack,
            originalError: err.originalError
        });
    } else if (err.statusCode >= 400) {
        logger.warn('Client Error', logContext);
    }

    // Development mode - detailed error response
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            error: {
                name: err.name,
                message: err.message,
                stack: err.stack,
                errors: err.errors, // For validation errors
                ...(err.originalError && { originalError: err.originalError.message })
            }
        });
    }

    // Production mode - sanitized error response

    // Operational errors - safe to send to client
    if (err.isOperational) {
        const response = {
            status: err.status,
            message: err.message
        };

        // Include validation errors if present
        if (err instanceof ValidationError && err.errors) {
            response.errors = err.errors;
        }

        return res.status(err.statusCode).json(response);
    }

    // Programming or unknown errors - don't leak details
    logger.error('Unexpected Error', {
        error: err,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong. Please try again later.'
    });
};

export default errorHandler;
