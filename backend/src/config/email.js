import nodemailer from 'nodemailer';
import logger from './logger.js';

/**
 * Email Configuration for Arohan Health Platform
 * Supports Gmail SMTP and custom SMTP servers
 */

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    secure: false, // true for 465, false for other ports
    auth: (process.env.SMTP_USER && process.env.SMTP_PASSWORD) ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    } : undefined,
    // Timeout settings
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

/**
 * Verify SMTP connection on startup
 */
transporter.verify((error, success) => {
    if (error) {
        logger.error('SMTP connection failed', { error: error.message });
        logger.warn('Email notifications will not work. Please check SMTP configuration.');
    } else {
        logger.info('SMTP server ready to send emails', {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            user: process.env.SMTP_USER
        });
    }
});

/**
 * Send email notification
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise<Object>} - Send result
 */
export const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `"Arohan Health Platform" <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text || options.html.replace(/<[^>]*>/g, '') // Strip HTML for text version
        };

        const info = await transporter.sendMail(mailOptions);

        logger.info('Email sent successfully', {
            messageId: info.messageId,
            to: options.to,
            subject: options.subject
        });

        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        logger.error('Failed to send email', {
            error: error.message,
            to: options.to,
            subject: options.subject
        });

        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Send contact form notification to admin
 * @param {Object} formData - Contact form data
 * @returns {Promise<Object>} - Send result
 */
export const sendContactFormNotification = async (formData) => {
    const { name, email, phone, message } = formData;

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 20px; }
                .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
                .value { background: white; padding: 10px; border-radius: 4px; border-left: 3px solid #667eea; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2 style="margin: 0;">🚑 New Contact Form Submission</h2>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Arohan Health Platform</p>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">Name:</div>
                        <div class="value">${name}</div>
                    </div>
                    <div class="field">
                        <div class="label">Email:</div>
                        <div class="value"><a href="mailto:${email}">${email}</a></div>
                    </div>
                    ${phone ? `
                    <div class="field">
                        <div class="label">Phone:</div>
                        <div class="value"><a href="tel:${phone}">${phone}</a></div>
                    </div>
                    ` : ''}
                    <div class="field">
                        <div class="label">Message:</div>
                        <div class="value">${message.replace(/\n/g, '<br>')}</div>
                    </div>
                    <div class="footer">
                        <p>This message was sent from the Arohan Health contact form.</p>
                        <p>Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmail({
        to: process.env.ADMIN_EMAIL || 'info@haspranahealth.com',
        subject: `New Contact Form Submission from ${name}`,
        html: htmlContent
    });
};

export default transporter;
