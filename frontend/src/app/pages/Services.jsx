import {
    LocalHospital as HospitalIcon,
    HealthAndSafety as SafetyIcon,
    MedicalServices as MedicalIcon,
    MonitorHeart as HeartIcon,
    Psychology as PsychologyIcon,
    PersonAdd as CaregiverIcon
} from '@mui/icons-material';
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Button
} from '@mui/material';
import { Link } from 'react-router-dom';

export function Services() {
    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ bgcolor: 'primary.dark', color: 'common.white', py: 10, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>Our Services</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.8 }}>Comprehensive care solutions for every need.</Typography>
                </Container>
            </Box>

            <Box sx={{ py: 10 }}>
                <Container>
                    <Grid container spacing={4}>
                        {[
                            { title: "Remote Patient Monitoring", icon: <HeartIcon fontSize="large" />, desc: "Continuous tracking of vitals using our advanced wearable plugin." },
                            { title: "Emergency Response", icon: <HospitalIcon fontSize="large" />, desc: "24/7 coordination with ambulances and nearby hospitals." },
                            { title: "Fall Detection", icon: <SafetyIcon fontSize="large" />, desc: "AI-powered algorithms to detect falls instantly and alert caregivers." },
                            { title: "Teleconsultation", icon: <MedicalIcon fontSize="large" />, desc: "Connect with doctors remotely for regular check-ups." },
                            { title: "Mental Wellness", icon: <PsychologyIcon fontSize="large" />, desc: "Support for anxiety and emotional well-being for seniors." },
                            { title: "Caregiver Training", icon: <CaregiverIcon fontSize="large" />, desc: "Resources and training for family members to provide better care." }
                        ].map((service, i) => (
                            <Grid item xs={12} md={6} lg={4} key={i}>
                                <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                                    <CardHeader
                                        avatar={<Box sx={{ color: 'primary.main' }}>{service.icon}</Box>}
                                        title={<Typography variant="h6" fontWeight="bold">{service.title}</Typography>}
                                    />
                                    <CardContent>
                                        <Typography variant="body1" color="text.secondary">{service.desc}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Need a custom solution?</Typography>
                        <Button component={Link} to="/contact" variant="contained" size="large" sx={{ mt: 2 }}>
                            Contact Us
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
