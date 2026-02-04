import { z } from 'zod';

// Add item to cart validation
export const addToCartSchema = z.object({
    id: z.string()
        .min(1, 'Product ID is required'),

    name: z.string()
        .min(1, 'Product name is required')
        .max(200, 'Product name too long'),

    description: z.string()
        .max(1000, 'Description too long')
        .optional(),

    price: z.number()
        .positive('Price must be positive')
        .max(1000000, 'Price too high'),

    image: z.string()
        .url('Invalid image URL')
        .optional()
        .or(z.literal('')),

    features: z.array(z.string())
        .optional()
        .default([])
});

// Update cart item validation
export const updateCartSchema = z.object({
    quantity: z.number()
        .int('Quantity must be an integer')
        .positive('Quantity must be positive')
        .max(99, 'Quantity cannot exceed 99')
});

// User ID parameter validation
export const userIdSchema = z.object({
    userId: z.string()
        .uuid('Invalid user ID format')
});

// Product ID parameter validation
export const productIdSchema = z.object({
    productId: z.string()
        .min(1, 'Product ID is required')
});

// Combined params for item operations
export const cartItemParamsSchema = userIdSchema.merge(productIdSchema);

// Validate request body against schema
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req.body);
            req.body = validated;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
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

// Validate request params
export const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req.params);
            req.params = validated;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Invalid parameters',
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
