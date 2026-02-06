import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Avatar,
    Stack,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Search as SearchIcon,
    Favorite as HeartIcon,
    TrendingUp as TrendingUpIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Person as PersonIcon,
    Notifications as NotificationsIcon,
    CalendarToday as CalendarIcon,
    LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import api from '../../../services/api';
import { DashboardWidget } from '../../components/dashboard/DashboardWidget';

export function PhysicianDashboard() {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState({
        totalPatients: 0,
        activeAlerts: 0,
        appointmentsToday: 0,
        criticalCases: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch patients assigned to this physician
            const patientsRes = await api.get('/physician/patients');
            setPatients(patientsRes.data.data || []);

            // Fetch active alerts
            const alertsRes = await api.get('/physician/alerts');
            setAlerts(alertsRes.data.data || []);

            // Fetch stats
            const statsRes = await api.get('/physician/stats');
            setStats(statsRes.data.data || stats);

        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAlertSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'info';
            default: return 'success';
        }
    };

    const getVitalStatus = (vital, value) => {
        // Simple logic - enhance with actual thresholds
        if (vital === 'heart_rate') {
            if (value < 60 || value > 100) return 'warning';
        }
        if (vital === 'blood_pressure_systolic') {
            if (value < 90 || value > 140) return 'warning';
        }
        return 'normal';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Physician Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Welcome, Dr. {user?.full_name}
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <PersonIcon fontSize="large" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">{stats.totalPatients}</Typography>
                                        <Typography variant="body2">Total Patients</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <NotificationsIcon fontSize="large" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">{stats.activeAlerts}</Typography>
                                        <Typography variant="body2">Active Alerts</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <CalendarIcon fontSize="large" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">{stats.appointmentsToday}</Typography>
                                        <Typography variant="body2">Appointments Today</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <WarningIcon fontSize="large" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">{stats.criticalCases}</Typography>
                                        <Typography variant="body2">Critical Cases</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    {/* Active Alerts */}
                    <Grid item xs={12} lg={4}>
                        <DashboardWidget title="Active Alerts">
                            <Stack spacing={2} sx={{ mt: 2, maxHeight: 400, overflowY: 'auto' }}>
                                {alerts.length === 0 ? (
                                    <Alert severity="success">No active alerts</Alert>
                                ) : (
                                    alerts.map((alert, index) => (
                                        <Paper key={index} sx={{ p: 2, borderLeft: 4, borderColor: `${getAlertSeverityColor(alert.severity)}.main` }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="start">
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {alert.patient_name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {alert.alert_type}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(alert.created_at).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={alert.severity}
                                                    color={getAlertSeverityColor(alert.severity)}
                                                    size="small"
                                                />
                                            </Stack>
                                        </Paper>
                                    ))
                                )}
                            </Stack>
                        </DashboardWidget>
                    </Grid>

                    {/* Patient List */}
                    <Grid item xs={12} lg={8}>
                        <DashboardWidget
                            title="My Patients"
                            action={
                                <TextField
                                    size="small"
                                    placeholder="Search patients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            }
                        >
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Patient</TableCell>
                                            <TableCell>Age</TableCell>
                                            <TableCell>Last Vitals</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredPatients.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    <Typography color="text.secondary">No patients found</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredPatients.map((patient) => (
                                                <TableRow key={patient.user_id} hover>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={2} alignItems="center">
                                                            <Avatar>{patient.full_name?.charAt(0)}</Avatar>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight="bold">
                                                                    {patient.full_name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {patient.email}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>{patient.age || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Stack spacing={0.5}>
                                                            <Typography variant="caption">
                                                                HR: {patient.latest_vitals?.heart_rate || 'N/A'} bpm
                                                            </Typography>
                                                            <Typography variant="caption">
                                                                BP: {patient.latest_vitals?.blood_pressure || 'N/A'}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={patient.status || 'Stable'}
                                                            color={patient.status === 'Critical' ? 'error' : 'success'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button size="small" variant="outlined">
                                                            View Details
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DashboardWidget>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
