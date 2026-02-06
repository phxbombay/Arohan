import axios from 'axios';
import logger from '../config/logger.js';

/**
 * WhatsApp Business API Service
 * Handles sending notifications via WhatsApp
 */

class WhatsAppService {
    constructor() {
        this.apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        this.enabled = !!(this.phoneNumberId && this.accessToken);

        if (!this.enabled) {
            logger.warn('WhatsApp service not configured. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN');
        }
    }

    /**
     * Send a text message via WhatsApp
     * @param {string} to - Recipient phone number (with country code, e.g., +919876543210)
     * @param {string} message - Message text
     */
    async sendTextMessage(to, message) {
        if (!this.enabled) {
            logger.warn('WhatsApp service disabled. Message not sent:', { to, message });
            return { success: false, error: 'WhatsApp service not configured' };
        }

        try {
            const response = await axios.post(
                `${this.apiUrl}/${this.phoneNumberId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'text',
                    text: {
                        body: message
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            logger.info('WhatsApp message sent successfully', {
                to,
                messageId: response.data.messages[0].id
            });

            return {
                success: true,
                messageId: response.data.messages[0].id
            };
        } catch (error) {
            logger.error('Failed to send WhatsApp message:', {
                error: error.message,
                to,
                response: error.response?.data
            });

            return {
                success: false,
                error: error.response?.data?.error?.message || error.message
            };
        }
    }

    /**
     * Send a template message via WhatsApp
     * @param {string} to - Recipient phone number
     * @param {string} templateName - Template name
     * @param {string} languageCode - Language code (e.g., 'en', 'hi')
     * @param {Array} components - Template components (header, body, buttons)
     */
    async sendTemplateMessage(to, templateName, languageCode = 'en', components = []) {
        if (!this.enabled) {
            logger.warn('WhatsApp service disabled. Template message not sent:', { to, templateName });
            return { success: false, error: 'WhatsApp service not configured' };
        }

        try {
            const response = await axios.post(
                `${this.apiUrl}/${this.phoneNumberId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'template',
                    template: {
                        name: templateName,
                        language: {
                            code: languageCode
                        },
                        components: components
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            logger.info('WhatsApp template message sent successfully', {
                to,
                templateName,
                messageId: response.data.messages[0].id
            });

            return {
                success: true,
                messageId: response.data.messages[0].id
            };
        } catch (error) {
            logger.error('Failed to send WhatsApp template message:', {
                error: error.message,
                to,
                templateName,
                response: error.response?.data
            });

            return {
                success: false,
                error: error.response?.data?.error?.message || error.message
            };
        }
    }

    /**
     * Send emergency alert via WhatsApp
     * @param {string} to - Emergency contact phone number
     * @param {Object} alertData - Alert details
     */
    async sendEmergencyAlert(to, alertData) {
        const { userName, alertType, location, timestamp, vitals } = alertData;

        const message = `🚨 EMERGENCY ALERT 🚨

User: ${userName}
Alert Type: ${alertType}
Time: ${new Date(timestamp).toLocaleString('en-IN')}
Location: ${location || 'Location unavailable'}

Vitals:
${vitals ? Object.entries(vitals).map(([key, value]) => `- ${key}: ${value}`).join('\n') : 'No vitals data'}

Please check on the user immediately.

- Arohan Health Monitoring System`;

        return await this.sendTextMessage(to, message);
    }

    /**
     * Send health report via WhatsApp
     * @param {string} to - Recipient phone number
     * @param {Object} reportData - Health report data
     */
    async sendHealthReport(to, reportData) {
        const { userName, period, summary } = reportData;

        const message = `📊 Health Report - ${period}

Hello! Here's the health summary for ${userName}:

${summary}

For detailed insights, please visit your Arohan dashboard.

Stay healthy! 💚
- Arohan Health Team`;

        return await this.sendTextMessage(to, message);
    }

    /**
     * Send appointment reminder via WhatsApp
     * @param {string} to - Patient phone number
     * @param {Object} appointmentData - Appointment details
     */
    async sendAppointmentReminder(to, appointmentData) {
        const { patientName, doctorName, appointmentTime, location } = appointmentData;

        const message = `📅 Appointment Reminder

Dear ${patientName},

This is a reminder for your upcoming appointment:

Doctor: ${doctorName}
Date & Time: ${new Date(appointmentTime).toLocaleString('en-IN')}
Location: ${location}

Please arrive 10 minutes early.

- Arohan Health`;

        return await this.sendTextMessage(to, message);
    }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();
