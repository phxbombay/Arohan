import { beforeEach, describe, expect, it, vi } from 'vitest';

const queryMock = vi.fn();
const broadcastEmergencyMock = vi.fn();
const decryptMock = vi.fn();
const auditLogMock = vi.fn();

vi.mock('../config/db.js', () => ({
    default: {
        query: queryMock,
    },
}));

vi.mock('../services/notificationService.js', () => ({
    default: {
        broadcastEmergency: broadcastEmergencyMock,
    },
}));

vi.mock('../utils/encryption.js', () => ({
    decrypt: decryptMock,
}));

vi.mock('../middleware/auditLog.js', () => ({
    auditLog: auditLogMock,
}));

vi.mock('../services/emergencyAlertService.js', () => {
    const supportedChannels = ['email', 'sms', 'whatsapp'];
    const normalizeChannels = (channels, { defaultToAll = false } = {}) => {
        if (channels == null) {
            return defaultToAll ? [...supportedChannels] : [];
        }

        const list = Array.isArray(channels) ? channels : [channels];
        const normalized = [...new Set(
            list
                .map(channel => typeof channel === 'string' ? channel.toLowerCase().trim() : '')
                .filter(channel => supportedChannels.includes(channel))
        )];

        return normalized;
    };

    return {
        SUPPORTED_ALERT_CHANNELS: supportedChannels,
        normalizeAlertChannels: normalizeChannels,
        parseStoredAlertChannels: (channels) => {
            if (!channels) {
                return null;
            }

            const parsed = typeof channels === 'string' ? JSON.parse(channels) : channels;
            const normalized = normalizeChannels(parsed);
            return normalized.length > 0 ? normalized : null;
        },
    };
});

const { triggerAlert } = await import('../controllers/alertsController.js');

describe('Alerts Controller', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
            user: { user_id: 'user-1' },
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        queryMock.mockReset();
        broadcastEmergencyMock.mockReset();
        decryptMock.mockReset();
        auditLogMock.mockReset();
    });

    it('passes requested channels through to the broadcaster and returns a delivery summary', async () => {
        req.body = {
            type: 'manual_sos',
            location: { lat: 12.97, lng: 77.59 },
            channels: ['sms', 'email'],
        };

        queryMock
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([[
                {
                    contact_id: 'contact-1',
                    name: 'Mom',
                    phone: 'encrypted-phone',
                    email: 'mom@example.com',
                    preferred_channels: '["sms"]',
                    priority: 1,
                },
            ]])
            .mockResolvedValueOnce([[{ full_name: 'Jane Patient' }]]);

        decryptMock.mockReturnValue('+919999999999');
        broadcastEmergencyMock.mockResolvedValue({
            contact_id: 'contact-1',
            contact_name: 'Mom',
            requestedChannels: ['sms', 'email'],
            enabledChannels: ['sms'],
            attemptedChannels: ['sms'],
            sentChannels: ['sms'],
            failedChannels: [],
            skippedChannels: ['email'],
            channelResults: {
                sms: { success: true, sid: 'sms-1' },
                email: { success: false, skipped: true, reason: 'channel_not_enabled_for_contact' },
            },
        });

        await triggerAlert(req, res);

        expect(broadcastEmergencyMock).toHaveBeenCalledWith(
            expect.objectContaining({
                contact_id: 'contact-1',
                phone: '+919999999999',
                preferred_channels: ['sms'],
            }),
            expect.objectContaining({
                user: 'Jane Patient',
                type: 'manual_sos',
            }),
            { channels: ['sms', 'email'] }
        );

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                delivery: expect.objectContaining({
                    summary: expect.objectContaining({
                        requestedChannels: ['sms', 'email'],
                        totalSent: 1,
                        totalSkipped: 1,
                    }),
                }),
            })
        );
        expect(auditLogMock).toHaveBeenCalled();
    });

    it('rejects unsupported channels before touching the database', async () => {
        req.body = {
            channels: ['fax'],
        };

        await triggerAlert(req, res);

        expect(queryMock).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                supported_channels: ['email', 'sms', 'whatsapp'],
            })
        );
    });
});
