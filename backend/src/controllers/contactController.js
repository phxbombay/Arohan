import pool from '../config/db.js';
import logger from '../config/logger.js';
import xss from 'xss';
import crypto from 'crypto';
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
        const id = crypto.randomUUID();
        const created_at = new Date();

        const query = `
            INSERT INTO contact_messages (id, name, email, phone, message, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await pool.query(query, [id, sanitizedName, sanitizedEmail, encryptedPhone || null, encryptedMessage, created_at]);

        logger.info('Contact message received', {
            messageId: id,
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
                    messageId: id,
                    emailMessageId: emailResult.messageId
                });
            } else {
                logger.warn('Failed to send contact form email notification', {
                    messageId: id,
                    error: emailResult.error
                });
            }
        }).catch(err => {
            logger.error('Email notification error', {
                messageId: id,
                error: err.message
            });
        });

        res.status(201).json({
            status: 'success',
            message: 'Your message has been sent successfully. We will contact you shortly.',
            data: {
                id,
                created_at
            }
        });
    } catch (err) {
        logger.error('Error submitting contact form', { error: err.message });
        next(err);
    }
};
