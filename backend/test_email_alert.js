import { sendEmail } from './src/config/email.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Test Email Alert System
 * This script tests the email configuration for emergency alerts
 */

const testEmailAlert = async () => {
    try {
        const testAlert = {
            user: 'Test Patient (Ramesh Kumar)',
            type: 'manual_sos',
            location: { lat: 12.9716, lng: 77.5946 } // Bangalore coordinates
        };

        const testContact = {
            email: process.env.ADMIN_EMAIL || 'info@haspranahealth.com',
            priority: 1
        };

        console.log('\n🧪 TESTING EMAIL ALERT SYSTEM');
        console.log('================================');
        console.log(`📧 Sending test email to: ${testContact.email}`);
        console.log(`🚨 Alert Type: ${testAlert.type}`);
        console.log(`👤 Patient: ${testAlert.user}`);

        const mapsLink = `https://www.google.com/maps?q=${testAlert.location.lat},${testAlert.location.lng}`;

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
                    .test-badge { background: #3498db; color: white; padding: 5px 10px; border-radius: 3px; font-size: 11px; display: inline-block; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="alert-icon">🚨</div>
                        <h1>🆘 MANUAL SOS BUTTON PRESSED</h1>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">Arohan Health Emergency Alert</p>
                        <span class="test-badge">🧪 TEST MODE</span>
                    </div>
                    <div class="content">
                        <div class="alert-box">
                            <strong>⚠️ THIS IS A TEST EMAIL</strong><br>
                            This is a test of the Arohan Health emergency alert system. In a real emergency, this email would be sent to your emergency contacts.
                        </div>
                        
                        <div class="info-row">
                            <span class="label">👤 Patient:</span> ${testAlert.user}
                        </div>
                        
                        <div class="info-row">
                            <span class="label">📍 Your Contact Priority:</span> #${testContact.priority}
                        </div>
                        
                        <div class="info-row">
                            <span class="label">🚨 Alert Type:</span> MANUAL SOS
                        </div>
                        
                        <div class="info-row">
                            <span class="label">⏰ Time:</span> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </div>
                        
                        <div class="info-row">
                            <span class="label">📍 Location:</span><br>
                            <a href="${mapsLink}" class="cta-button" style="margin-top: 10px;">📍 View Location on Google Maps</a>
                        </div>
                        
                        <div style="background: #e8f5e9; padding: 20px; border-radius: 5px; margin-top: 20px;">
                            <strong>✅ WHAT TO EXPECT IN A REAL ALERT:</strong><br>
                            1. Immediate email notification<br>
                            2. SMS alert (when SMS is configured)<br>
                            3. Push notification on Arohan app<br>
                            4. Real-time location tracking
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from <strong>Arohan Health Platform</strong></p>
                        <p>For technical support, contact: support@arohanhealth.com</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const result = await sendEmail({
            to: testContact.email,
            subject: `🧪 TEST - Emergency Alert System Verification`,
            html: htmlContent
        });

        console.log('\n✅ TEST RESULT:');
        console.log('================================');
        if (result.success) {
            console.log('✅ Email sent successfully!');
            console.log(`📬 Message ID: ${result.messageId}`);
            console.log(`\n📧 Check your inbox at: ${testContact.email}`);
            console.log('\n💡 If you don\'t see the email:');
            console.log('   1. Check your spam/junk folder');
            console.log('   2. Verify SMTP credentials in .env file');
            console.log('   3. Check backend logs for errors');
        } else {
            console.log('❌ Email failed to send');
            console.log(`❌ Error: ${result.error}`);
            console.log('\n🔧 TROUBLESHOOTING:');
            console.log('   1. Verify SMTP_USER and SMTP_PASSWORD in .env');
            console.log('   2. If using Gmail, enable "App Passwords"');
            console.log('   3. Check if SMTP port 587 is not blocked by firewall');
        }

        process.exit(result.success ? 0 : 1);
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
};

testEmailAlert();
