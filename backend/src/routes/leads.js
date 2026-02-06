import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

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

            // Insert into database
            const query = `
                INSERT INTO consulting_leads (
                    name, email, company, phone, service_type, 
                    budget, timeline, description, status, created_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
                RETURNING *
            `;

            const values = [
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

            const result = await pool.query(query, values);

            logger.info('New consulting lead received', {
                leadId: result.rows[0].id,
                email,
                serviceType
            });

            // TODO: Send email notification to admin
            // TODO: Send confirmation email to customer

            res.status(201).json({
                status: 'success',
                message: 'Thank you for your inquiry! We will contact you within 24 hours.',
                data: {
                    leadId: result.rows[0].id
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

/**
 * @route   GET /api/leads/consulting
 * @desc    Get all consulting leads (Admin only)
 * @access  Private/Admin
 */
router.get('/consulting', async (req, res) => {
    try {
        const { status, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT * FROM consulting_leads';
        const values = [];

        if (status) {
            query += ' WHERE status = $1';
            values.push(status);
        }

        query += ' ORDER BY created_at DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
        values.push(limit, offset);

        const result = await pool.query(query, values);

        res.json({
            status: 'success',
            data: {
                leads: result.rows,
                total: result.rowCount
            }
        });

    } catch (error) {
        logger.error('Error fetching consulting leads:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch leads'
        });
    }
});

/**
 * @route   PATCH /api/leads/consulting/:id
 * @desc    Update consulting lead status (Admin only)
 * @access  Private/Admin
 */
router.patch('/consulting/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const query = `
            UPDATE consulting_leads 
            SET status = COALESCE($1, status),
                notes = COALESCE($2, notes),
                updated_at = NOW()
            WHERE id = $3
            RETURNING *
        `;

        const result = await pool.query(query, [status, notes, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Lead not found'
            });
        }

        res.json({
            status: 'success',
            data: {
                lead: result.rows[0]
            }
        });

    } catch (error) {
        logger.error('Error updating consulting lead:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update lead'
        });
    }
});

export default router;
