import { z } from 'zod';

// Password validation schema
const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

// User registration validation
export const registerSchema = z.object({
    full_name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

    email: z.string()
        .email('Invalid email address')
        .toLowerCase()
        .trim(),

    password: passwordSchema
});

// User login validation
export const loginSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .toLowerCase()
        .trim(),

    password: z.string()
        .min(1, 'Password is required')
});

// Validate request body against schema
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req.body);
            req.body = validated; // Replace body with validated data
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Validation Error:', JSON.stringify(error.errors, null, 2));
                return res.status(400).json({
                    status: 'fail',
                    message: 'Validation failed',
                    errors: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            next(error);
        }
    };
};
