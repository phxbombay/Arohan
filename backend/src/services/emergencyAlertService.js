import { sendEmail } from '../config/email.js';
import logger from '../config/logger.js';
import smsService from './smsService.js';
import { whatsappService } from './whatsapp.js';

export const SUPPORTED_ALERT_CHANNELS = ['email', 'sms', 'whatsapp'];

export const normalizeAlertChannels = (channels, { defaultToAll = false } = {}) => {
    if (channels == null) {
        return defaultToAll ? [...SUPPORTED_ALERT_CHANNELS] : [];
    }

    const list = Array.isArray(channels) ? channels : [channels];
    const normalized = [...new Set(
        list
            .map(channel => typeof channel === 'string' ? channel.toLowerCase().trim() : '')
            .filter(channel => SUPPORTED_ALERT_CHANNELS.includes(channel))
    )];

    return normalized;
};

export const parseStoredAlertChannels = (channels) => {
    if (!channels) {
        return null;
    }

    try {
        const parsed = typeof channels === 'string' ? JSON.parse(channels) : channels;
        const normalized = normalizeAlertChannels(parsed);
        return normalized.length > 0 ? normalized : null;
    } catch {
        const normalized = normalizeAlertChannels(channels);
        return normalized.length > 0 ? normalized : null;
    }
};

export const serializeAlertChannels = (channels) => {
    const normalized = normalizeAlertChannels(channels);
    return normalized.length > 0 ? JSON.stringify(normalized) : null;
};

export const getContactEnabledChannels = (contact) => {
    const availableChannels = [];

    if (contact.email) {
        availableChannels.push('email');
    }

    if (contact.phone) {
        availableChannels.push('sms', 'whatsapp');
    }

    const uniqueAvailableChannels = [...new Set(availableChannels)];
    const preferredChannels = parseStoredAlertChannels(contact.preferred_channels);

    if (!preferredChannels) {
        return uniqueAvailableChannels;
    }

    return uniqueAvailableChannels.filter(channel => preferredChannels.includes(channel));
};

const ALERT_TYPE_MESSAGES = {
    manual_sos: 'MANUAL SOS BUTTON PRESSED',
    fall_detected: 'FALL DETECTED',
    heart_rate_abnormal: 'ABNORMAL HEART RATE DETECTED',
    cardiac_arrest: 'CARDIAC ARREST DETECTED',
    abnormal_vitals: 'ABNORMAL VITALS DETECTED',
    low_spo2: 'LOW OXYGEN SATURATION',
};

const formatAlertType = (type) => {
    if (ALERT_TYPE_MESSAGES[type]) {
        return ALERT_TYPE_MESSAGES[type];
    }

    return (type || 'emergency_alert').replace(/_/g, ' ').toUpperCase();
};

const buildMapsLink = (location) => {
    if (!location?.lat || !location?.lng) {
        return null;
    }

    return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
};

const buildEmailHtml = ({ contact, user, formattedType, mapsLink, timestamp }) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .alert-icon { font-size: 64px; margin-bottom: 10px; }
            .content { padding: 30px; }
            .alert-box { background: #fff3cd; border-left: 5px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .info-row { margin: 15px 0; padding: 10px; background: #f9f9f9; border-radius: 4px; }
            .label { font-weight: bold; color: #555; }
            .cta-button { display: inline-block; padding: 15px 30px; background: #e74c3c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #777; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="alert-icon">🚨</div>
                <h1>${formattedType}</h1>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Arohan Health Emergency Alert</p>
            </div>
            <div class="content">
                <div class="alert-box">
                    <strong>EMERGENCY NOTIFICATION</strong><br>
                    This is an automated alert from the Arohan Health monitoring system.
                </div>

                <div class="info-row">
                    <span class="label">Patient:</span> ${user}
                </div>

                <div class="info-row">
                    <span class="label">Your Contact Priority:</span> #${contact.priority || 1}
                </div>

                <div class="info-row">
                    <span class="label">Alert Type:</span> ${formattedType}
                </div>

                <div class="info-row">
                    <span class="label">Time:</span> ${timestamp}
                </div>

                ${mapsLink ? `
                <div class="info-row">
                    <span class="label">Location:</span><br>
                    <a href="${mapsLink}" class="cta-button" style="margin-top: 10px;">View Location on Google Maps</a>
                </div>
                ` : '<div class="info-row"><span class="label">Location:</span> Not available</div>'}

                <div style="background: #e8f5e9; padding: 20px; border-radius: 5px; margin-top: 20px;">
                    <strong>NEXT STEPS:</strong><br>
                    1. Try calling ${user} immediately<br>
                    2. Contact local emergency services if needed<br>
                    3. Check the Arohan app for real-time vitals<br>
                    4. Update alert status once resolved
                </div>
            </div>
            <div class="footer">
                <p>This is an automated message from <strong>Arohan Health Platform</strong></p>
                <p>For technical support, contact: support@arohanhealth.com</p>
                <p style="margin-top: 15px; font-size: 10px; opacity: 0.7;">
                    You are receiving this because you are listed as an emergency contact for ${user}
                </p>
            </div>
        </div>
    </body>
    </html>
`;

const buildEmailText = ({ user, formattedType, mapsLink, timestamp }) => [
    'Arohan Health Emergency Alert',
    '',
    `Patient: ${user}`,
    `Alert Type: ${formattedType}`,
    `Time: ${timestamp}`,
    `Location: ${mapsLink || 'Not available'}`,
    '',
    'Please contact the patient immediately and reach local emergency services if needed.',
].join('\n');

const executeChannelDelivery = async (channel, contact, alertData, context) => {
    const { user, type, formattedType, mapsLink, timestamp } = context;

    switch (channel) {
        case 'email':
            return sendEmail({
                to: contact.email,
                subject: `Emergency alert: ${user} needs immediate assistance`,
                html: buildEmailHtml({ contact, user, formattedType, mapsLink, timestamp }),
                text: buildEmailText({ user, formattedType, mapsLink, timestamp }),
            });

        case 'sms':
            return smsService.sendEmergencyAlert(contact, alertData);

        case 'whatsapp':
            return whatsappService.sendEmergencyAlert(contact.phone, {
                userName: user,
                alertType: formattedType,
                location: mapsLink || 'Location unavailable',
                timestamp: new Date().toISOString(),
                vitals: alertData.vitals,
            });

        default:
            return {
                success: false,
                error: `Unsupported channel: ${channel}`,
            };
    }
};

/**
 * Broadcast an emergency alert across one or more channels for a single contact.
 * Channels can be restricted globally per request and per contact preference.
 */
export const broadcastEmergency = async (contact, alertData, options = {}) => {
    const requestedChannels = normalizeAlertChannels(options.channels, { defaultToAll: true });
    const enabledChannels = getContactEnabledChannels(contact);
    const formattedType = formatAlertType(alertData.type);
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const mapsLink = buildMapsLink(alertData.location);

    const delivery = {
        contact_id: contact.contact_id,
        contact_name: contact.name,
        requestedChannels,
        enabledChannels,
        attemptedChannels: [],
        sentChannels: [],
        failedChannels: [],
        skippedChannels: [],
        channelResults: {},
    };

    for (const channel of requestedChannels) {
        const channelEnabled = enabledChannels.includes(channel);

        if (!channelEnabled) {
            let reason = 'channel_not_enabled_for_contact';

            if (channel === 'email' && !contact.email) {
                reason = 'missing_contact_email';
            }

            if ((channel === 'sms' || channel === 'whatsapp') && !contact.phone) {
                reason = 'missing_contact_phone';
            }

            delivery.skippedChannels.push(channel);
            delivery.channelResults[channel] = {
                success: false,
                skipped: true,
                reason,
            };
            continue;
        }

        delivery.attemptedChannels.push(channel);

        try {
            const result = await executeChannelDelivery(channel, contact, alertData, {
                user: alertData.user,
                type: alertData.type,
                formattedType,
                mapsLink,
                timestamp,
            });

            delivery.channelResults[channel] = result;

            if (result?.success) {
                delivery.sentChannels.push(channel);
            } else {
                delivery.failedChannels.push(channel);
            }
        } catch (error) {
            delivery.failedChannels.push(channel);
            delivery.channelResults[channel] = {
                success: false,
                error: error.message,
            };
        }
    }

    logger.info('Emergency alert delivery completed', {
        contactId: contact.contact_id,
        requestedChannels: delivery.requestedChannels,
        attemptedChannels: delivery.attemptedChannels,
        sentChannels: delivery.sentChannels,
        failedChannels: delivery.failedChannels,
        skippedChannels: delivery.skippedChannels,
    });

    return delivery;
};
