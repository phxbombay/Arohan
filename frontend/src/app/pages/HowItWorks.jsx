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
import { Helmet } from 'react-helmet-async';
import { StructuredData } from '../components/StructuredData';
import { generateBreadcrumbSchema } from '../../utils/structuredData';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { toast } from 'sonner';

export function HowItWorks() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    const handleOrderDevice = () => {
        if (!isAuthenticated) {
            toast.error('Please login to order device');
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
                toast.success('Quantity updated in cart!');
            } else {
                existingCart.push({ ...product, quantity: 1 });
                toast.success('Arohan device added to cart!');
            }

            localStorage.setItem('arohan-cart', JSON.stringify(existingCart));
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart.');
        }
    };

    const handleDownloadApp = () => {
        toast.info("Mobile App coming soon to Play Store & App Store!");
    };

    const steps = [
        {
            label: 'Plug-in and Pair',
            description: 'Attach the Arohan plugin chip to a compatible watch, ring or wrist band. Pair it once with the mobile app to register the user, caregivers and emergency contacts.',
            icon: <PhoneIcon />
        },
        {
            label: 'Learn Your Baseline',
            description: 'Over the first few days, Arohan\'s AI engine learns the user\'s typical heart-rate and motion patterns. This allows the system to detect meaningful deviations rather than reacting to every minor fluctuation.',
            icon: <HeartIcon />
        },
        {
            label: 'Continuous Monitoring',
            description: 'The device monitors vitals and movement round the clock. It looks for patterns that may indicate a fall, a rapid change in blood pressure or other warning signs of cardiac or neurological events.',
            icon: <AnalyticsIcon />
        },
        {
            label: 'Instant Alerts',
            description: 'When an event is detected, Arohan automatically sends alerts through calls and SMS to registered contacts and, where integrated, partner ambulance or hospital services. Alerts can include time, location and last-known vital trends.',
            icon: <AlertIcon />
        },
        {
            label: 'Guided First Aid',
            description: 'The first responder on the scene opens the Arohan app or uses voice commands. The assistant asks a few basic questions (demographics etc), then provides structured, step-by-step guidance for first aid until professionals arrive. All actions are logged for later medical review. The content is curated by doctors. If there is no content available, the assistant clearly says it doesn\'t know instead of providing incorrect information.',
            icon: <CloudIcon />
        }
    ];

    const specs = [
        { feature: 'Setup Time', value: '5 minutes (one-time)' },
        { feature: 'Detection Accuracy', value: '98% falls, 95% cardiac' },
        { feature: 'Alert Speed', value: '< 10 seconds' },
        { feature: 'Battery Life', value: '72 hours continuous' },
        { feature: 'Sensors', value: 'ECG, Accelerometer, Gyroscope, Temp' },
        { feature: 'Connectivity', value: 'Bluetooth, WiFi, LTE (optional)' },
        { feature: 'Water Resistance', value: 'IP68 (splash/sweat proof)' },
        { feature: 'Weight', value: '28 grams (ultra-light)' }
    ];

    const breadcrumbs = [
        { name: 'Home', url: 'https://arohan-health.com/' },
        { name: 'How It Works', url: 'https://arohan-health.com/how-it-works' }
    ];

    return (
        <Box>
            <Helmet>
                <title>How Arohan Works - AI-Powered Emergency Detection System</title>
                <meta name="description" content="Learn how Arohan's AI-powered wearable detects falls and cardiac emergencies in real-time, sending instant alerts to family and emergency services. Setup in 5 minutes." />
                <meta property="og:title" content="How Arohan Works - Emergency Detection Explained" />
                <meta property="og:description" content="6-step setup process. 98% fall detection accuracy. Instant alerts to family." />
            </Helmet>
            <StructuredData schema={generateBreadcrumbSchema(breadcrumbs)} />

            {/* Hero */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight="800" gutterBottom sx={{ letterSpacing: -1 }}>
                        How Arohan Works
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, mb: 2, fontWeight: 500 }}>
                        From setup to life-saving alerts in 5 simple steps
                    </Typography>
                    <Chip
                        label="⚠️ PRODUCT DEVELOPMENT IS STILL UNDERWAY"
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
                        <Chip label="5-Minute Setup" sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', fontSize: '1rem', py: 2 }} />
                        <Chip label="No Training Required" sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', fontSize: '1rem', py: 2 }} />
                    </Stack>
                </Container>
            </Box>

            {/* User Journey Stepper */}
            <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography variant="h3" fontWeight="800" align="center" gutterBottom>
                    Your Journey to 24/7 Protection
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 8 }}>
                    Follow these 5 steps to activate round-the-clock emergency monitoring
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
                        Technical Specifications
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
                    AI Detection Technology
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
                                Fall Detection (98% Accuracy)
                            </Typography>
                            <Typography variant="body1" paragraph fontSize={18} sx={{ mb: 3 }}>
                                <strong>How it works:</strong> AI analyzes accelerometer and gyroscope data 100 times per second,
                                detecting sudden acceleration changes, impact force, and post-fall stillness.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, display: 'inline-block' }}>
                                <strong>False Positive Rate:</strong> Less than 5%
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
                                Cardiac Anomaly Detection
                            </Typography>
                            <Typography variant="body1" paragraph fontSize={18} sx={{ mb: 3 }}>
                                <strong>How it works:</strong> Continuous ECG monitoring detects arrhythmia, tachycardia (fast heart rate),
                                bradycardia (slow heart rate), and irregular patterns.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, display: 'inline-block' }}>
                                <strong>Sensitivity:</strong> 95% Clinical Grade
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* CTA */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 8, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight="800" gutterBottom>
                        Ready to Get Started?
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 5 }}>
                        Setup takes 5 minutes. Protection lasts a lifetime.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                        <Button
                            onClick={handleOrderDevice}
                            variant="contained"
                            size="large"
                            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' }, fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.2rem', borderRadius: 8 }}
                        >
                            Order Device
                        </Button>
                        <Button
                            onClick={handleDownloadApp}
                            variant="outlined"
                            size="large"
                            sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' }, fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.2rem', borderRadius: 8 }}
                        >
                            Download App (Free)
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
