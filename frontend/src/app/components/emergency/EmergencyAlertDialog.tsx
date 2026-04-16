import {
    Call as CallIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    MailOutline as MailOutlineIcon,
    Sms as SmsIcon,
    WhatsApp as WhatsAppIcon,
    WarningAmber as WarningAmberIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormGroup,
    Stack,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    ALERT_CHANNELS,
    ALERT_CHANNEL_META,
    AlertChannel,
    EmergencyContact,
    fetchEmergencyContacts,
    getChannelCoverage,
    triggerEmergencyAlert,
} from '@features/emergency/services/emergencyApi';

type EmergencyAlertDialogProps = {
    open: boolean;
    onClose: () => void;
    contacts?: EmergencyContact[];
    isAuthenticated?: boolean;
};

const channelIcons: Record<AlertChannel, React.ReactElement> = {
    email: <MailOutlineIcon fontSize="small" />,
    sms: <SmsIcon fontSize="small" />,
    whatsapp: <WhatsAppIcon fontSize="small" />,
};

const resolveUserLocation = async () => {
    if (!('geolocation' in navigator)) {
        return null;
    }

    return new Promise<{ lat: number; lng: number } | null>((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            }),
            () => resolve(null),
            {
                enableHighAccuracy: true,
                timeout: 6000,
                maximumAge: 60000,
            }
        );
    });
};

const formatChannelSummary = (coverage: Record<AlertChannel, number>) => {
    return ALERT_CHANNELS.filter(channel => coverage[channel] > 0);
};

export function EmergencyAlertDialog({
    open,
    onClose,
    contacts,
    isAuthenticated = true,
}: EmergencyAlertDialogProps) {
    const [localContacts, setLocalContacts] = useState<EmergencyContact[]>([]);
    const [contactsLoading, setContactsLoading] = useState(false);
    const [selectedChannels, setSelectedChannels] = useState<AlertChannel[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [deliverySummary, setDeliverySummary] = useState<any>(null);

    const effectiveContacts = contacts ?? localContacts;
    const channelCoverage = getChannelCoverage(effectiveContacts);
    const activeChannels = formatChannelSummary(channelCoverage);

    useEffect(() => {
        if (!open) {
            setErrorMessage('');
            setDeliverySummary(null);
            setSelectedChannels([]);
            return;
        }

        if (!isAuthenticated || contacts) {
            return;
        }

        let active = true;

        const loadContacts = async () => {
            try {
                setContactsLoading(true);
                const nextContacts = await fetchEmergencyContacts();
                if (active) {
                    setLocalContacts(nextContacts);
                }
            } catch (error: any) {
                if (active) {
                    const nextMessage = error?.response?.data?.message || 'Unable to load emergency contacts.';
                    setErrorMessage(nextMessage);
                }
            } finally {
                if (active) {
                    setContactsLoading(false);
                }
            }
        };

        loadContacts();

        return () => {
            active = false;
        };
    }, [contacts, isAuthenticated, open]);

    useEffect(() => {
        if (!open || selectedChannels.length > 0 || activeChannels.length === 0) {
            return;
        }

        setSelectedChannels(activeChannels);
    }, [activeChannels, open, selectedChannels.length]);

    const toggleChannel = (channel: AlertChannel) => {
        if (channelCoverage[channel] === 0) {
            return;
        }

        setSelectedChannels(current =>
            current.includes(channel)
                ? current.filter(item => item !== channel)
                : [...current, channel]
        );
    };

    const handleTriggerAlert = async () => {
        const enabledSelection = selectedChannels.filter(channel => channelCoverage[channel] > 0);

        if (enabledSelection.length === 0) {
            setErrorMessage('Choose at least one channel that matches your saved emergency contacts.');
            return;
        }

        try {
            setSubmitting(true);
            setErrorMessage('');

            const location = await resolveUserLocation();
            if (!location) {
                toast.warning('Location unavailable. The SOS alert will still be sent without GPS coordinates.');
            }

            const response = await triggerEmergencyAlert({
                channels: enabledSelection,
                location,
            });

            setDeliverySummary(response.delivery?.summary || null);
            toast.success('Emergency alert sent to your configured contacts.');
        } catch (error: any) {
            const nextMessage = error?.response?.data?.message || 'Unable to send the emergency alert.';
            setErrorMessage(nextMessage);
            toast.error(nextMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const renderCoverage = () => (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {ALERT_CHANNELS.map(channel => (
                <Chip
                    key={channel}
                    icon={channelIcons[channel]}
                    label={`${ALERT_CHANNEL_META[channel].label}: ${channelCoverage[channel]}`}
                    color={channelCoverage[channel] > 0 ? ALERT_CHANNEL_META[channel].color : 'default'}
                    variant={channelCoverage[channel] > 0 ? 'filled' : 'outlined'}
                />
            ))}
        </Stack>
    );

    return (
        <Dialog
            open={open}
            onClose={submitting ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'hidden',
                }
            }}
        >
            <DialogTitle
                sx={{
                    background: 'linear-gradient(135deg, rgba(183,28,28,0.96), rgba(211,47,47,0.9))',
                    color: 'common.white',
                    pb: 2,
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <WarningAmberIcon />
                    <Box>
                        <Typography variant="h6" fontWeight={800}>
                            Emergency SOS
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Notify the right people through the channels you choose.
                        </Typography>
                    </Box>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                {!isAuthenticated ? (
                    <Alert severity="info">
                        Sign in to notify saved emergency contacts. You can still call 112 right away from this device.
                    </Alert>
                ) : contactsLoading ? (
                    <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
                        <CircularProgress />
                        <Typography variant="body2" color="text.secondary">
                            Loading emergency contacts...
                        </Typography>
                    </Stack>
                ) : deliverySummary ? (
                    <Stack spacing={3}>
                        <Alert
                            icon={<CheckCircleOutlineIcon />}
                            severity="success"
                            sx={{ borderRadius: 3 }}
                        >
                            Alert delivered to {deliverySummary.contactsReached} of {deliverySummary.contactsProcessed} contacts.
                        </Alert>

                        <Box
                            sx={{
                                borderRadius: 3,
                                p: 2.5,
                                background: 'linear-gradient(180deg, rgba(255,245,245,1), rgba(255,250,250,1))',
                                border: '1px solid',
                                borderColor: 'error.light',
                            }}
                        >
                            <Stack spacing={1.5}>
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Delivery summary
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {deliverySummary.totalSent} sends completed, {deliverySummary.totalSkipped} skipped, {deliverySummary.totalFailed} failed.
                                </Typography>
                                {renderCoverage()}
                            </Stack>
                        </Box>

                        <Stack spacing={1.5}>
                            {ALERT_CHANNELS.map(channel => (
                                <Box
                                    key={channel}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        px: 2,
                                        py: 1.5,
                                        borderRadius: 2.5,
                                        bgcolor: 'grey.50',
                                    }}
                                >
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        {channelIcons[channel]}
                                        <Typography variant="body2" fontWeight={600}>
                                            {ALERT_CHANNEL_META[channel].label}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        Sent {deliverySummary.channelTotals[channel]?.sent || 0} / Attempted {deliverySummary.channelTotals[channel]?.attempted || 0}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                ) : (
                    <Stack spacing={3}>
                        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

                        <Box
                            sx={{
                                borderRadius: 3,
                                p: 2.5,
                                background: 'linear-gradient(180deg, rgba(255,244,244,1), rgba(255,250,250,1))',
                                border: '1px solid',
                                borderColor: 'error.light',
                            }}
                        >
                            <Stack spacing={1.5}>
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Coverage right now
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {effectiveContacts.length > 0
                                        ? `${effectiveContacts.length} saved contacts are ready for emergency notifications.`
                                        : 'No emergency contacts found yet.'}
                                </Typography>
                                {renderCoverage()}
                            </Stack>
                        </Box>

                        {effectiveContacts.length === 0 ? (
                            <Alert severity="warning">
                                Add at least one emergency contact from the patient dashboard before sending a multi-channel SOS.
                            </Alert>
                        ) : (
                            <>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                        Choose channels for this alert
                                    </Typography>
                                    <FormGroup>
                                        {ALERT_CHANNELS.map(channel => (
                                            <FormControlLabel
                                                key={channel}
                                                control={
                                                    <Checkbox
                                                        checked={selectedChannels.includes(channel)}
                                                        disabled={channelCoverage[channel] === 0 || submitting}
                                                        onChange={() => toggleChannel(channel)}
                                                    />
                                                }
                                                label={
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        {channelIcons[channel]}
                                                        <Typography variant="body2">
                                                            {ALERT_CHANNEL_META[channel].label}
                                                        </Typography>
                                                        <Chip
                                                            label={`${channelCoverage[channel]} ready`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </Stack>
                                                }
                                            />
                                        ))}
                                    </FormGroup>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                        Contacts in this alert
                                    </Typography>
                                    <Stack spacing={1.25}>
                                        {effectiveContacts.slice(0, 4).map(contact => (
                                            <Box
                                                key={contact.contact_id}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    px: 2,
                                                    py: 1.5,
                                                    borderRadius: 2.5,
                                                    bgcolor: 'grey.50',
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="body2" fontWeight={700}>
                                                        {contact.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {contact.relation || 'Emergency contact'}{contact.priority ? ` • Priority ${contact.priority}` : ''}
                                                    </Typography>
                                                </Box>
                                                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="flex-end">
                                                    {(contact.available_channels || []).map(channel => (
                                                        <Chip
                                                            key={`${contact.contact_id}-${channel}`}
                                                            size="small"
                                                            label={ALERT_CHANNEL_META[channel].label}
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </>
                        )}
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <Button
                    startIcon={<CallIcon />}
                    color="error"
                    variant={deliverySummary ? 'contained' : 'outlined'}
                    onClick={() => {
                        window.location.href = 'tel:112';
                    }}
                >
                    Call 112
                </Button>

                {deliverySummary ? (
                    <Button variant="contained" onClick={onClose}>
                        Done
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="error"
                        disabled={!isAuthenticated || effectiveContacts.length === 0 || submitting}
                        onClick={handleTriggerAlert}
                    >
                        {submitting ? 'Sending...' : 'Send SOS'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
