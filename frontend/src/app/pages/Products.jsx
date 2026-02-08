import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useCartStore } from '../../context/cartStore';
import {
    Box,
    Container,
    Grid,
    Typography,
    Tab,
    Tabs,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Rating,
    Avatar
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Favorite as HeartIcon,
    Speed as SpeedIcon,
    Security as ShieldIcon,
    WatchLater as WatchIcon
} from '@mui/icons-material';
import { StructuredData } from '../components/StructuredData';
import { generateProductSchema, generateBreadcrumbSchema } from '../../utils/structuredData';
import SEO from '../components/SEO';

import { useAuth } from '../../features/auth/hooks/useAuth';

export function Products() {
    const [selectedTab, setSelectedTab] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const addToCart = useCartStore((state) => state.addToCart);
    const { isAuthenticated } = useAuth();

    // Product data
    const arohanDevice = {
        id: 'arohan-wearable-v1',
        name: 'Arohan Smart Wearable',
        price: 1,
        description: 'AI-powered health monitoring device for elderly care',
        image: '/images/arohan-wearable-hero.png'
    };

    // Add to cart handler
    const handleAddToCart = async () => {
        // Enforce Authentication
        if (!isAuthenticated) {
            toast.error('Please login to add items to your cart');
            navigate('/signin', { state: { from: location.pathname } });
            return;
        }

        try {
            // Get current cart from localStorage
            const existingCart = JSON.parse(localStorage.getItem('arohan-cart') || '[]');

            // Check if product already in cart
            const existingItemIndex = existingCart.findIndex(item => item.id === arohanDevice.id);

            if (existingItemIndex >= 0) {
                // Increment quantity
                existingCart[existingItemIndex].quantity += 1;
                toast.success('Quantity updated in cart!');
            } else {
                // Add new item
                existingCart.push({ ...arohanDevice, quantity: 1 });
                toast.success('Arohan device added to cart!');
            }

            // Save to localStorage
            localStorage.setItem('arohan-cart', JSON.stringify(existingCart));

            // Navigate to cart
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart. Please try again.');
        }
    };

    const features = [
        { icon: <HeartIcon />, title: 'Real-Time Heart Monitoring', desc: '24/7 ECG-accurate heart rate tracking' },
        { icon: <SpeedIcon />, title: 'Instant Fall Detection', desc: '98% accuracy using AI-powered accelerometer' },
        { icon: <ShieldIcon />, title: 'Emergency Alerts', desc: 'Auto-notify family, doctors, ambulances' },
        { icon: <WatchIcon />, title: '72-Hour Battery Life', desc: 'Low-power design with wireless charging' }
    ];

    const specifications = [
        { label: 'Setup Time', value: 'will be updated soon' },
        { label: 'Detection Accuracy', value: 'will be updated soon' },
        { label: 'Response Time', value: 'will be updated soon' },
        { label: 'Battery Life', value: 'will be updated soon' },
        { label: 'Sensors', value: 'will be updated soon' },
        { label: 'Connectivity', value: 'will be updated soon' },
        { label: 'Water Resistance', value: 'will be updated soon' },
        { label: 'Weight', value: 'will be updated soon' },
        { label: 'Compatibility', value: 'iOS & Android' }
    ];

    const testimonials = [
        {
            name: 'Prakash R.',
            role: 'Family Caregiver',
            rating: 5,
            comment: 'Arohan gives us peace of mind knowing we\'ll be notified if dad ever needs help.',
            avatar: ''
        },
        {
            name: 'S. Mehta',
            role: 'Healthcare Professional',
            rating: 5,
            comment: 'The focus on emergency response time and family notification is exactly what\'s needed for elderly care.',
            avatar: ''
        }
    ];

    const breadcrumbs = [
        { name: 'Home', url: 'https://arohan-health.com/' },
        { name: 'Products', url: 'https://arohan-health.com/products' }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            <StructuredData schema={generateProductSchema()} />
            <StructuredData schema={generateBreadcrumbSchema(breadcrumbs)} />
            <SEO
                title="Products - Smart Wearable Health Monitoring Device"
                description="Arohan Smart Wearable: AI-powered health monitoring device for elderly care. Real-time vitals tracking, fall detection, emergency alerts, and 24/7 family connectivity. Pre-order now."
                keywords="health monitoring device, wearable health tracker, elderly care device, fall detection, heart rate monitor, emergency alert system, smart health wearable"
                canonical="https://arohanhealth.com/products"
                type="product"
                image="https://arohanhealth.com/images/arohan-wearable-hero.png"
            />

            {/* Hero Section */}
            <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center" justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="overline" color="primary" fontWeight="bold" sx={{ letterSpacing: 2 }}>
                                Arohan Wearable Device
                            </Typography>
                            <Typography variant="h2" fontWeight="800" gutterBottom sx={{ lineHeight: 1.1, mb: 2 }}>
                                Your 24/7 Guardian Angel
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
                                AI-powered wearable that detects falls & cardiac emergencies instantly,
                                alerting family and emergency services within seconds.
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mb: 4 }} justifyContent="center">
                                <Chip icon={<CheckIcon />} label="High Fall Detection Sensitivity" color="success" sx={{ px: 1, py: 2.5, borderRadius: 2 }} />
                                <Chip icon={<CheckIcon />} label="Real-time Cardiac Monitoring" color="success" sx={{ px: 1, py: 2.5, borderRadius: 2 }} />
                            </Stack>
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <Button
                                    onClick={handleAddToCart}
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        py: 1.5, px: 4,
                                        fontSize: '1.1rem',
                                        borderRadius: 8,
                                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                                        transition: 'all 0.3s',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(37, 99, 235, 0.6)' }
                                    }}
                                >
                                    Add to Cart
                                </Button>
                                <Button
                                    component={Link}
                                    to="/contact"
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        py: 1.5, px: 4,
                                        fontSize: '1.1rem',
                                        borderRadius: 8,
                                        transition: 'all 0.3s',
                                        '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.05)', borderColor: 'primary.dark' }
                                    }}
                                >
                                    Request Demo
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src="/images/arohan-wearable-hero.png"
                                alt="Arohan Wearable Device"
                                sx={{ width: '100%', maxWidth: 450, borderRadius: 8, boxShadow: 12, mx: 'auto', display: 'block', transform: 'rotate(-2deg)' }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography variant="h3" fontWeight="800" align="center" gutterBottom>
                    Key Features
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 8 }}>
                    Engineered for reliability, designed for comfort
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ textAlign: 'center', p: 3, height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: 10 }, borderRadius: 4 }}>
                                <Box sx={{ color: 'primary.main', mb: 2, bgcolor: 'primary.50', display: 'inline-flex', p: 2, borderRadius: '50%', '& svg': { fontSize: 40 } }}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.desc}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Tabs: Specifications, App, Dashboard */}
            <Box sx={{ bgcolor: 'grey.900', color: 'white', py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} centered sx={{ mb: 6, '& .MuiTab-root': { color: 'grey.500', fontSize: '1rem', fontWeight: 'bold' }, '& .Mui-selected': { color: 'white !important' } }}>
                        <Tab label="Device Specifications" />
                        <Tab label="Mobile App" />
                        <Tab label="Web Dashboard" />
                    </Tabs>

                    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                        {selectedTab === 0 && (
                            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, bgcolor: 'grey.800', color: 'white' }}>
                                <Box sx={{ p: 4, pb: 2, textAlign: 'center' }}>
                                    <Box
                                        component="img"
                                        src="/images/arohan-wearable-collage.png"
                                        alt="Arohan Device Variants"
                                        sx={{ width: '100%', maxWidth: 600, borderRadius: 4, mb: 4, boxShadow: 3 }}
                                    />
                                </Box>
                                <Table>
                                    <TableBody>
                                        {specifications.map((spec, index) => (
                                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '40%', color: 'grey.400', borderBottom: '1px solid #444', pl: 4 }}>
                                                    {spec.label}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid #444', fontSize: '1.1rem' }}>{spec.value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        {selectedTab === 1 && (
                            <Card sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.800', color: 'white' }} elevation={0}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    Arohan Mobile App
                                </Typography>
                                <Typography variant="body1" paragraph color="grey.400" sx={{ mb: 5, fontSize: '1.1rem' }}>
                                    Free iOS & Android app for real-time health monitoring, emergency alerts, and family sharing.
                                </Typography>
                                <Grid container spacing={2} justifyContent="center" sx={{ mb: 5, textAlign: 'left' }}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={3}>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">Live health dashboard</Typography>
                                            </Box>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">One-tap emergency SOS</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={3}>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">Family member access</Typography>
                                            </Box>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">Apple Health & Google Fit</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Stack direction="row" spacing={3} justifyContent="center">
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => toast.info("iOS App arriving on App Store next month!")}
                                        sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'grey.200' } }}
                                    >
                                        Download iOS App
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => toast.info("Android App arriving on Play Store next month!")}
                                        sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                                    >
                                        Download Android App
                                    </Button>
                                </Stack>
                            </Card>
                        )}
                        {selectedTab === 2 && (
                            <Card sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.800', color: 'white' }} elevation={0}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    Web Dashboard
                                </Typography>
                                <Typography variant="h6" color="primary.light" gutterBottom sx={{ mb: 3 }}>
                                    Caregiver & Provider Access
                                </Typography>
                                <Typography variant="body1" paragraph color="grey.400" sx={{ mb: 5, fontSize: '1.1rem' }}>
                                    Browser-based dashboard for healthcare professionals and family caregivers to monitor patients remotely.
                                </Typography>
                                <Grid container spacing={2} justifyContent="center" sx={{ mb: 5, textAlign: 'left' }}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={3}>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">Multi-patient monitoring</Typography>
                                            </Box>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">Historical trends & analytics</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={3}>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">Export PDF reports</Typography>
                                            </Box>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">EHR integration (FHIR)</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Card>
                        )}
                    </Box>
                </Container>
            </Box>



            {/* CTA */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 8, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight="800" gutterBottom>
                        Ready to Protect Your Loved Ones?
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 5 }}>
                        Join families worldwide using Arohan for peace of mind
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                        <Button
                            onClick={handleAddToCart}
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.2rem', borderRadius: 8,
                                '&:hover': { bgcolor: 'grey.100', transform: 'translateY(-2px)', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' },
                                transition: 'all 0.3s'
                            }}
                        >
                            Add to Cart
                        </Button>
                        <Button
                            component={Link}
                            to="/contact"
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: 'white', color: 'white', fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.2rem', borderRadius: 8,
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' }
                            }}
                        >
                            Request Corporate Demo
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
