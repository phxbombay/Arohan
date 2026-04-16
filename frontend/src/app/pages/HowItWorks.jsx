import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper
} from '@mui/material';
import {
    PhoneAndroid as PhoneIcon,
    Bluetooth as BluetoothIcon,
    Favorite as HeartIcon,
    NotificationsActive as AlertIcon,
    Assessment as AnalyticsIcon,
    CloudDone as CloudIcon
} from '@mui/icons-material';
import { StructuredData } from '../components/StructuredData';
import { generateBreadcrumbSchema } from '../../utils/structuredData';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { toast } from 'sonner';

export function HowItWorks() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    const handleOrderDevice = () => {
        if (!isAuthenticated) {
            toast.error(t('notifications.loginRequired') || 'Please login to order device');
            navigate('/signin', { state: { from: location.pathname } });
            return;
        }

        const product = {
            id: 'arohan-wearable-v1',
            name: 'Arohan Smart Wearable',
            price: 1,
            description: 'AI-powered health monitoring device for elderly care',
            image: '/images/arohan-wearable-hero.png'
        };

        try {
            const existingCart = JSON.parse(localStorage.getItem('arohan-cart') || '[]');
            const existingItemIndex = existingCart.findIndex(item => item.id === product.id);

            if (existingItemIndex >= 0) {
                existingCart[existingItemIndex].quantity += 1;
                toast.success(t('notifications.cartUpdated') || 'Quantity updated in cart!');
            } else {
                existingCart.push({ ...product, quantity: 1 });
                toast.success(t('notifications.addedToCart') || 'Arohan device added to cart!');
            }

            localStorage.setItem('arohan-cart', JSON.stringify(existingCart));
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error(t('notifications.cartError') || 'Failed to add to cart.');
        }
    };

    const handleDownloadApp = () => {
        toast.info(t('notifications.appSoon') || "Mobile App coming soon to Play Store & App Store!");
    };

    const stepIcons = [<PhoneIcon />, <HeartIcon />, <AnalyticsIcon />, <AlertIcon />, <CloudIcon />];
    const steps = (t('howItWorksPage.steps', { returnObjects: true }) || []).map((step, index) => ({
        ...step,
        description: step.desc,
        icon: stepIcons[index]
    }));

    const specs = t('howItWorksPage.specs', { returnObjects: true }) || [];

    const breadcrumbs = [
        { name: t('nav.home'), url: 'https://arohanhealth.com/' },
        { name: t('nav.howItWorks'), url: 'https://arohanhealth.com/how-it-works' }
    ];

    return (
        <Box>
            <SEO
                title={t('howItWorksPage.title')}
                description={t('howItWorksPage.subtitle')}
                keywords="how Arohan works, AI fall detection, emergency wearable setup, cardiac monitoring India"
                canonical="https://arohanhealth.com/how-it-works"
            />
            <StructuredData schema={generateBreadcrumbSchema(breadcrumbs)} />

            {/* Hero */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight="800" gutterBottom sx={{ letterSpacing: -1 }}>
                        {t('howItWorksPage.title')}
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, mb: 2, fontWeight: 500 }}>
                        {t('howItWorksPage.subtitle')}
                    </Typography>
                    <Chip
                        label={t('howItWorksPage.developmentNote')}
                        sx={{
                            bgcolor: 'warning.main',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            py: 2.5,
                            mb: 3
                        }}
                    />
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Chip label={t('howItWorksPage.quickSetup')} sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', fontSize: '1rem', py: 2 }} />
                        <Chip label={t('howItWorksPage.noTraining')} sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', fontSize: '1rem', py: 2 }} />
                    </Stack>
                </Container>
            </Box>

            {/* User Journey Stepper */}
            <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography variant="h3" fontWeight="800" align="center" gutterBottom>
                    {t('howItWorksPage.journeyTitle')}
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 8 }}>
                    {t('howItWorksPage.journeyDesc')}
                </Typography>

                <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                    <Stepper orientation="vertical">
                        {steps.map((step, index) => (
                            <Step key={index} active={true} completed={false}>
                                <StepLabel
                                    StepIconComponent={() => (
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: 4,
                                                zIndex: 1
                                            }}
                                        >
                                            {step.icon}
                                        </Box>
                                    )}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{ ml: 2, fontSize: '1.25rem' }}>
                                        {step.label}
                                    </Typography>
                                </StepLabel>
                                <StepContent sx={{ borderLeft: '3px solid #e0e0e0', ml: 3.5, pl: 4, pb: 4 }}>
                                    <Typography color="text.secondary" variant="body1" fontSize={18} sx={{ lineHeight: 1.7 }}>
                                        {step.description}
                                    </Typography>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Container>

            {/* Device Specifications */}
            <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight="800" align="center" gutterBottom>
                        {t('productsPage.tabs.specs')}
                    </Typography>
                    <TableContainer component={Paper} elevation={0} sx={{ maxWidth: 800, mx: 'auto', mt: 6, borderRadius: 4, boxShadow: 3, border: '1px solid', borderColor: 'grey.200' }}>
                        <Table>
                            <TableBody>
                                {specs.map((spec, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '40%', color: 'text.secondary', bgcolor: 'grey.50', pl: 4, fontSize: '1rem' }}>
                                            {spec.feature}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem', pl: 4 }}>{spec.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>

            {/* How Detection Works */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography variant="h3" fontWeight="800" align="center" gutterBottom>
                    {t('howItWorksPage.techTitle')}
                </Typography>
                <Grid container spacing={4} sx={{ mt: 4 }} justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 5, height: '100%', textAlign: 'center', borderRadius: 4, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: '50%', color: 'primary.main' }}>
                                    <AnalyticsIcon sx={{ fontSize: 48 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                                {t('howItWorksPage.fallTitle')}
                            </Typography>
                            <Typography variant="body1" paragraph fontSize={18} sx={{ mb: 3 }}>
                                {t('howItWorksPage.fallDesc')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, display: 'inline-block' }}>
                                {t('howItWorksPage.fallFalseRate')}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 5, height: '100%', textAlign: 'center', borderRadius: 4, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Box sx={{ p: 2, bgcolor: 'error.50', borderRadius: '50%', color: 'error.main' }}>
                                    <HeartIcon sx={{ fontSize: 48 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom color="error">
                                {t('howItWorksPage.cardiacTitle')}
                            </Typography>
                            <Typography variant="body1" paragraph fontSize={18} sx={{ mb: 3 }}>
                                {t('howItWorksPage.cardiacDesc')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, display: 'inline-block' }}>
                                {t('howItWorksPage.cardiacSensitivity')}
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* CTA */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 8, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight="800" gutterBottom>
                        {t('howItWorksPage.ctaTitle')}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 5 }}>
                        {t('howItWorksPage.ctaDesc')}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                        <Button
                            onClick={handleOrderDevice}
                            variant="contained"
                            size="large"
                            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' }, fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.2rem', borderRadius: 8 }}
                        >
                            {t('howItWorksPage.orderDevice')}
                        </Button>
                        <Button
                            onClick={handleDownloadApp}
                            variant="outlined"
                            size="large"
                            sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' }, fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.2rem', borderRadius: 8 }}
                        >
                            {t('howItWorksPage.downloadApp')}
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
