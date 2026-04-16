import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
    Avatar,
    Alert,
    LinearProgress
} from '@mui/material';
import {
    Warning as WarningIcon,
    ShoppingBag as ShopIcon,
    History as HistoryIcon,
    Phone as PhoneIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { HealthDashboard } from '../../../features/dashboard/components/HealthDashboard';
import { EmergencyAlertDialog } from '../../components/emergency/EmergencyAlertDialog';
import { EmergencyContactsCard } from '../../components/emergency/EmergencyContactsCard';
import api from '../../../services/api';

/**
 * PatientDashboard - Personalized view for patient users
 * Wraps core health vitals with patient-specific actions
 */
export function PatientDashboard() {
    const { user } = useAuth();
    const [latestVitals, setLatestVitals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEmergencyDialogOpen, setIsEmergencyDialogOpen] = useState(false);

    useEffect(() => {
        const fetchVitals = async () => {
            try {
                const res = await api.get('/vitals/live');
                setLatestVitals(res.data);
            } catch (err) {
                console.error('Failed to fetch latest vitals', err);
            } finally {
                setLoading(false);
            }
        };
        fetchVitals();
    }, []);

    const lastSeenText = latestVitals?.last_seen
        ? new Date(latestVitals.last_seen).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        })
        : 'Waiting for device sync';

    const heartRateValue = latestVitals?.heart_rate || 72;
    const batteryLevel = latestVitals?.battery || 84;

    return (
        <>
            <Box sx={{ minHeight: '100dvh', bgcolor: 'grey.50', pb: 8 }}>
                <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', mb: 4, py: 3 }}>
                    <Container maxWidth="lg">
                        <Grid container alignItems="center" spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar
                                        sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 'bold' }}
                                    >
                                        {user?.full_name?.charAt(0) || 'P'}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">
                                            Hi, {user?.full_name?.split(' ')[0]}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Your emergency network and live health data are ready in one place.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="large"
                                        startIcon={<WarningIcon />}
                                        onClick={() => setIsEmergencyDialogOpen(true)}
                                        sx={{
                                            borderRadius: 8,
                                            px: 4,
                                            py: 1.5,
                                            fontWeight: 'bold',
                                            boxShadow: '0 8px 16px rgba(211, 47, 47, 0.3)',
                                            '&:hover': { transform: 'scale(1.03)', bgcolor: 'error.dark' }
                                        }}
                                    >
                                        SOS EMERGENCY
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Alert severity={loading ? 'info' : 'success'} sx={{ borderRadius: 3, mb: 1 }}>
                                <strong>{loading ? 'Syncing wearable data:' : 'Smart Ring Synced:'}</strong>{' '}
                                {loading
                                    ? 'Fetching your most recent vitals and emergency coverage.'
                                    : `Last device update at ${lastSeenText}. Battery ${batteryLevel}%.`}
                            </Alert>
                        </Grid>

                        <Grid item xs={12} lg={8}>
                            <HealthDashboard />
                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <Stack spacing={4}>
                                <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Vitals Summary
                                        </Typography>
                                        <Stack spacing={3} sx={{ mt: 2 }}>
                                            <Box>
                                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                                    <Typography variant="body2" color="text.secondary">Heart Rate</Typography>
                                                    <Typography variant="body2" fontWeight="bold">{heartRateValue} BPM</Typography>
                                                </Stack>
                                                <LinearProgress variant="determinate" value={Math.min(100, heartRateValue)} color="error" sx={{ height: 8, borderRadius: 4 }} />
                                            </Box>
                                            <Box>
                                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                                    <Typography variant="body2" color="text.secondary">Battery</Typography>
                                                    <Typography variant="body2" fontWeight="bold">{batteryLevel}%</Typography>
                                                </Stack>
                                                <LinearProgress variant="determinate" value={batteryLevel} color="success" sx={{ height: 8, borderRadius: 4 }} />
                                            </Box>
                                            <Box>
                                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                                    <Typography variant="body2" color="text.secondary">Connectivity</Typography>
                                                    <Typography variant="body2" fontWeight="bold">{loading ? 'Syncing' : 'Connected'}</Typography>
                                                </Stack>
                                                <LinearProgress variant="determinate" value={loading ? 35 : 92} color="primary" sx={{ height: 8, borderRadius: 4 }} />
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            sx={{ height: 100, flexDirection: 'column', gap: 1, borderRadius: 4 }}
                                        >
                                            <ShopIcon />
                                            <Typography variant="caption">Our Store</Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            sx={{ height: 100, flexDirection: 'column', gap: 1, borderRadius: 4 }}
                                        >
                                            <HistoryIcon />
                                            <Typography variant="caption">History</Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            sx={{ height: 100, flexDirection: 'column', gap: 1, borderRadius: 4 }}
                                        >
                                            <PhoneIcon />
                                            <Typography variant="caption">Contact Dr.</Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            sx={{ height: 100, flexDirection: 'column', gap: 1, borderRadius: 4 }}
                                        >
                                            <SettingsIcon />
                                            <Typography variant="caption">Settings</Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Grid>

                        <Grid item xs={12}>
                            <EmergencyContactsCard />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <EmergencyAlertDialog
                open={isEmergencyDialogOpen}
                onClose={() => setIsEmergencyDialogOpen(false)}
            />
        </>
    );
}
