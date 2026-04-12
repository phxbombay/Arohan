import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Paper,
    Card,
    CardContent,
    Stack,
    Chip,
    Dialog,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    Phone as PhoneIcon,
    ArrowForward as ArrowRightIcon,
    VerifiedUser as ShieldCheckIcon,
    Timeline as ActivityIcon,
    Favorite as HeartPulseIcon,
    Person as UserCheckIcon,
    Close as XIcon,
    NotificationsActive as SirenIcon,
    LocationOn as LocationIcon,
    LocalShipping as AmbulanceIcon,
    Smartphone as MobileIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

import heroImage from '../../assets/images/hero_prevention.png';
import { trackButtonClick } from '../../utils/eventTracking';


// Lazy load heavy components
const FirstAidSection = lazy(() => import('../components/FirstAidSection').then(module => ({ default: module.FirstAidSection })));
const SymptomChecker = lazy(() => import('../components/SymptomChecker').then(module => ({ default: module.SymptomChecker })));

// Framer Motion Wrappers
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);

// Loading Fallback
const LoadingComponent = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
    </Box>
);

export function Home() {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
            <SEO
                title="AI-Powered Emergency Prevention & First Aid"
                description="A discreet wearable plugin chip and intelligent app that assists in health monitoring and emergency detection, providing alerts to families and guidance for first responders."
                keywords="health monitoring, preventive care, individuals and families, emergency detection, first aid, AI health, wearable health device, health safety, heart monitoring"
                canonical="https://arohanhealth.com/"
                type="website"
                image="https://arohanhealth.com/images/hero-health-monitoring.jpg"
            />
            {/* Hero Section */}
            <Box sx={{ position: 'relative', py: { xs: 8, lg: 16 }, overflow: 'hidden', bgcolor: 'grey.50' }}>
                {/* Background Blobs (Simplified using Box) */}
                <Box sx={{ position: 'absolute', top: 0, right: 0, transform: 'translate(48px, -48px)', opacity: 0.2, pointerEvents: 'none' }}>
                    <Box sx={{ width: 384, height: 384, borderRadius: '50%', bgcolor: 'primary.main', filter: 'blur(64px)' }} />
                </Box>

                <Container sx={{ position: 'relative', zIndex: 10 }}>
                    <Grid container spacing={4} alignItems="center" justifyContent="space-between">
                        {/* Text Content */}
                        <Grid item xs={12} md={6}>
                            <MotionTypography
                                variant="h1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800, color: 'text.primary', lineHeight: 1.2, mb: 3 }}
                            >
                                Arohan – <Box component="span" sx={{ color: 'primary.main' }}>AI‑Powered</Box><br />
                                Emergency Prevention <br />
                                & First Aid
                            </MotionTypography>

                            <MotionTypography
                                variant="h6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                sx={{ color: 'text.secondary', mb: 4, maxWidth: 600, lineHeight: 1.6 }}
                            >
                                A discreet wearable plugin chip and intelligent app designed to assist in health monitoring and emergency notification.
                                <Box component="span" sx={{ display: 'block', mt: 2, fontSize: '0.9rem', fontStyle: 'italic', color: 'warning.dark' }}>{t('home.prototypeNote')}</Box>
                            </MotionTypography>

                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}
                            >
                                <Button
                                    component={Link}
                                    to="/early-access"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={trackButtonClick('Join Early Access', 'Home Hero')}
                                    endIcon={<ArrowRightIcon />}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        borderRadius: 8,
                                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.6)'
                                        }
                                    }}
                                >
                                    {t('home.joinEarlyAccess')}
                                </Button>
                                <Button
                                    component={Link}
                                    to="/partners"
                                    variant="outlined"
                                    size="large"
                                    onClick={trackButtonClick('Partner with Us', 'Home Hero')}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        borderRadius: 8,
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            borderColor: 'primary.dark',
                                            color: 'primary.dark',
                                            bgcolor: 'primary.50'
                                        }
                                    }}
                                >
                                    {t('home.partnerWithUs')}
                                </Button>
                            </MotionBox>
                        </Grid>

                        {/* Hero Image */}
                        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, position: 'relative' }}>
                            <Box sx={{ position: 'relative', width: { xs: 300, md: 450 }, height: { xs: 300, md: 450 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {/* Decorative Rings (Now Absolute Siblings to prevent opacity inheritance) */}
                                <Box sx={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid rgba(220, 38, 38, 0.3)' }} />
                                <Box sx={{ position: 'absolute', width: '85%', height: '85%', borderRadius: '50%', border: '2px solid rgba(239, 68, 68, 0.6)' }} />

                                {/* Main Image Container */}
                                <Box sx={{ width: '70%', height: '70%', borderRadius: '50%', overflow: 'hidden', border: 8, borderColor: 'white', boxShadow: 10, position: 'relative', zIndex: 2 }}>
                                    <img src={heroImage} alt="Proactive Health Care" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>

                                {/* Floating Cards */}
                                <Paper
                                    elevation={3}
                                    sx={{ position: 'absolute', top: '10%', left: 0, p: 1.5, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 3 }}
                                    component={motion.div}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Box sx={{ bgcolor: 'success.light', p: 1, borderRadius: '50%' }}>
                                        <ShieldCheckIcon sx={{ color: 'success.dark' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">{t('home.heroStatus')}</Typography>
                                        <Typography variant="body2" fontWeight="bold">{t('home.heroProtected')}</Typography>
                                    </Box>
                                </Paper>

                                <Paper
                                    elevation={3}
                                    sx={{ position: 'absolute', bottom: '10%', right: 0, p: 1.5, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 3 }}
                                    component={motion.div}
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                >
                                    <Box sx={{ bgcolor: 'error.light', p: 1, borderRadius: '50%' }}>
                                        <HeartPulseIcon sx={{ color: 'error.main' }} />
                                    </Box>
                                    <Typography variant="body2" fontWeight="bold">{t('home.heroVitals')}</Typography>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>



            {/* Problem Section */}
            <Box sx={{ py: 12, bgcolor: 'error.50' }}>
                <Container >
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            {t('home.problemTitle')}
                        </Typography>
                    </Box>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 900, mx: 'auto', lineHeight: 1.8, textAlign: 'center' }}>
                        {t('home.problemDesc')}
                    </Typography>
                </Container>
            </Box>

            {/* Solution Section */}
            <Box sx={{ py: 12, bgcolor: 'background.paper' }}>
                <Container >
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            {t('home.solutionTitle')}
                        </Typography>
                    </Box>
                    <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                        <Grid item xs={12} md={4}>
                            <Card elevation={0} sx={{ height: '100%', bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 4, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6, bgcolor: 'rgba(25, 118, 210, 0.08)' } }}>
                                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', textAlign: 'center' }}>
                                    <Box sx={{ mb: 2, color: 'primary.main' }}>
                                        <ActivityIcon sx={{ fontSize: 40 }} />
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 1 }}>
                                        {t('home.solution1Title')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {t('home.solution1Desc')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card elevation={0} sx={{ height: '100%', bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 4, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6, bgcolor: 'rgba(25, 118, 210, 0.08)' } }}>
                                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', textAlign: 'center' }}>
                                    <Box sx={{ mb: 2, color: 'primary.main' }}>
                                        <HeartPulseIcon sx={{ fontSize: 40 }} />
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 1 }}>
                                        {t('home.solution2Title')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {t('home.solution2Desc')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card elevation={0} sx={{ height: '100%', bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 4, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6, bgcolor: 'rgba(25, 118, 210, 0.08)' } }}>
                                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', textAlign: 'center' }}>
                                    <Box sx={{ mb: 2, color: 'primary.main' }}>
                                        <ShieldCheckIcon sx={{ fontSize: 40 }} />
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 1 }}>
                                        {t('home.solution3Title')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {t('home.solution3Desc')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <Button
                            component={Link}
                            to="/how-it-works"
                            variant="contained"
                            size="large"
                            endIcon={<ArrowRightIcon />}
                            sx={{
                                px: 6, py: 1.5, fontSize: '1.2rem', borderRadius: 8,
                                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                                transition: 'all 0.3s',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(37, 99, 235, 0.6)' }
                            }}
                        >
                            {t('home.seeHowArohanWorks')}
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Key Benefits Section */}
            <Box sx={{ py: 12, bgcolor: 'grey.50' }}>
                <Container >
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            {t('home.benefitsTitle')}
                        </Typography>
                    </Box>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { icon: <UserCheckIcon sx={{ fontSize: 40 }} />, text: t('home.benefit1'), color: 'primary.main' },
                            { icon: <ActivityIcon sx={{ fontSize: 40 }} />, text: t('home.benefit2'), color: 'success.main' },
                            { icon: <PhoneIcon sx={{ fontSize: 40 }} />, text: t('home.benefit3'), color: 'error.main' },
                            { icon: <ShieldCheckIcon sx={{ fontSize: 40 }} />, text: t('home.benefit4'), color: 'warning.main' },
                            { icon: <HeartPulseIcon sx={{ fontSize: 40 }} />, text: t('home.benefit5'), color: 'info.main' }
                        ].map((benefit, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Paper elevation={0} sx={{ p: 4, height: '100%', textAlign: 'center', bgcolor: 'white', border: 1, borderColor: 'grey.200', borderRadius: 3, transition: 'all 0.3s', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}>
                                    <Box sx={{ color: benefit.color, mb: 2 }}>
                                        {benefit.icon}
                                    </Box>
                                    <Typography variant="body1" fontWeight="medium" sx={{ lineHeight: 1.6 }}>
                                        {benefit.text}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* How It Works */}
            <Box sx={{ py: 12, bgcolor: 'background.paper' }}>
                <Container>
                    <Box sx={{ textAlign: 'center', mb: 8, maxWidth: 700, mx: 'auto' }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>{t('home.howItWorksTitle')}</Typography>
                        <Typography variant="h6" color="text.secondary">{t('home.howItWorksDesc')}</Typography>
                    </Box>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { title: t('home.hw1Title'), desc: t('home.hw1Desc'), icon: <SirenIcon sx={{ fontSize: 40 }} />, step: "1" },
                            { title: t('home.hw2Title'), desc: t('home.hw2Desc'), icon: <LocationIcon sx={{ fontSize: 40 }} />, step: "2" },
                            { title: t('home.hw3Title'), desc: t('home.hw3Desc'), icon: <AmbulanceIcon sx={{ fontSize: 40 }} />, step: "3" },
                            { title: t('home.hw4Title'), desc: t('home.hw4Desc'), icon: <MobileIcon sx={{ fontSize: 40 }} />, step: "4" }
                        ].map((item, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Paper elevation={0} sx={{ p: 4, bgcolor: 'grey.50', borderRadius: 4, textAlign: 'center', border: 1, borderColor: 'grey.200', height: '100%' }}>
                                    <Box sx={{ width: 48, height: 48, bgcolor: 'error.main', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold', mx: 'auto', mb: 2 }}>
                                        {item.step}
                                    </Box>
                                    <Box sx={{ color: 'error.main', mb: 2 }}>{item.icon}</Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>{item.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* AI Technology Section */}
            <Box sx={{ py: 12, bgcolor: 'grey.50' }}>
                <Container >
                    <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', mb: 8 }}>
                        <Chip label={t('home.techChip')} sx={{ mb: 2, bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 600 }} />
                        <Typography variant="h3" fontWeight="bold" gutterBottom>{t('home.techTitle')}</Typography>
                        <Typography variant="subtitle1" color="text.secondary">{t('home.techDesc')}</Typography>
                    </Box>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { title: t('home.tech1Title'), desc: t('home.tech1Desc'), icon: <ActivityIcon />, color: "primary.main" },
                            { title: t('home.tech2Title'), desc: t('home.tech2Desc'), icon: <UserCheckIcon />, color: "primary.dark" },
                            { title: t('home.tech3Title'), desc: t('home.tech3Desc'), icon: <ShieldCheckIcon />, color: "primary.main" },
                            { title: t('home.tech4Title'), desc: t('home.tech4Desc'), icon: <ActivityIcon />, color: "primary.dark" },
                            { title: t('home.tech5Title'), desc: t('home.tech5Desc'), icon: <HeartPulseIcon />, color: "primary.main" },
                            { title: t('home.tech6Title'), desc: t('home.tech6Desc'), icon: <ArrowRightIcon />, color: "primary.dark" }
                        ].map((item, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Paper elevation={1} sx={{ p: 3, borderRadius: 3, height: '100%', border: 1, borderColor: 'primary.light', textAlign: 'center', transition: 'all 0.3s', '&:hover': { boxShadow: 4, borderColor: 'primary.main', transform: 'translateY(-4px)' } }}>
                                    <Box sx={{ width: 56, height: 56, bgcolor: item.color, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, color: 'white', boxShadow: 3, mx: 'auto' }}>
                                        {item.icon}
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>{item.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Who We Serve */}
            <Box sx={{ py: 12 }}>
                <Container >
                    <Box sx={{ bgcolor: 'grey.900', borderRadius: 4, p: { xs: 4, md: 8 }, color: 'white' }}>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="h3" fontWeight="bold" gutterBottom>{t('home.whoTitle')}</Typography>
                            <Typography variant="subtitle1" color="grey.400">{t('home.whoDesc')}</Typography>
                        </Box>
                        <Grid container spacing={4} justifyContent="center">
                            {[
                                { title: t('home.who1Title'), desc: t('home.who1Desc'), link: "/individuals-families", color: "primary.main" },
                                { title: t('home.who2Title'), desc: t('home.who2Desc'), link: "/healthcare-professionals", color: "secondary.main" },
                                { title: t('home.who3Title'), desc: t('home.who3Desc'), link: "/corporate-insurance", color: "success.main" }
                            ].map((item, i) => (
                                <Grid item xs={12} md={4} key={i}>
                                    <Paper
                                        component={Link}
                                        to={item.link}
                                        sx={{
                                            display: 'block',
                                            p: 4,
                                            bgcolor: 'grey.800',
                                            borderRadius: 3,
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            height: '100%',
                                            textAlign: 'center',
                                            transition: 'background-color 0.2s',
                                            '&:hover': { bgcolor: 'grey.700' },
                                            '&:hover h5': { color: item.color }
                                        }}
                                    >
                                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ transition: 'color 0.2s', mb: 2 }}>{item.title}</Typography>
                                        <Typography variant="body1" color="grey.400" sx={{ mb: 3, lineHeight: 1.6 }}>{item.desc}</Typography>
                                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ fontWeight: 600 }}>
                                            <Box component="span">{t('home.learnMore')}</Box>
                                            <ArrowRightIcon fontSize="small" />
                                        </Stack>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>


            {/* First Aid Section Wrapper (Partial Migration) */}
            <Suspense fallback={<LoadingComponent />}>
                <FirstAidSection />
            </Suspense>

            {/* Image Modal */}
            <Dialog
                open={!!selectedImage}
                onClose={() => setSelectedImage(null)}

                PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}
            >
                <Box sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={() => setSelectedImage(null)}
                        sx={{ position: 'absolute', top: -40, right: 0, color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}
                    >
                        <XIcon />
                    </IconButton>
                    <img src={selectedImage || undefined} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 16 }} />
                </Box>
            </Dialog>
        </Box>
    );
}
