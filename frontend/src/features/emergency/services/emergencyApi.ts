import api from '../../../services/api';

export const ALERT_CHANNELS = ['email', 'sms', 'whatsapp'] as const;

export type AlertChannel = typeof ALERT_CHANNELS[number];

export type EmergencyContact = {
    contact_id: string;
    user_id?: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    relation?: string | null;
    priority?: number;
    preferred_channels?: AlertChannel[] | null;
    available_channels?: AlertChannel[] | null;
};

export type TriggerAlertPayload = {
    channels: AlertChannel[];
    location?: {
        lat: number;
        lng: number;
    } | null;
};

export const ALERT_CHANNEL_META: Record<AlertChannel, { label: string; color: 'error' | 'success' | 'info' }> = {
    email: { label: 'Email', color: 'info' },
    sms: { label: 'SMS', color: 'success' },
    whatsapp: { label: 'WhatsApp', color: 'error' },
};

export const getContactAvailableChannels = (contact: EmergencyContact): AlertChannel[] => {
    if (contact.available_channels?.length) {
        return contact.available_channels;
    }

    const channels: AlertChannel[] = [];

    if (contact.email) {
        channels.push('email');
    }

    if (contact.phone) {
        channels.push('sms', 'whatsapp');
    }

    return [...new Set(channels)];
};

export const getChannelCoverage = (contacts: EmergencyContact[]) => {
    return ALERT_CHANNELS.reduce<Record<AlertChannel, number>>((totals, channel) => {
        totals[channel] = contacts.filter(contact => getContactAvailableChannels(contact).includes(channel)).length;
        return totals;
    }, {
        email: 0,
        sms: 0,
        whatsapp: 0,
    });
};

export const fetchEmergencyContacts = async (): Promise<EmergencyContact[]> => {
    const response = await api.get('/users/emergency-contacts');
    return response.data;
};

export const createEmergencyContact = async (payload: {
    name: string;
    phone?: string;
    email?: string;
    relation?: string;
    priority?: number;
    preferred_channels?: AlertChannel[];
}): Promise<EmergencyContact> => {
    const response = await api.post('/users/emergency-contacts', payload);
    return response.data;
};

export const deleteEmergencyContact = async (contactId: string) => {
    await api.delete(`/users/emergency-contacts/${contactId}`);
};

export const triggerEmergencyAlert = async (payload: TriggerAlertPayload) => {
    const response = await api.post('/alerts/trigger', {
        type: 'manual_sos',
        channels: payload.channels,
        location: payload.location ?? undefined,
    });

    return response.data;
};
