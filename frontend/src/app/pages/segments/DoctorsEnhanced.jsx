import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Stack
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle as CheckIcon, LocalHospital as HospitalIcon, Api as ApiIcon, Assessment as ChartIcon } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

export function DoctorsEnhanced() {
    const navigate = useNavigate();

    const handleViewDocs = () => {
        toast.info("Full API documentation is available for registered partners.");
        navigate('/contact');
    };
    const benefits = [
        { title: 'EHR Integration', desc: 'HL7/FHIR compatible API for seamless EMR syncing' },
        { title: 'Multi-Patient Dashboard', desc: 'Monitor 100s of patients from one interface' },
        { title: 'Real-Time Alerts', desc: 'Instant notifications for patient emergencies' },
        { title: 'Historical Analytics', desc: '365-day vitals trends and reports' },
        { title: 'Telehealth Ready', desc: 'View patient vitals during video consultations' },
        { title: 'HIPAA Compliant', desc: 'End-to-end encryption, audit logs' }
    ];

    const useCases = [
        {
            title: 'Post-Discharge Monitoring',
            description: 'Track patients recovering from heart surgery or stroke at home. Get alerts if vitals deviate from safe ranges.',
            icon: <HospitalIcon />
        },
        {
            title: 'Chronic Condition Management',
            description: 'Monitor CHF, COPD, diabetes patients remotely. Reduce hospital readmissions by 30%.',
            icon: <ChartIcon />
        },
        {
            title: 'Elderly Care Facilities',
            description: 'Equip nursing homes with 24/7 fall detection and vitals monitoring for all residents.',
            icon: <HospitalIcon />
        }
    ];

    return (
        <Box>
            <Helmet>
                <title>Arohan for Healthcare Professionals - Patient Remote Monitoring</title>
                <meta name="description" content="EHR-integrated patient monitoring for doctors and hospitals. Track vitals, receive alerts, reduce readmissions. HIPAA compliant. HL7/FHIR API ready." />
            </Helmet>

            {/* Hero */}
            <Box sx={{ bgcolor: 'info.main', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container>
                    <HospitalIcon sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        For Healthcare Professionals
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9 }}>
                        Remote patient monitoring. EHR integration. Better outcomes.
                    </Typography>
                </Container>
            </Box>

            {/* Benefits */}
            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Why Doctors Trust Arohan
                </Typography>
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {benefits.map((benefit, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                                <CheckIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {benefit.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {benefit.desc}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Use Cases */}
            <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 } }}>
                <Container>
                    <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                        Clinical Use Cases
                    </Typography>
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        {useCases.map((useCase, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                                    <Box sx={{ color: 'primary.main', mb: 2, '& svg': { fontSize: 48 } }}>
                                        {useCase.icon}
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {useCase.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {useCase.description}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* API Integration */}
            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Seamless EHR Integration
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Arohan's RESTful API integrates with Epic, Cerner, Allscripts, and any HL7/FHIR-compatible EMR.
                            Patient vitals sync automatically - no manual data entry.
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon><ApiIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="HL7 FHIR R4 compliant" secondary="Industry-standard interoperability" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><ApiIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Webhook notifications" secondary="Real-time alerts to your system" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><ApiIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="OAuth 2.0 authentication" secondary="Secure, HIPAA-compliant access" />
                            </ListItem>
                        </List>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ mt: 2 }}
                            onClick={handleViewDocs}
                        >
                            View API Documentation
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ bgcolor: '#1e1e1e', color: '#d4d4d4', overflow: 'hidden', boxShadow: 6 }}>
                            <Box sx={{ bgcolor: '#252526', px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27c93f' }} />
                                <Typography variant="caption" sx={{ ml: 2, fontFamily: 'monospace', opacity: 0.6 }}>api_example.json</Typography>
                            </Box>
                            <Box sx={{ p: 3, fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace', fontSize: '0.9rem', overflowX: 'auto' }}>
                                <Box sx={{ mb: 2 }}>
                                    <span style={{ color: '#c586c0' }}>GET</span> <span style={{ color: '#ce9178' }}>/api/v1/patients/{'{id}'}/vitals</span><br />
                                    <span style={{ color: '#9cdcfe' }}>Authorization</span>: <span style={{ color: '#ce9178' }}>Bearer YOUR_TOKEN</span>
                                </Box>

                                <Box sx={{ color: '#6a9955', mb: 0.5 }}>// Response (200 OK)</Box>
                                <Box>
                                    {'{'}<br />
                                    &nbsp;&nbsp;<span style={{ color: '#9cdcfe' }}>"patient_id"</span>: <span style={{ color: '#ce9178' }}>"12345"</span>,<br />
                                    &nbsp;&nbsp;<span style={{ color: '#9cdcfe' }}>"heart_rate"</span>: <span style={{ color: '#b5cea8' }}>78</span>,<br />
                                    &nbsp;&nbsp;<span style={{ color: '#9cdcfe' }}>"spo2"</span>: <span style={{ color: '#b5cea8' }}>98</span>,<br />
                                    &nbsp;&nbsp;<span style={{ color: '#9cdcfe' }}>"timestamp"</span>: <span style={{ color: '#ce9178' }}>"2026-01-28T10:30:00Z"</span>,<br />
                                    &nbsp;&nbsp;<span style={{ color: '#9cdcfe' }}>"alerts"</span>: []<br />
                                    {'}'}
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* CTA */}
            <Box sx={{ bgcolor: 'info.main', color: 'white', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Partner with Arohan
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                        Join 50+ hospitals and 200+ doctors using our platform
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button
                            component={Link}
                            to="/contact"
                            variant="contained"
                            size="large"
                            sx={{ bgcolor: 'white', color: 'info.main' }}
                        >
                            Request Demo
                        </Button>
                        <Button
                            component={Link}
                            to="/contact"
                            variant="outlined"
                            size="large"
                            sx={{ borderColor: 'white', color: 'white' }}
                        >
                            Contact Sales
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
