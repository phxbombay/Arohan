import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import { CheckCircle as CheckIcon, ExpandMore as ExpandMoreIcon, Star as StarIcon } from '@mui/icons-material';
import { trackButtonClick } from '../../utils/eventTracking';
import SEO from '../components/SEO';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../context/cartStore'; // Uncommented
import { toast } from 'sonner';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function Pricing() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();
    const addToCart = useCartStore((state) => state.addToCart);
    const { t } = useTranslation();

    const handlePlanClick = (planName) => {
        if (planName === 'Basic' || planName === 'बेसिक (Basic)' || planName === 'ಮೂಲ (Basic)') {
            toast.info(t('pricing.comingSoon'));
        } else if (planName === 'Premium' || planName === 'प्रीमियम (Premium)' || planName === 'ಪ್ರೀಮಿಯಂ (Premium)') {
            navigate('/signin', { state: { from: location.pathname } });
        } else if (planName === 'VIP') {
            navigate('/contact');
        }
    };

    const handleAddAnnualDeal = async () => {
        if (!isAuthenticated || !user?.user_id) {
            toast.error(t('pricing.loginErr'));
            navigate('/signin', { state: { from: location.pathname } });
            return;
        }

        const annualBundle = {
            id: 'arohan-annual-bundle',
            name: 'Arohan Annual Bundle',
            price: 5000, // Assuming a price for the bundle
            description: 'Arohan Smart Wearable + 12 Months Premium Subscription',
            image: '/images/arohan-wearable-hero.png'
        };

        try {
            await addToCart(annualBundle, user.user_id);
            toast.success('Annual Bundle added to cart!');
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart.');
        }
    };

    const consumerPlansInput = t('pricing.consumerPlans', { returnObjects: true }) || [];
    const consumerPlans = Array.isArray(consumerPlansInput) ? consumerPlansInput.map((p, i) => ({ ...p, popular: i === 1 })) : [];

    const b2bPlansInput = t('pricing.b2bPlans', { returnObjects: true });
    const b2bPlans = Array.isArray(b2bPlansInput) ? b2bPlansInput : [];
    
    const faqsInput = t('pricing.faqs', { returnObjects: true });
    const faqs = Array.isArray(faqsInput) ? faqsInput : [];

    return (
        <Box>
            <SEO
                title="Pricing Plans - Affordable Elderly Care Monitoring"
                description="Transparent pricing for Arohan's AI health monitoring. Basic app FREE. Premium features available. No hidden fees. 30-day money-back guarantee."
                keywords="health monitoring pricing, elderly care cost, affordable health device, subscription plans, health monitoring plans"
                canonical="https://arohanhealth.com/pricing"
                type="website"
                image="https://arohanhealth.com/images/pricing-plans.jpg"
            />
            {/* Hero */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight="800" gutterBottom sx={{ letterSpacing: -1 }}>
                        {t('pricing.title')}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                        {t('pricing.subtitle')}
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 500 }}>
                        {t('pricing.guarantee')}
                    </Typography>
                </Container>
            </Box>

            {/* Consumer Plans */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography variant="h3" fontWeight="800" align="center" gutterBottom>
                    {t('pricing.consumerHeading')}
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 8 }}>
                    {t('pricing.consumerSub')}
                </Typography>
                <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                    {consumerPlans.map((plan, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    border: plan.popular ? '3px solid' : '1px solid',
                                    borderColor: plan.popular ? 'primary.main' : 'grey.200',
                                    transform: plan.popular ? 'scale(1.05)' : 'none',
                                    boxShadow: plan.popular ? 20 : 1,
                                    zIndex: plan.popular ? 2 : 1,
                                    transition: 'all 0.3s',
                                    borderRadius: 4,
                                    '&:hover': { transform: plan.popular ? 'scale(1.08)' : 'translateY(-10px)', boxShadow: 20, zIndex: 3 }
                                }}
                            >
                                {plan.popular && (
                                    <Chip
                                        label={t('pricing.mostPopular')}
                                        color="primary"
                                        icon={<StarIcon />}
                                        sx={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', fontSize: '1rem', height: 32 }}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1, p: 4, textAlign: 'center' }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                        {plan.name}
                                    </Typography>
                                    <Typography variant="h2" fontWeight="800" color="primary" gutterBottom sx={{ mb: 1 }}>
                                        {plan.price}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                                        {plan.period}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, fontStyle: 'italic' }}>
                                        {plan.description}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <List dense sx={{ textAlign: 'left', mx: 'auto', maxWidth: 260 }}>
                                        {plan.features.map((feature, i) => (
                                            <ListItem key={i} disablePadding sx={{ mb: 1.5 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <CheckIcon color="success" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary={feature} primaryTypographyProps={{ variant: 'body2', fontSize: '0.95rem' }} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                                <Box sx={{ p: 4, pt: 0 }}>
                                    <Button
                                        variant={plan.popular ? 'contained' : 'outlined'}
                                        fullWidth
                                        size="large"
                                        onClick={() => {
                                            trackButtonClick(`Select Plan: ${plan.name}`, 'Pricing Page')();
                                            handlePlanClick(plan.name);
                                        }}
                                        sx={{ py: 1.5, fontSize: '1.1rem', borderRadius: 2, fontWeight: 'bold' }}
                                    >
                                        {plan.cta}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Annual Bundle Savings */}
                <Card sx={{ mt: 8, p: 6, bgcolor: 'success.50', border: '2px solid', borderColor: 'success.main', maxWidth: 900, mx: 'auto', borderRadius: 4, boxShadow: 3 }}>
                    <Grid container spacing={4} alignItems="center" justifyContent="center">
                        <Grid item xs={12} md={8} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant="h4" fontWeight="800" gutterBottom color="success.main">
                                {t('pricing.annualTitle')}
                            </Typography>
                            <Typography variant="h6" fontWeight="normal">
                                {t('pricing.annualDesc')} <strong>{t('pricing.annualDealStr')}</strong>.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <Button
                                onClick={handleAddAnnualDeal}
                                data-testid="annual-deal-btn"
                                variant="contained"
                                color="success"
                                size="large"
                                fullWidth
                                sx={{ py: 2, fontSize: '1.2rem', fontWeight: 'bold', borderRadius: 2, boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)' }}
                            >
                                {t('pricing.getAnnualDeal')}
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Container>

            {/* B2B Plans */}
            <Box sx={{ bgcolor: 'grey.900', color: 'white', py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight="800" align="center" gutterBottom color="white">
                        {t('pricing.b2bHeading')}
                    </Typography>
                    <Typography variant="h6" color="grey.400" align="center" sx={{ mb: 8 }}>
                        {t('pricing.b2bSub')}
                    </Typography>
                    <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                        {b2bPlans.map((plan, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card sx={{ height: '100%', p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', bgcolor: 'grey.800', color: 'white', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)', bgcolor: 'grey.700' }, borderRadius: 4 }}>
                                    <CardContent sx={{ flexGrow: 1, p: 0 }}>
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                                            {plan.name}
                                        </Typography>
                                        <Typography variant="h4" color="primary.light" gutterBottom sx={{ mb: 2 }}>
                                            {plan.price}
                                        </Typography>
                                        <Typography variant="body2" color="grey.400" paragraph sx={{ mb: 3 }}>
                                            {plan.description}
                                        </Typography>
                                        <List dense sx={{ textAlign: 'left', mt: 2, mx: 'auto', maxWidth: 280 }}>
                                            {plan.features.map((feature, i) => (
                                                <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                                        <CheckIcon color="primary" fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={feature} primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                    <Button
                                        component={Link}
                                        to="/contact"
                                        variant="outlined"
                                        fullWidth
                                        sx={{ mt: 4, borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                                    >
                                        {t('pricing.requestQuote')}
                                    </Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* FAQ */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography variant="h3" fontWeight="800" align="center" gutterBottom>
                    {t('pricing.faqHeading')}
                </Typography>
                <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6 }}>
                    {faqs.map((faq, index) => (
                        <Accordion key={index} elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', mb: 2, borderRadius: '8px !important', '&:before': { display: 'none' }, bgcolor: 'grey.50' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontWeight="bold" fontSize="1.1rem">{faq.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography color="text.secondary">{faq.answer}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Container>

            {/* CTA */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 8, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight="800" gutterBottom>
                        {t('pricing.ctaTitle')}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 5 }}>
                        {t('pricing.ctaSub')}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                        <Button
                            component={Link}
                            to="/contact"
                            variant="contained"
                            size="large"
                            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' }, fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.1rem', borderRadius: 8 }}
                        >
                            {t('pricing.scheduleCall')}
                        </Button>
                        <Button
                            href="mailto:sales@arohanhealth.com"
                            variant="outlined"
                            size="large"
                            sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' }, fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.1rem', borderRadius: 8 }}
                        >
                            {t('pricing.emailSales')}
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
