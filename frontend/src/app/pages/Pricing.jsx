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
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { useCartStore } from '../../context/cartStore'; // Removed
import { toast } from 'sonner';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function Pricing() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    // const addToCart = useCartStore((state) => state.addToCart);

    const handlePlanClick = (planName) => {
        if (planName === 'Basic') {
            toast.info("Mobile App coming soon to Play Store & App Store!");
        } else if (planName === 'Premium') {
            navigate('/signin', { state: { from: location.pathname } });
        } else if (planName === 'VIP') {
            navigate('/contact');
        }
    };

    const handleAddAnnualDeal = () => {
        if (!isAuthenticated) {
            toast.error('Please login to add this deal to your cart');
            navigate('/signin', { state: { from: location.pathname } });
            return;
        }

        const annualBundle = {
            id: 'arohan-annual-bundle-v1',
            name: 'Arohan Annual Bundle (Device + 12mo Premium)',
            price: 0,
            description: 'Arohan Device + 1 Year Premium Subscription',
            image: '/images/arohan-wearable-hero.png'
        };

        try {
            const existingCart = JSON.parse(localStorage.getItem('arohan-cart') || '[]');
            const existingItemIndex = existingCart.findIndex(item => item.id === annualBundle.id);

            if (existingItemIndex >= 0) {
                existingCart[existingItemIndex].quantity += 1;
                toast.success('Quantity updated in cart!');
            } else {
                existingCart.push({ ...annualBundle, quantity: 1 });
                toast.success('Annual Bundle added to cart!');
            }

            localStorage.setItem('arohan-cart', JSON.stringify(existingCart));
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart.');
        }
    };

    const consumerPlans = [
        {
            name: 'Basic',
            price: 'Free',
            period: 'Forever',
            description: 'Essential features for individual elderly users',
            features: [
                'Fall detection alerts',
                'Basic heart rate monitoring',
                'Emergency SOS button',
                '1 emergency contact',
                'Mobile app access',
                'Email support'
            ],
            cta: 'Download Free App',
            popular: false
        },
        {
            name: 'Premium',
            price: 'Subscription',
            description: 'Advanced AI features for complete peace of mind',
            features: [
                'Everything in Basic',
                'Cardiac anomaly detection (AI)',
                'Personalized health insights',
                '5 emergency contacts',
                'Family member dashboard access',
                '7-day health history',
                'Priority 24/7 support',
                'API access for EHR integration'
            ],
            cta: 'Start Free Trial',
            popular: false
        }
    ];

    const b2bPlans = [
        {
            name: 'Hospital/Clinic',
            price: 'Custom',
            description: 'For healthcare providers monitoring patients',
            features: [
                '10-500 device licenses',
                'Multi-patient dashboard',
                'EHR integration (HL7/FHIR)',
                'Bulk device management',
                'Dedicated support team',
                'Volume discount: 10% (10+), 20% (50+)'
            ]
        },
        {
            name: 'Corporate Wellness',
            price: 'Custom',
            description: 'Employee health programs for companies',
            features: [
                'Scalable for large teams',
                'HR wellness dashboard',
                'Aggregate analytics (anonymized)',
                'ROI tracking & reporting',
                'Annual health screening integration',
                'Volume discount: Up to 30%'
            ]
        },
        {
            name: 'Insurance Partnership',
            price: 'Revenue Share',
            description: 'Risk pooling for health insurers',
            features: [
                'Unlimited member access',
                'Predictive risk scoring',
                'Claims reduction analytics',
                'White-label app option',
                'API for premium adjustments',
                'Custom contract terms'
            ]
        }
    ];

    const faqs = [
        {
            question: 'What\'s included in the ₹1 device price?',
            answer: 'The one-time payment covers the Arohan wearable device, wireless charging cable, user manual, and 1-year manufacturer warranty. The Basic app is free forever; Premium features come with a subscription.'
        },
        {
            question: 'Can I return the device if it doesn\'t work for me?',
            answer: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied, return the device in original condition for a full refund (shipping excluded).'
        },
        {
            question: 'Do I need a smartphone to use Arohan?',
            answer: 'Yes, a smartphone (iOS 15+ or Android 10+) is required for initial setup and to receive alerts. However, emergency contacts can be notified via SMS even if your phone is off.'
        },
        {
            question: 'Are there any hidden charges?',
            answer: 'No hidden fees! Device (one-time), Basic app (free), Premium (optional subscription). No activation fees, no cancellation fees.'
        },
        {
            question: 'What\'s the difference between Premium and Annual?',
            answer: 'Premium unlocks AI features, 5 contacts, and 7-day history. Annual adds unlimited contacts, 365-day history, quarterly reports, and a dedicated account manager for white-glove service.'
        },
        {
            question: 'Do you offer discounts for bulk orders?',
            answer: 'Yes! 10-49 units: 10% off, 50-99 units: 20% off, 100+ units: 30% off. Contact sales@arohanhealth.com for B2B quotes.'
        }
    ];

    return (
        <Box>
            <Helmet>
                <title>Pricing Plans - Arohan Health | Affordable Elderly Care Monitoring</title>
                <meta name="description" content="Transparent pricing for Arohan's AI health monitoring. Basic app FREE. Premium features available. No hidden fees." />
                <link rel="canonical" href="https://arohanhealth.com/pricing" />
            </Helmet>
            {/* Hero */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight="800" gutterBottom sx={{ letterSpacing: -1 }}>
                        Simple, Transparent Pricing
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 500 }}>
                        No hidden fees. Cancel anytime. 30-day money-back guarantee.
                    </Typography>
                </Container>
            </Box>

            {/* Consumer Plans */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography variant="h3" fontWeight="800" align="center" gutterBottom>
                    For Individuals & Families
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 8 }}>
                    Choose the plan that fits your needs
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
                                        label="MOST POPULAR"
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
                                Annual Bundle: Save 25%
                            </Typography>
                            <Typography variant="h6" fontWeight="normal">
                                Buy device + 12 months Premium for a <strong>Annual Deal</strong>.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <Button
                                onClick={handleAddAnnualDeal}
                                variant="contained"
                                color="success"
                                size="large"
                                fullWidth
                                sx={{ py: 2, fontSize: '1.2rem', fontWeight: 'bold', borderRadius: 2, boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)' }}
                            >
                                Get Annual Deal
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Container>

            {/* B2B Plans */}
            <Box sx={{ bgcolor: 'grey.900', color: 'white', py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight="800" align="center" gutterBottom color="white">
                        For Businesses & Organizations
                    </Typography>
                    <Typography variant="h6" color="grey.400" align="center" sx={{ mb: 8 }}>
                        Volume discounts, custom integrations, dedicated support
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
                                        Request Quote
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
                    Pricing FAQ
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
                        Still Have Questions?
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 5 }}>
                        Talk to our sales team for personalized pricing
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                        <Button
                            component={Link}
                            to="/contact"
                            variant="contained"
                            size="large"
                            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' }, fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.1rem', borderRadius: 8 }}
                        >
                            Schedule Call
                        </Button>
                        <Button
                            href="mailto:sales@arohanhealth.com"
                            variant="outlined"
                            size="large"
                            sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' }, fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.1rem', borderRadius: 8 }}
                        >
                            Email Sales
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
