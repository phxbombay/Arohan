import pool from '../config/db.js';
import logger from '../config/logger.js';
import xss from 'xss';

/**
 * Handle Early Access form submission
 * @route POST /v1/leads/early-access
 */
export const submitEarlyAccess = async (req, res, next) => {
    const { name, email, phone, city, useCase } = req.body;

    try {
        // Basic validation
        if (!name || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'Name and email are required'
            });
        }

        // Sanitize inputs
        const sanitizedName = xss(name);
        const sanitizedEmail = xss(email);
        const sanitizedPhone = xss(phone || '');
        const sanitizedCity = xss(city || '');
        const sanitizedUseCase = xss(useCase || '');

        const query = `
            INSERT INTO early_access_leads (name, email, phone, city, use_case)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, created_at
        `;

        const result = await pool.query(query, [
            sanitizedName,
            sanitizedEmail,
            sanitizedPhone,
            sanitizedCity,
            sanitizedUseCase
        ]);

        logger.info('Early Access lead captured', {
            leadId: result.rows[0].id,
            email: sanitizedEmail
        });

        res.status(201).json({
            status: 'success',
            message: 'Thank you for joining our Early Access program!',
            data: {
                id: result.rows[0].id
            }
        });

    } catch (err) {
        logger.error('Error submitting early access form', { error: err.message });
        next(err);
    }
};

/**
 * Get all leads (Admin only)
 * @route GET /v1/admin/leads
 */
export const getAllLeads = async (req, res, next) => {
    try {
        const query = `
            SELECT * FROM early_access_leads
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query);

        res.status(200).json({
            status: 'success',
            results: result.rows.length,
            data: {
                leads: result.rows
            }
        });
    } catch (err) {
        logger.error('Error fetching leads', { error: err.message });
        next(err);
    }
};
