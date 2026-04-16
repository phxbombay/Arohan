import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const addToCart = useCartStore((state) => state.addToCart);
    const { user, isAuthenticated } = useAuth();

    // Product data
    const arohanDevice = {
        id: 'arohan-wearable-v1',
        name: t('productsPage.hero.badge') || 'Arohan Smart Wearable',
        price: 1,
        description: t('productsPage.hero.subtitle') || 'AI-powered health monitoring device for elderly care',
        image: '/images/arohan-wearable-hero.png'
    };

    // Add to cart handler
    const handleAddToCart = async () => {
        // Enforce Authentication
        if (!isAuthenticated || !user?.user_id) {
            toast.error(t('notifications.loginRequired') || 'Please login to add items to your cart');
            navigate('/signin', { state: { from: location.pathname } });
            return;
        }

        try {
            await addToCart(arohanDevice, user.user_id);
            toast.success(t('notifications.addedToCart') || 'Arohan device added to cart!');

            // Navigate to cart
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error(t('notifications.cartError') || 'Failed to add to cart. Please try again.');
        }
    };

    const featureIcons = [<HeartIcon />, <SpeedIcon />, <ShieldIcon />, <WatchIcon />];
    const features = (t('productsPage.features', { returnObjects: true }) || []).map((feature, index) => ({
        ...feature,
        icon: featureIcons[index]
    }));

    const specifications = t('productsPage.specs', { returnObjects: true }) || [];

    const testimonials = t('projects.list', { returnObjects: true }) || [];

    const breadcrumbs = [
        { name: t('nav.home'), url: 'https://arohanhealth.com/' },
        { name: t('nav.products'), url: 'https://arohanhealth.com/products' }
    ];

    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'grey.50' }}>
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
                                {t('productsPage.hero.badge')}
                            </Typography>
                            <Typography variant="h2" fontWeight="800" gutterBottom sx={{ lineHeight: 1.1, mb: 2 }}>
                                {t('productsPage.hero.title')}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
                                {t('productsPage.hero.subtitle')}
                                <Box component="span" sx={{ display: 'block', mt: 2, fontSize: '0.9rem', fontStyle: 'italic', color: 'warning.dark' }}>⚠️ {t('productsPage.hero.validation')}</Box>
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mb: 4 }} justifyContent="center">
                                <Chip icon={<CheckIcon />} label={t('productsPage.hero.benefit1')} color="success" sx={{ px: 1, py: 2.5, borderRadius: 2 }} />
                                <Chip icon={<CheckIcon />} label={t('productsPage.hero.benefit2')} color="success" sx={{ px: 1, py: 2.5, borderRadius: 2 }} />
                            </Stack>
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <Button
                                    onClick={handleAddToCart}
                                    data-testid="add-to-cart-btn"
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
                                    {t('productsPage.hero.addToCart')}
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
                                    {t('productsPage.hero.demo')}
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
                    {t('productsPage.featuresTitle')}
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 8 }}>
                    {t('productsPage.featuresSubtitle')}
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
                        <Tab label={t('productsPage.tabs.specs')} />
                        <Tab label={t('productsPage.tabs.app')} />
                        <Tab label={t('productsPage.tabs.dashboard')} />
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
                                    {t('productsPage.app.title')}
                                </Typography>
                                <Typography variant="body1" paragraph color="grey.400" sx={{ mb: 5, fontSize: '1.1rem' }}>
                                    {t('productsPage.app.subtitle')}
                                </Typography>
                                <Grid container spacing={2} justifyContent="center" sx={{ mb: 5, textAlign: 'left' }}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={3}>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">{t('productsPage.app.feat1')}</Typography>
                                            </Box>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">{t('productsPage.app.feat2')}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={3}>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">{t('productsPage.app.feat3')}</Typography>
                                            </Box>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">{t('productsPage.app.feat4')}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Stack direction="row" spacing={3} justifyContent="center">
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => toast.info(t('notifications.appSoon'))}
                                        sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'grey.200' } }}
                                    >
                                        {t('productsPage.app.ios')}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => toast.info(t('notifications.appSoon'))}
                                        sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                                    >
                                        {t('productsPage.app.android')}
                                    </Button>
                                </Stack>
                            </Card>
                        )}
                        {selectedTab === 2 && (
                            <Card sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.800', color: 'white' }} elevation={0}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {t('productsPage.dashboard.title')}
                                </Typography>
                                <Typography variant="h6" color="primary.light" gutterBottom sx={{ mb: 3 }}>
                                    {t('productsPage.dashboard.subtitle')}
                                </Typography>
                                <Typography variant="body1" paragraph color="grey.400" sx={{ mb: 5, fontSize: '1.1rem' }}>
                                    {t('productsPage.dashboard.desc')}
                                </Typography>
                                <Grid container spacing={2} justifyContent="center" sx={{ mb: 5, textAlign: 'left' }}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={3}>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">{t('productsPage.dashboard.feat1')}</Typography>
                                            </Box>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">{t('productsPage.dashboard.feat2')}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={3}>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">{t('productsPage.dashboard.feat3')}</Typography>
                                            </Box>
                                            <Box display="flex" gap={2} alignItems="center">
                                                <CheckIcon color="success" />
                                                <Typography variant="h6">{t('productsPage.dashboard.feat4')}</Typography>
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
                        {t('productsPage.cta.title')}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 5 }}>
                        {t('productsPage.cta.subtitle')}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                        <Button
                            onClick={handleAddToCart}
                            data-testid="add-to-cart-btn-cta"
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.2rem', borderRadius: 8,
                                '&:hover': { bgcolor: 'grey.100', transform: 'translateY(-2px)', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' },
                                transition: 'all 0.3s'
                            }}
                        >
                            {t('productsPage.cta.addToCart')}
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
                            {t('productsPage.cta.demo')}
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
