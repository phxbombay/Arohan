import { z } from 'zod';
import { ValidationError } from '../utils/errors.js';

/**
 * Validation Schemas
 * Define all input validation schemas using Zod
 */

// Auth Schemas
export const registerSchema = z.object({
    full_name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),

    email: z.string()
        .email('Invalid email address')
        .toLowerCase()
        .trim(),

    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),

    role: z.enum(['patient', 'doctor', 'admin']).optional().default('patient')
});

export const loginSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .toLowerCase()
        .trim(),

    password: z.string()
        .min(1, 'Password is required')
});

// User Schemas
export const updateProfileSchema = z.object({
    full_name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim()
        .optional(),

    email: z.string()
        .email('Invalid email address')
        .toLowerCase()
        .trim()
        .optional()
});

export const changePasswordSchema = z.object({
    currentPassword: z.string()
        .min(1, 'Current password is required'),

    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
});

// Order Schemas
export const createOrderSchema = z.object({
    amount: z.number()
        .positive('Amount must be positive')
        .int('Amount must be an integer'),

    currency: z.string()
        .length(3, 'Currency code must be 3 characters')
        .toUpperCase()
        .default('INR'),

    customer_details: z.object({
        name: z.string().min(1, 'Customer name is required'),
        email: z.string().email('Invalid email'),
        mobile: z.string().regex(/^\d{10}$/, 'Invalid mobile number')
    }).optional(),

    items: z.array(z.object({
        name: z.string().min(1, 'Item name is required'),
        quantity: z.number().int().positive(),
        price: z.number().positive()
    })).optional()
});

// Lead Schemas
export const createLeadSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),

    email: z.string()
        .email('Invalid email address')
        .toLowerCase()
        .trim(),

    phone: z.string()
        .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number')
        .trim()
        .optional(),

    city: z.string()
        .min(2, 'City must be at least 2 characters')
        .max(100, 'City must not exceed 100 characters')
        .trim()
        .optional(),

    use_case: z.string()
        .max(500, 'Use case must not exceed 500 characters')
        .trim()
        .optional()
});

// Contact Schemas
export const contactMessageSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),

    email: z.string()
        .email('Invalid email address')
        .toLowerCase()
        .trim(),

    phone: z.string()
        .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number')
        .trim()
        .optional(),

    message: z.string()
        .min(10, 'Message must be at least 10 characters')
        .max(1000, 'Message must not exceed 1000 characters')
        .trim()
});

/**
 * Validation Middleware Factory
 * Creates middleware for validating request body against a schema
 */
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            // Validate and transform the request body
            const validated = schema.parse(req.body);

            // Replace req.body with validated & transformed data
            req.body = validated;

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Format Zod errors into user-friendly messages
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                next(new ValidationError('Validation failed', errors));
            } else {
                next(error);
            }
        }
    };
};

/**
 * Query Parameter Validation
 * For validating URL query parameters
 */
export const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req.query);
            req.query = validated;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                next(new ValidationError('Invalid query parameters', errors));
            } else {
                next(error);
            }
        }
    };
};

/**
 * Params Validation
 * For validating URL path parameters
 */
export const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req.params);
            req.params = validated;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                next(new ValidationError('Invalid URL parameters', errors));
            } else {
                next(error);
            }
        }
    };
};
