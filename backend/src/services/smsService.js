import twilio from 'twilio';
import logger from '../config/logger.js';

/**
 * SMS Service using Twilio
 * Handles emergency alerts and notifications via SMS
 */

class SMSService {
    constructor() {
        this.accountSid = process.env.TWILIO_ACCOUNT_SID;
        this.authToken = process.env.TWILIO_AUTH_TOKEN;
        this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;

        // Rate limiting configuration
        this.rateLimitPerMinute = parseInt(process.env.SMS_RATE_LIMIT_PER_MINUTE) || 10;
        this.recentSMS = new Map(); // Track SMS sending times

        // Initialize Twilio client
        if (this.accountSid && this.accountSid.startsWith('AC') && this.authToken) {
            this.client = twilio(this.accountSid, this.authToken);
            logger.info('Twilio SMS Service initialized', {
                phoneNumber: this.phoneNumber,
                rateLimitPerMinute: this.rateLimitPerMinute
            });
        } else {
            logger.warn('Twilio credentials not configured. Switching to MOCK SMS mode.');
            this.client = null;
            this.mockMode = true;
        }
    }

    /**
     * Check if we're within rate limits
     * @param {string} phoneNumber - Destination phone number
     * @returns {boolean}
     */
    checkRateLimit(phoneNumber) {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;

        // Get recent SMS to this number
        const recent = this.recentSMS.get(phoneNumber) || [];
        const recentInLastMinute = recent.filter(time => time > oneMinuteAgo);

        if (recentInLastMinute.length >= this.rateLimitPerMinute) {
            logger.warn('SMS rate limit exceeded', {
                phoneNumber: this.maskPhoneNumber(phoneNumber),
                count: recentInLastMinute.length,
                limit: this.rateLimitPerMinute
            });
            return false;
        }

        // Update tracking
        recentInLastMinute.push(now);
        this.recentSMS.set(phoneNumber, recentInLastMinute);

        return true;
    }

    /**
     * Mask phone number for logging (privacy)
     * @param {string} phoneNumber
     * @returns {string}
     */
    maskPhoneNumber(phoneNumber) {
        if (!phoneNumber || phoneNumber.length < 4) return '****';
        return phoneNumber.slice(0, -4).replace(/\d/g, '*') + phoneNumber.slice(-4);
    }

    /**
     * Normalize phone number to E.164 format
     * @param {string} phoneNumber
     * @returns {string}
     */
    normalizePhoneNumber(phoneNumber) {
        // Remove all non-digit characters
        let cleaned = phoneNumber.replace(/\D/g, '');

        // If starts with 0 (Indian format), replace with +91
        if (cleaned.startsWith('0')) {
            cleaned = '91' + cleaned.slice(1);
        }

        // If doesn't start with +, add it
        if (!cleaned.startsWith('+')) {
            // Default to India (+91) if no country code
            if (cleaned.length === 10) {
                cleaned = '91' + cleaned;
            }
            cleaned = '+' + cleaned;
        }

        return cleaned;
    }

    /**
     * Send SMS message
     * @param {Object} options
     * @param {string} options.to - Recipient phone number
     * @param {string} options.message - Message body
     * @param {boolean} options.emergency - Is this an emergency alert
     * @returns {Promise<Object>}
     */
    async sendSMS({ to, message, emergency = false }) {
        try {
            // Check if Twilio is configured
            // Check if Twilio is configured
            if (!this.client) {
                if (this.mockMode) {
                    logger.info('MOCK SMS SENT', {
                        to: this.maskPhoneNumber(to),
                        message
                    });
                    return {
                        success: true,
                        sid: 'mock_sid_' + Date.now(),
                        status: 'sent'
                    };
                }

                logger.warn('SMS not sent - Twilio not configured', {
                    to: this.maskPhoneNumber(to)
                });
                return {
                    success: false,
                    error: 'SMS service not configured'
                };
            }

            // Normalize phone number
            const normalizedPhone = this.normalizePhoneNumber(to);

            // Check rate limits (but allow emergency messages)
            if (!emergency && !this.checkRateLimit(normalizedPhone)) {
                return {
                    success: false,
                    error: 'Rate limit exceeded'
                };
            }

            // Send SMS via Twilio
            const result = await this.client.messages.create({
                body: message,
                from: this.phoneNumber,
                to: normalizedPhone
            });

            logger.info('SMS sent successfully', {
                sid: result.sid,
                to: this.maskPhoneNumber(normalizedPhone),
                status: result.status,
                emergency: emergency
            });

            return {
                success: true,
                sid: result.sid,
                status: result.status
            };
        } catch (error) {
            logger.error('Failed to send SMS', {
                error: error.message,
                code: error.code,
                to: this.maskPhoneNumber(to)
            });

            return {
                success: false,
                error: error.message,
                code: error.code
            };
        }
    }

    /**
     * Send emergency alert SMS
     * @param {Object} contact - Emergency contact
     * @param {Object} alertData - Alert details
     * @returns {Promise<Object>}
     */
    async sendEmergencyAlert(contact, alertData) {
        const { user, type, location } = alertData;

        // Create location link
        const locationText = location && location.lat && location.lng
            ? `Location: https://maps.google.com/?q=${location.lat},${location.lng}`
            : 'Location: Not available';

        // Format alert message (SMS has 160 char limit, so be concise)
        const alertTypes = {
            'manual_sos': '🆘 SOS ALERT',
            'fall_detected': '🚨 FALL DETECTED',
            'heart_rate_abnormal': '💔 ABNORMAL HEART RATE',
            'low_spo2': '😷 LOW OXYGEN',
        };

        const alertTitle = alertTypes[type] || '⚠️ EMERGENCY';

        const message = `${alertTitle}\n\n` +
            `Patient: ${user}\n` +
            `Time: ${new Date().toLocaleTimeString('en-IN')}\n` +
            `${locationText}\n\n` +
            `Please contact immediately!\n` +
            `- Arohan Health`;

        logger.info('Sending emergency SMS', {
            contact: this.maskPhoneNumber(contact.phone),
            user: user,
            type: type
        });

        return await this.sendSMS({
            to: contact.phone,
            message: message,
            emergency: true // Bypass rate limits for emergencies
        });
    }

    /**
     * Send test SMS to verify configuration
     * @param {string} phoneNumber
     * @returns {Promise<Object>}
     */
    async sendTestSMS(phoneNumber) {
        const message = `🧪 Arohan Health SMS Test\n\n` +
            `This is a test message from your emergency alert system.\n\n` +
            `If you receive this, SMS notifications are working correctly!\n\n` +
            `Time: ${new Date().toLocaleString('en-IN')}`;

        return await this.sendSMS({
            to: phoneNumber,
            message: message,
            emergency: false
        });
    }
}

export default new SMSService();
