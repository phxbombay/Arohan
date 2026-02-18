import {
    Activity as ActivityIcon,
    Database as DatabaseIcon,
    Lock as LockIcon,
    TrendingUp as TrendingUpIcon,
    Shield as ShieldIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    Chip,
    Stack
} from '@mui/material';

export function Doctors() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
            {/* Hero */}
            <Box sx={{ bgcolor: 'grey.900', color: 'common.white', py: 12 }}>
                <Container sx={{ textAlign: 'center' }}>
                    <Chip
                        label="For Healthcare Providers"
                        sx={{ bgcolor: 'primary.dark', color: 'primary.light', mb: 3, fontWeight: 600 }}
                    />
                    <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                        Data-Driven Remote Patient Monitoring
                    </Typography>
                    <Typography variant="h5" color="grey.400" sx={{ maxWidth: 800, mx: 'auto', mb: 5 }}>
                        Empower your practice with real-time vitals, risk stratification, and seamless API integration.
                        Reduce readmissions and improve patient outcomes.
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            component={Link}
                            to="/contact"
                            variant="contained"
                            size="large"
                            color="secondary"
                            sx={{ px: 4, py: 1.5 }}
                        >
                            Schedule Demo
                        </Button>
                        <Button
                            component={Link}
                            to="/how-it-works"
                            variant="outlined"
                            size="large"
                            sx={{ px: 4, py: 1.5, borderColor: 'common.white', color: 'common.white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'common.white' } }}
                        >
                            View API Docs
                        </Button>
                    </Stack>
                </Container>
            </Box>

            {/* Key Benefits */}
            <Box sx={{ py: 10 }}>
                <Container>
                    <Grid container spacing={6} justifyContent="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <Box sx={{ mb: 2 }}>
                                <ActivityIcon size={48} color="#dc2626" />
                            </Box>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Continuous Monitoring</Typography>
                            <Typography variant="body1" color="text.secondary">
                                Access 24/7 patient vitals including HR, HRV, and activity patterns via our clinician dashboard.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Box sx={{ mb: 2 }}>
                                <DatabaseIcon size={48} color="#dc2626" />
                            </Box>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Seamless Integration</Typography>
                            <Typography variant="body1" color="text.secondary">
                                FHIR-compliant APIs ensure easy integration with your existing EHR/EMR systems (Epic, Cerner, etc.).
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Box sx={{ mb: 2 }}>
                                <TrendingUpIcon size={48} color="#dc2626" />
                            </Box>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Risk Stratification</Typography>
                            <Typography variant="body1" color="text.secondary">
                                AI algorithms identify high-risk patients based on movement anomalies and vital trends.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Compliance Strip */}
            <Box sx={{ bgcolor: 'grey.50', py: 6, borderTop: 1, borderBottom: 1, borderColor: 'grey.200' }}>
                <Container>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                <LockIcon size={20} color="#757575" />
                                <Typography variant="h6" color="text.primary">HIPAA Compliant</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                <ShieldIcon size={20} color="#757575" />
                                <Typography variant="h6" color="text.primary">SOC2 Certified</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                <DatabaseIcon size={20} color="#757575" />
                                <Typography variant="h6" color="text.primary">End-to-End Encryption</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
