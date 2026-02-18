import { otpRepository } from '../repositories/otpRepository.js';
import { sendEmail } from '../config/email.js';
import smsService from './smsService.js';
import logger from '../config/logger.js';

export const otpService = {
    /**
     * Generate and send OTP for registration
     */
    async sendRegistrationOTP(user) {
        const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Invalidate previous registration OTPs
        await otpRepository.invalidateAll(user.user_id, 'registration');

        // Store OTP
        await otpRepository.create({
            user_id: user.user_id,
            otp_code,
            purpose: 'registration',
            expires_at
        });

        // Send via Email
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #4a90e2; text-align: center;">Arohan Health Verification</h2>
                <p>Hello <strong>${user.full_name}</strong>,</p>
                <p>Thank you for joining Arohan Health. To complete your registration, please use the following verification code:</p>
                <div style="background-color: #f5f7fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp_code}</span>
                </div>
                <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="text-align: center; color: #999; font-size: 12px;">© 2026 Arohan Health Care Solutions</p>
            </div>
        `;

        await sendEmail({
            to: user.email,
            subject: 'Verify your Arohan Health Account',
            html: emailHtml
        });

        // Send via SMS
        if (user.phone_number) {
            await smsService.sendSMS({
                to: user.phone_number,
                message: `Your Arohan Health verification code is: ${otp_code}. Valid for 10 minutes.`,
                emergency: false
            });
        }

        logger.info('Registration OTP sent', { userId: user.user_id, email: user.email });
        return true;
    },

    /**
     * Verify OTP
     */
    async verifyOTP(user_id, otp_code, purpose) {
        const otp = await otpRepository.findValid(user_id, otp_code, purpose);
        if (!otp) {
            return false;
        }

        await otpRepository.markAsUsed(otp.otp_id);
        return true;
    }
};
