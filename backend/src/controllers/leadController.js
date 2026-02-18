import pool from '../config/db.js';
import logger from '../config/logger.js';
import xss from 'xss';
import crypto from 'crypto';

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

        const leadId = crypto.randomUUID();
        const query = `
            INSERT INTO early_access_leads (id, name, email, phone, city, use_case)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await pool.query(query, [
            leadId,
            sanitizedName,
            sanitizedEmail,
            sanitizedPhone,
            sanitizedCity,
            sanitizedUseCase
        ]);

        logger.info('Early Access lead captured', {
            leadId,
            email: sanitizedEmail
        });

        res.status(201).json({
            status: 'success',
            message: 'Thank you for joining our Early Access program!',
            data: {
                id: leadId
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
        const [rows] = await pool.query(query).catch(err => {
            logger.error('Admin Leads Query Error:', err);
            return [[]];
        });

        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: {
                leads: rows
            }
        });
    } catch (err) {
        logger.error('Error fetching leads', { error: err.message });
        res.status(500).json({
            status: 'error',
            message: 'Server error fetching leads',
            data: { leads: [] }
        });
    }
};
