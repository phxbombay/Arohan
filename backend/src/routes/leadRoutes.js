import express from 'express';
import { submitEarlyAccess } from '../controllers/leadController.js';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';
import logger from '../config/logger.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/early-access', submitEarlyAccess);

/**
 * @route   POST /api/leads/consulting
 * @desc    Submit consulting inquiry
 * @access  Public
 */
router.post(
    '/consulting',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('serviceType').notEmpty().withMessage('Service type is required'),
        body('phone').optional().trim(),
        body('company').optional().trim(),
        body('budget').optional().trim(),
        body('timeline').optional().trim(),
        body('description').optional().trim()
    ],
    async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 'fail',
                    errors: errors.array()
                });
            }

            const {
                name,
                email,
                company,
                phone,
                serviceType,
                budget,
                timeline,
                description
            } = req.body;

            const leadId = crypto.randomUUID();

            const query = `
                INSERT INTO consulting_leads (
                    id, name, email, company, phone, service_type, 
                    budget, timeline, description, status, created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;

            const values = [
                leadId,
                name,
                email,
                company || null,
                phone || null,
                serviceType,
                budget || null,
                timeline || null,
                description || null,
                'new'
            ];

            await pool.query(query, values);

            logger.info('New consulting lead received', {
                leadId,
                email,
                serviceType
            });

            res.status(201).json({
                status: 'success',
                message: 'Thank you for your inquiry! We will contact you within 24 hours.',
                data: {
                    leadId
                }
            });

        } catch (error) {
            logger.error('Error creating consulting lead:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to submit inquiry. Please try again later.'
            });
        }
    }
);

export default router;
