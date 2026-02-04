import { sendEmail } from '../config/email.js';
import logger from '../config/logger.js';

/**
 * Broadcast emergency alert via Email
 * SMS integration can be added here with Twilio
 * @param {Object} contact - Emergency contact details
 * @param {Object} alertData - Alert information
 */
export const broadcastEmergency = async (contact, alertData) => {
    const { user, type, location } = alertData;

    try {
        // Determine alert type message
        const alertTypeMessages = {
            'manual_sos': '🆘 MANUAL SOS BUTTON PRESSED',
            'fall_detected': '🚨 FALL DETECTED',
            'heart_rate_abnormal': '💔 ABNORMAL HEART RATE DETECTED',
            'low_spo2': '😷 LOW OXYGEN SATURATION',
        };

        const alertTitle = alertTypeMessages[type] || '⚠️ EMERGENCY ALERT';

        // Generate Google Maps link
        const mapsLink = location && location.lat && location.lng
            ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
            : null;

        const htmlContent = `
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
                        <h1>${alertTitle}</h1>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">Arohan Health Emergency Alert</p>
                    </div>
                    <div class="content">
                        <div class="alert-box">
                            <strong>⚠️ EMERGENCY NOTIFICATION</strong><br>
                            This is an automated alert from the Arohan Health monitoring system.
                        </div>
                        
                        <div class="info-row">
                            <span class="label">👤 Patient:</span> ${user}
                        </div>
                        
                        <div class="info-row">
                            <span class="label">📍 Your Contact Priority:</span> #${contact.priority || 1}
                        </div>
                        
                        <div class="info-row">
                            <span class="label">🚨 Alert Type:</span> ${type.replace(/_/g, ' ').toUpperCase()}
                        </div>
                        
                        <div class="info-row">
                            <span class="label">⏰ Time:</span> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </div>
                        
                        ${mapsLink ? `
                        <div class="info-row">
                            <span class="label">📍 Location:</span><br>
                            <a href="${mapsLink}" class="cta-button" style="margin-top: 10px;">📍 View Location on Google Maps</a>
                        </div>
                        ` : '<div class="info-row"><span class="label">📍 Location:</span> Not available</div>'}
                        
                        <div style="background: #e8f5e9; padding: 20px; border-radius: 5px; margin-top: 20px;">
                            <strong>✅ NEXT STEPS:</strong><br>
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

        // Send email
        const emailResult = await sendEmail({
            to: contact.email,
            subject: `🚨 EMERGENCY ALERT: ${user} needs immediate assistance`,
            html: htmlContent
        });

        logger.info('Emergency email sent', {
            contact: contact.email,
            user,
            type,
            success: emailResult.success
        });

        // Send SMS if phone number exists
        let smsResult = { success: false, error: 'No phone number' };
        if (contact.phone) {
            try {
                const smsService = (await import('./smsService.js')).default;
                smsResult = await smsService.sendEmergencyAlert(contact, alertData);

                logger.info('Emergency SMS sent', {
                    contact: contact.phone ? '***' + contact.phone.slice(-4) : 'N/A',
                    user,
                    type,
                    success: smsResult.success
                });
            } catch (error) {
                logger.error('SMS service error', {
                    error: error.message,
                    contact: contact.email
                });
            }
        }

        return {
            email: emailResult,
            sms: smsResult
        };
    } catch (error) {
        logger.error('Failed to broadcast emergency alert', {
            error: error.message,
            contact: contact.email
        });
        throw error;
    }
};
