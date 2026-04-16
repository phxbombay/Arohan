import {
    DeleteOutline as DeleteOutlineIcon,
    MailOutline as MailOutlineIcon,
    Sms as SmsIcon,
    WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    Divider,
    FormControlLabel,
    FormGroup,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    ALERT_CHANNELS,
    ALERT_CHANNEL_META,
    AlertChannel,
    EmergencyContact,
    createEmergencyContact,
    deleteEmergencyContact,
    fetchEmergencyContacts,
    getChannelCoverage,
} from '@features/emergency/services/emergencyApi';

const emptyForm = {
    name: '',
    relation: '',
    phone: '',
    email: '',
    priority: 1,
    preferredChannels: [] as AlertChannel[],
};

const channelIcons: Record<AlertChannel, React.ReactElement> = {
    email: <MailOutlineIcon fontSize="small" />,
    sms: <SmsIcon fontSize="small" />,
    whatsapp: <WhatsAppIcon fontSize="small" />,
};

const getDraftChannels = (draft: typeof emptyForm): AlertChannel[] => {
    const channels: AlertChannel[] = [];

    if (draft.email.trim()) {
        channels.push('email');
    }

    if (draft.phone.trim()) {
        channels.push('sms', 'whatsapp');
    }

    return channels;
};

export function EmergencyContactsCard() {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        let active = true;

        const loadContacts = async () => {
            try {
                setLoading(true);
                const nextContacts = await fetchEmergencyContacts();
                if (active) {
                    setContacts(nextContacts);
                    setForm(current => ({
                        ...current,
                        priority: nextContacts.length + 1,
                    }));
                }
            } catch (error: any) {
                if (active) {
                    setErrorMessage(error?.response?.data?.message || 'Unable to load emergency contacts.');
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadContacts();

        return () => {
            active = false;
        };
    }, []);

    const coverage = getChannelCoverage(contacts);
    const draftChannels = getDraftChannels(form);

    const updateFormField = (field: keyof typeof emptyForm, value: string | number) => {
        setForm(current => {
            const nextForm = {
                ...current,
                [field]: value,
            };
            const supportedChannels = getDraftChannels(nextForm);

            return {
                ...nextForm,
                preferredChannels: current.preferredChannels.filter(channel => supportedChannels.includes(channel)),
            };
        });
    };

    const togglePreferredChannel = (channel: AlertChannel) => {
        if (!draftChannels.includes(channel)) {
            return;
        }

        setForm(current => ({
            ...current,
            preferredChannels: current.preferredChannels.includes(channel)
                ? current.preferredChannels.filter(item => item !== channel)
                : [...current.preferredChannels, channel],
        }));
    };

    const resetForm = (nextPriority: number) => {
        setForm({
            ...emptyForm,
            priority: nextPriority,
        });
    };

    const handleCreateContact = async () => {
        if (!form.name.trim() || (!form.phone.trim() && !form.email.trim())) {
            setErrorMessage('Add a name and at least one contact method.');
            return;
        }

        try {
            setSaving(true);
            setErrorMessage('');

            const createdContact = await createEmergencyContact({
                name: form.name.trim(),
                relation: form.relation.trim() || undefined,
                phone: form.phone.trim() || undefined,
                email: form.email.trim() || undefined,
                priority: Number(form.priority) || 1,
                preferred_channels: form.preferredChannels.length > 0 ? form.preferredChannels : undefined,
            });

            const nextContacts = [...contacts, createdContact].sort((left, right) => (left.priority || 1) - (right.priority || 1));
            setContacts(nextContacts);
            resetForm(nextContacts.length + 1);
            toast.success('Emergency contact added.');
        } catch (error: any) {
            const nextMessage = error?.response?.data?.message || 'Unable to add the emergency contact.';
            setErrorMessage(nextMessage);
            toast.error(nextMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteContact = async (contactId: string) => {
        try {
            await deleteEmergencyContact(contactId);
            const nextContacts = contacts.filter(contact => contact.contact_id !== contactId);
            setContacts(nextContacts);
            setForm(current => ({
                ...current,
                priority: nextContacts.length + 1,
            }));
            toast.success('Emergency contact removed.');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Unable to remove the emergency contact.');
        }
    };

    return (
        <Card
            sx={{
                borderRadius: 4,
                boxShadow: '0 12px 32px rgba(109, 40, 217, 0.08)',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    px: 3,
                    py: 2.5,
                    background: 'linear-gradient(135deg, rgba(127,29,29,0.96), rgba(194,65,12,0.92))',
                    color: 'common.white',
                }}
            >
                <Typography variant="h6" fontWeight={800}>
                    Emergency Contact Channels
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.88 }}>
                    Build a stronger response net with phone, email, and WhatsApp coverage.
                </Typography>
            </Box>

            <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                    {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

                    <Box
                        sx={{
                            borderRadius: 3,
                            p: 2.25,
                            background: 'linear-gradient(180deg, rgba(255,247,237,1), rgba(255,251,245,1))',
                            border: '1px solid',
                            borderColor: 'warning.light',
                        }}
                    >
                        <Stack spacing={1.5}>
                            <Typography variant="subtitle1" fontWeight={700}>
                                Current channel coverage
                            </Typography>
                            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                {ALERT_CHANNELS.map(channel => (
                                    <Chip
                                        key={channel}
                                        icon={channelIcons[channel]}
                                        label={`${ALERT_CHANNEL_META[channel].label}: ${coverage[channel]}`}
                                        color={coverage[channel] > 0 ? ALERT_CHANNEL_META[channel].color : 'default'}
                                        variant={coverage[channel] > 0 ? 'filled' : 'outlined'}
                                    />
                                ))}
                            </Stack>
                        </Stack>
                    </Box>

                    <Stack spacing={2}>
                        <Typography variant="subtitle1" fontWeight={700}>
                            Add a contact
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={form.name}
                                onChange={(event) => updateFormField('name', event.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Relation"
                                value={form.relation}
                                onChange={(event) => updateFormField('relation', event.target.value)}
                            />
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth
                                label="Phone"
                                placeholder="+91 98765 43210"
                                value={form.phone}
                                onChange={(event) => updateFormField('phone', event.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                placeholder="caregiver@example.com"
                                value={form.email}
                                onChange={(event) => updateFormField('email', event.target.value)}
                            />
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                            <TextField
                                label="Priority"
                                type="number"
                                value={form.priority}
                                onChange={(event) => updateFormField('priority', Number(event.target.value))}
                                sx={{ width: { xs: '100%', sm: 140 } }}
                                inputProps={{ min: 1, max: 5 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Leave channel boxes unchecked to use every available method for this contact.
                            </Typography>
                        </Stack>

                        <FormGroup row>
                            {ALERT_CHANNELS.map(channel => (
                                <FormControlLabel
                                    key={channel}
                                    control={
                                        <Checkbox
                                            checked={form.preferredChannels.includes(channel)}
                                            disabled={!draftChannels.includes(channel) || saving}
                                            onChange={() => togglePreferredChannel(channel)}
                                        />
                                    }
                                    label={
                                        <Stack direction="row" spacing={0.75} alignItems="center">
                                            {channelIcons[channel]}
                                            <Typography variant="body2">
                                                {ALERT_CHANNEL_META[channel].label}
                                            </Typography>
                                        </Stack>
                                    }
                                />
                            ))}
                        </FormGroup>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleCreateContact}
                            disabled={saving}
                            sx={{ alignSelf: 'flex-start', px: 3 }}
                        >
                            {saving ? 'Saving...' : 'Add Emergency Contact'}
                        </Button>
                    </Stack>

                    <Divider />

                    <Box>
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                            Saved contacts
                        </Typography>

                        {loading ? (
                            <Stack alignItems="center" spacing={1.5} sx={{ py: 4 }}>
                                <CircularProgress size={28} />
                                <Typography variant="body2" color="text.secondary">
                                    Loading contacts...
                                </Typography>
                            </Stack>
                        ) : contacts.length === 0 ? (
                            <Alert severity="info">
                                No emergency contacts yet. Add at least one phone or email contact to enable multi-channel SOS delivery.
                            </Alert>
                        ) : (
                            <Stack spacing={1.5}>
                                {contacts.map(contact => (
                                    <Box
                                        key={contact.contact_id}
                                        sx={{
                                            borderRadius: 3,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            p: 2,
                                            backgroundColor: 'common.white',
                                        }}
                                    >
                                        <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={700}>
                                                    {contact.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {contact.relation || 'Emergency contact'} • Priority {contact.priority || 1}
                                                </Typography>
                                                <Stack spacing={0.5} sx={{ mt: 1 }}>
                                                    {contact.phone ? <Typography variant="body2">{contact.phone}</Typography> : null}
                                                    {contact.email ? <Typography variant="body2">{contact.email}</Typography> : null}
                                                </Stack>
                                            </Box>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteContact(contact.contact_id)}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>

                                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
                                            {(contact.available_channels || []).map(channel => (
                                                <Chip
                                                    key={`${contact.contact_id}-${channel}`}
                                                    size="small"
                                                    icon={channelIcons[channel]}
                                                    label={ALERT_CHANNEL_META[channel].label}
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Stack>

                                        {contact.preferred_channels?.length ? (
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                Preferred: {contact.preferred_channels.map(channel => ALERT_CHANNEL_META[channel].label).join(', ')}
                                            </Typography>
                                        ) : null}
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
