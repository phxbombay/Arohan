import { Box, Container, Typography, Grid, Paper, Button, Stack } from '@mui/material';
import { Computer as ComputerIcon, PhoneIphone as PhoneIcon, BarChart as ChartIcon, Security as SecurityIcon } from '@mui/icons-material';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export function Consulting() {
    const services = [
        {
            title: 'Custom Health Dashboards',
            description: 'We design and develop bespoke healthcare portals for clinics, senior-living homes, and corporate wellness programs.',
            icon: <ComputerIcon sx={{ fontSize: 48 }} />,
            color: 'primary.main'
        },
        {
            title: 'Mobile App Development',
            description: 'Building secure, user-friendly Android & iOS applications for patient monitoring and family caregiving.',
            icon: <PhoneIcon sx={{ fontSize: 48 }} />,
            color: 'secondary.main'
        },
        {
            title: 'API & Device Integration',
            description: 'Expertise in connecting medical-grade sensors with cloud ecosystems, payment gateways, and EHR systems.',
            icon: <ChartIcon sx={{ fontSize: 48 }} />,
            color: 'success.main'
        },
        {
            title: 'Healthcare Cybersecurity',
            description: 'Implementing HIPAA-compliant security architectures, end-to-end encryption, and robust data protection.',
            icon: <SecurityIcon sx={{ fontSize: 48 }} />,
            color: 'warning.main'
        }
    ];

    return (
        <Box>
            <SEO 
                title="Consulting & Tech Solutions - Arohan Health"
                description="Arohan provides expert consulting for healthcare technology, including web development, mobile apps, and device integration for clinics and hospitals."
                keywords="healthcare consulting, website development, app development, medical device integration, health tech Bengaluru"
            />

            {/* Hero Section */}
            <Box sx={{ bgcolor: 'grey.900', color: 'white', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: 2 }}>
                                TECH SOLUTIONS & CONSULTING
                            </Typography>
                            <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                                Building the future of Digital Health
                            </Typography>
                            <Typography variant="h5" sx={{ opacity: 0.8, mb: 4, lineHeight: 1.6 }}>
                                Beyond our wearable tech, we help healthcare organizations build robust, secure, and AI-ready digital ecosystems.
                            </Typography>
                            <Button variant="contained" size="large" sx={{ py: 2, px: 4, fontWeight: 'bold' }}>
                                Discuss Your Project
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Services Grid */}
            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Our Expertise
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Comprehensive development and strategy for healthcare innovators
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {services.map((service, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Paper sx={{ p: 5, height: '100%', borderRadius: 3, border: 1, borderColor: 'grey.100', '&:hover': { transform: 'translateY(-8px)', boxShadow: 10, borderColor: service.color }, transition: 'all 0.3s' }}>
                                <Box sx={{ color: service.color, mb: 3 }}>
                                    {service.icon}
                                </Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    {service.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                    {service.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Why Us */}
            <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="md">
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                        Why Partner with Arohan Global?
                    </Typography>
                    <Typography variant="body1" align="center" paragraph sx={{ mb: 6, opacity: 0.8 }}>
                        Our consulting arm leverages the same deep-tech expertise that powers our Arohan wearable. We understand the unique challenges of healthcare: compliance, security, and mission-critical reliability.
                    </Typography>
                    <Stack spacing={2}>
                        {[
                            "Dedicated team of full-stack developers and AI researchers",
                            "Specialized knowledge in medical device communication (BT, WiFi, 4G)",
                            "Proven track record in HIPAA/GDPR data security",
                            "Agile development for rapid prototyping and clinical trials"
                        ].map((text, i) => (
                            <Paper key={i} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
                                <Box sx={{ color: 'success.main' }}>✔</Box>
                                <Typography fontWeight="medium">{text}</Typography>
                            </Paper>
                        ))}
                    </Stack>
                </Container>
            </Box>

            {/* CTA */}
            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Have a vision for a health-tech product?
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    Let's collaborate to build something impactful.
                </Typography>
                <Button component={Link} to="/contact" variant="contained" size="large" sx={{ px: 6 }}>
                    Contact Our Consulting Team
                </Button>
            </Container>
        </Box>
    );
}
