import pool from '../config/db.js';
import logger from '../config/logger.js';
import xss from 'xss';
import { encrypt } from '../utils/encryption.js';
import { sendContactFormNotification } from '../config/email.js';

/**
 * Handle contact form submission
 * @route POST /v1/contact
 */
export const submitContactForm = async (req, res, next) => {
    const { name, email, phone, message } = req.body;

    try {
        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'Name, email and message are required'
            });
        }

        // Sanitize inputs
        const sanitizedName = xss(name);
        const sanitizedEmail = xss(email);
        const sanitizedMessage = xss(message);

        // Check if content was removed during sanitization (indicating attack attempt)
        if (sanitizedMessage !== message || sanitizedName !== name) {
            logger.warn('XSS Attempt blocked', {
                original: message,
                sanitized: sanitizedMessage,
                ip: req.ip
            });
        }

        // Encrypt sensitive data
        const encryptedPhone = encrypt(phone);
        const encryptedMessage = encrypt(sanitizedMessage);

        const query = `
            INSERT INTO contact_messages (name, email, phone, message)
            VALUES ($1, $2, $3, $4)
            RETURNING id, created_at
        `;

        const result = await pool.query(query, [sanitizedName, sanitizedEmail, encryptedPhone || null, encryptedMessage]);

        logger.info('Contact message received', {
            messageId: result.rows[0].id,
            email: email
        });

        // Send email notification to admin (non-blocking)
        sendContactFormNotification({
            name: sanitizedName,
            email: sanitizedEmail,
            phone: phone || 'Not provided',
            message: sanitizedMessage
        }).then(emailResult => {
            if (emailResult.success) {
                logger.info('Contact form email notification sent', {
                    messageId: result.rows[0].id,
                    emailMessageId: emailResult.messageId
                });
            } else {
                logger.warn('Failed to send contact form email notification', {
                    messageId: result.rows[0].id,
                    error: emailResult.error
                });
            }
        }).catch(err => {
            logger.error('Email notification error', {
                messageId: result.rows[0].id,
                error: err.message
            });
        });

        res.status(201).json({
            status: 'success',
            message: 'Your message has been sent successfully. We will contact you shortly.',
            data: {
                id: result.rows[0].id,
                created_at: result.rows[0].created_at
            }
        });
    } catch (err) {
        logger.error('Error submitting contact form', { error: err.message });
        next(err);
    }
};
