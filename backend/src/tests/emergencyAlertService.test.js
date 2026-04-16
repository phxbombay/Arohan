import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendEmailMock = vi.fn();
const sendEmergencySmsMock = vi.fn();
const sendEmergencyWhatsappMock = vi.fn();

vi.mock('../config/email.js', () => ({
    sendEmail: sendEmailMock,
}));

vi.mock('../services/smsService.js', () => ({
    default: {
        sendEmergencyAlert: sendEmergencySmsMock,
    },
}));

vi.mock('../services/whatsapp.js', () => ({
    whatsappService: {
        sendEmergencyAlert: sendEmergencyWhatsappMock,
    },
}));

const {
    broadcastEmergency,
    getContactEnabledChannels,
    normalizeAlertChannels,
    parseStoredAlertChannels,
} = await import('../services/emergencyAlertService.js');

describe('Emergency Alert Service', () => {
    beforeEach(() => {
        sendEmailMock.mockReset();
        sendEmergencySmsMock.mockReset();
        sendEmergencyWhatsappMock.mockReset();
    });

    it('normalizes stored and requested channels', () => {
        expect(normalizeAlertChannels([' SMS ', 'email', 'sms', 'invalid'])).toEqual(['sms', 'email']);
        expect(parseStoredAlertChannels('["email","WHATSAPP","invalid"]')).toEqual(['email', 'whatsapp']);
        expect(getContactEnabledChannels({
            phone: '+919999999999',
            email: 'contact@example.com',
            preferred_channels: '["email","whatsapp"]',
        })).toEqual(['email', 'whatsapp']);
    });

    it('delivers only channels enabled for the contact', async () => {
        sendEmailMock.mockResolvedValue({ success: true, messageId: 'email-1' });
        sendEmergencySmsMock.mockResolvedValue({ success: true, sid: 'sms-1' });
        sendEmergencyWhatsappMock.mockResolvedValue({ success: true, messageId: 'wa-1' });

        const result = await broadcastEmergency(
            {
                contact_id: 'contact-1',
                name: 'Mom',
                phone: '+919999999999',
                email: 'mom@example.com',
                preferred_channels: ['email', 'sms'],
            },
            {
                user: 'Jane Patient',
                type: 'manual_sos',
                location: { lat: 12.9716, lng: 77.5946 },
            },
            {
                channels: ['email', 'sms', 'whatsapp'],
            }
        );

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmergencySmsMock).toHaveBeenCalledTimes(1);
        expect(sendEmergencyWhatsappMock).not.toHaveBeenCalled();
        expect(result.sentChannels).toEqual(['email', 'sms']);
        expect(result.skippedChannels).toEqual(['whatsapp']);
        expect(result.channelResults.whatsapp).toEqual(
            expect.objectContaining({
                skipped: true,
                reason: 'channel_not_enabled_for_contact',
            })
        );
    });

    it('skips missing channels and records failures without aborting the alert', async () => {
        sendEmergencySmsMock.mockResolvedValue({ success: true, sid: 'sms-2' });
        sendEmergencyWhatsappMock.mockResolvedValue({ success: false, error: 'WhatsApp unavailable' });

        const result = await broadcastEmergency(
            {
                contact_id: 'contact-2',
                name: 'Dad',
                phone: '+918888888888',
                email: null,
                preferred_channels: null,
            },
            {
                user: 'Jane Patient',
                type: 'fall_detected',
                location: null,
            }
        );

        expect(sendEmailMock).not.toHaveBeenCalled();
        expect(sendEmergencySmsMock).toHaveBeenCalledTimes(1);
        expect(sendEmergencyWhatsappMock).toHaveBeenCalledTimes(1);
        expect(result.skippedChannels).toContain('email');
        expect(result.failedChannels).toContain('whatsapp');
        expect(result.channelResults.email).toEqual(
            expect.objectContaining({
                skipped: true,
                reason: 'missing_contact_email',
            })
        );
        expect(result.channelResults.whatsapp).toEqual(
            expect.objectContaining({
                success: false,
                error: 'WhatsApp unavailable',
            })
        );
    });
});
