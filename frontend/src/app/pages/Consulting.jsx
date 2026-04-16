import { Box, Container, Typography, Grid, Paper, Button, Stack } from '@mui/material';
import { Computer as ComputerIcon, PhoneIphone as PhoneIcon, BarChart as ChartIcon, Security as SecurityIcon } from '@mui/icons-material';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Consulting() {
    const { t } = useTranslation();

    const rawServices = t('consulting.services', { returnObjects: true }) || [];
    const serviceIcons = [
        { icon: <ComputerIcon sx={{ fontSize: 48 }} />, color: 'primary.main' },
        { icon: <PhoneIcon sx={{ fontSize: 48 }} />, color: 'secondary.main' },
        { icon: <ChartIcon sx={{ fontSize: 48 }} />, color: 'success.main' },
        { icon: <SecurityIcon sx={{ fontSize: 48 }} />, color: 'warning.main' }
    ];

    const services = rawServices.map((s, i) => ({
        ...s,
        ...(serviceIcons[i] || serviceIcons[0])
    }));

    return (
        <Box>
            <SEO 
                title={t('consulting.title') + " — Arohan Health"}
                description={t('consulting.subtitle')}
                keywords="healthcare consulting, website development, app development, medical device integration, health tech Bengaluru"
            />

            {/* Hero Section */}
            <Box sx={{ bgcolor: 'grey.900', color: 'white', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: 2 }}>
                                {t('consulting.heroOverline')}
                            </Typography>
                            <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                                {t('consulting.heroTitle')}
                            </Typography>
                            <Typography variant="h5" sx={{ opacity: 0.8, mb: 4, lineHeight: 1.6 }}>
                                {t('consulting.heroSubtitle')}
                            </Typography>
                            <Button variant="contained" size="large" sx={{ py: 2, px: 4, fontWeight: 'bold' }}>
                                {t('consulting.heroButton')}
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Services Grid */}
            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        {t('consulting.servicesTitle')}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {t('consulting.servicesSubtitle')}
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
                        {t('consulting.whyUsTitle')}
                    </Typography>
                    <Typography variant="body1" align="center" paragraph sx={{ mb: 6, opacity: 0.8 }}>
                        {t('consulting.whyUsSubtitle')}
                    </Typography>
                    <Stack spacing={2}>
                        {(t('consulting.whyUsPoints', { returnObjects: true }) || []).map((text, i) => (
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
                    {t('consulting.ctaTitle')}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    {t('consulting.ctaSubtitle')}
                </Typography>
                <Button component={Link} to="/contact" variant="contained" size="large" sx={{ px: 6 }}>
                    {t('consulting.ctaButton')}
                </Button>
            </Container>
        </Box>
    );
}
