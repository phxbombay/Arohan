import { z } from 'zod';

// Health vitals validation
export const healthVitalsSchema = z.object({
    heart_rate: z.number()
        .int('Heart rate must be an integer')
        .min(30, 'Heart rate too low')
        .max(250, 'Heart rate too high'),

    blood_pressure_systolic: z.number()
        .int()
        .min(70, 'Systolic BP too low')
        .max(250, 'Systolic BP too high')
        .optional(),

    blood_pressure_diastolic: z.number()
        .int()
        .min(40, 'Diastolic BP too low')
        .max(150, 'Diastolic BP too high')
        .optional(),

    oxygen_saturation: z.number()
        .min(0, 'Oxygen saturation cannot be negative')
        .max(100, 'Oxygen saturation cannot exceed 100')
        .optional(),

    temperature: z.number()
        .min(35, 'Temperature too low')
        .max(43, 'Temperature too high')
        .optional(),

    recorded_at: z.string()
        .datetime('Invalid timestamp format')
        .optional()
});

// Validate request body
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
