import { useState, useEffect } from 'react';
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
    IconButton,
    Tooltip,
    LinearProgress
} from '@mui/material';
import {
    Favorite as HeartIcon,
    Warning as WarningIcon,
    ShoppingBag as ShopIcon,
    History as HistoryIcon,
    Phone as PhoneIcon,
    Settings as SettingsIcon,
    Notifications as BellIcon
} from '@mui/icons-material';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { HealthDashboard } from '../../../features/dashboard/components/HealthDashboard';
import api from '../../../services/api';

/**
 * PatientDashboard - Personalized view for patient users
 * Wraps core health vitals with patient-specific actions
 */
export function PatientDashboard() {
    const { user } = useAuth();
    const [latestVitals, setLatestVitals] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVitals = async () => {
            try {
                const res = await api.get('/health/vitals/latest');
                setLatestVitals(res.data.data);
            } catch (err) {
                console.error('Failed to fetch latest vitals', err);
            } finally {
                setLoading(false);
            }
        };
        fetchVitals();
    }, []);

    const handleSOS = () => {
        if (confirm('EMERGENCY: Do you want to trigger an SOS alert to your emergency contacts?')) {
            window.location.href = 'tel:112';
        }
    };

    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'grey.50', pb: 8 }}>
            {/* Header / Summary Strip */}
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
                                        Here's your health status today
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
                                    onClick={handleSOS}
                                    sx={{
                                        borderRadius: 8,
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        boxShadow: '0 8px 16px rgba(211, 47, 47, 0.3)',
                                        '&:hover': { transform: 'scale(1.05)', bgcolor: 'error.dark' }
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
                    {/* Alerts / Vitals Quick View */}
                    <Grid item xs={12}>
                        <Alert severity="success" sx={{ borderRadius: 3, mb: 4 }}>
                            <strong>Smart Ring Synced:</strong> Your vitals were last updated 5 minutes ago. All systems stable.
                        </Alert>
                    </Grid>

                    {/* Left Column: Core Dashboard Content */}
                    <Grid item xs={12} lg={8}>
                        <HealthDashboard />
                    </Grid>

                    {/* Right Column: Quick Stats & Actions */}
                    <Grid item xs={12} lg={4}>
                        <Stack spacing={4}>
                            {/* Personal Vitals Summary */}
                            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Vitals Summary
                                    </Typography>
                                    <Stack spacing={3} sx={{ mt: 2 }}>
                                        <Box>
                                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                                <Typography variant="body2" color="text.secondary">Heart Rate</Typography>
                                                <Typography variant="body2" fontWeight="bold">72 BPM</Typography>
                                            </Stack>
                                            <LinearProgress variant="determinate" value={70} color="error" sx={{ height: 8, borderRadius: 4 }} />
                                        </Box>
                                        <Box>
                                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                                <Typography variant="body2" color="text.secondary">Sleep Score</Typography>
                                                <Typography variant="body2" fontWeight="bold">85/100</Typography>
                                            </Stack>
                                            <LinearProgress variant="determinate" value={85} color="primary" sx={{ height: 8, borderRadius: 4 }} />
                                        </Box>
                                        <Box>
                                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                                <Typography variant="body2" color="text.secondary">Activity</Typography>
                                                <Typography variant="body2" fontWeight="bold">6,432 Steps</Typography>
                                            </Stack>
                                            <LinearProgress variant="determinate" value={64} color="success" sx={{ height: 8, borderRadius: 4 }} />
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Secondary Actions */}
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
                </Grid>
            </Container>
        </Box>
    );
}
