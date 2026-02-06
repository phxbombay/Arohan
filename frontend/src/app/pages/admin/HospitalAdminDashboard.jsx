import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Stack,
    Avatar,
    Alert,
    LinearProgress
} from '@mui/material';
import {
    LocalHospital as HospitalIcon,
    Person as PersonIcon,
    MedicalServices as DoctorIcon,
    Warning as WarningIcon,
    Bed as BedIcon
} from '@mui/icons-material';
// @ts-ignore
import { useAuth } from '../../../features/auth/hooks/useAuth';
// @ts-ignore
import api from '../../../services/api';
import { DashboardWidget } from '../../components/dashboard/DashboardWidget';

export function HospitalAdminDashboard() {
    // @ts-ignore
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalPatients: 0,
        availableBeds: 0,
        activeDoctors: 0,
        criticalAlerts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Mock API call - replace with actual endpoint
                // const res = await api.get('/hospital/stats');
                // setStats(res.data);

                // Artificial delay for demo
                setTimeout(() => {
                    setStats({
                        totalPatients: 142,
                        availableBeds: 18,
                        activeDoctors: 12,
                        criticalAlerts: 3
                    });
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Failed to fetch hospital stats", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Patients', value: stats.totalPatients, icon: PersonIcon, color: '#4facfe' },
        { title: 'Available Beds', value: stats.availableBeds, icon: BedIcon, color: '#43e97b' },
        { title: 'Active Doctors', value: stats.activeDoctors, icon: DoctorIcon, color: '#fa709a' },
        { title: 'Critical Alerts', value: stats.criticalAlerts, icon: WarningIcon, color: '#f093fb' }
    ];

    if (loading) return <LinearProgress />;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Hospital Administration
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Overview for {user?.company || 'General Hospital'}
                    </Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {statCards.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ bgcolor: stat.color, color: 'white' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                                            <stat.icon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                                            <Typography variant="body2">{stat.title}</Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <DashboardWidget title="Bed Occupancy Rate">
                            {/* Placeholder for Chart */}
                            <Box sx={{ height: 300, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography color="text.secondary">Bed Occupancy Chart Component</Typography>
                            </Box>
                        </DashboardWidget>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DashboardWidget title="Recent Critical Alerts">
                            <Stack spacing={2}>
                                {[1, 2, 3].map((i) => (
                                    <Alert key={i} severity="error" variant="outlined">
                                        Patient #{100 + i}: High Heart Rate detected in ICU
                                    </Alert>
                                ))}
                            </Stack>
                        </DashboardWidget>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
