import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    Avatar
} from '@mui/material';
import {
    NotificationsActive as BellIcon,
    HealthAndSafety as ShieldIcon,
    Smartphone as SmartphoneIcon,
    Favorite as HeartIcon
} from '@mui/icons-material';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
// import seniorImage from '../../../assets/images/ideal-lifestyle.jpg'; // Broken import removed

// Motion components
const MotionTypography = motion(Typography);

export function Elderly() {
    const features = [
        {
            icon: <BellIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
            title: "One-Touch SOS",
            desc: "Emergency help is just a button press away. No unlocking phones or dialing numbers."
        },
        {
            icon: <ShieldIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
            title: "Automatic Fall Detection",
            desc: "Smart sensors detect falls instantly and alert family members even if you can't."
        },
        {
            icon: <SmartphoneIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
            title: "Family App Connection",
            desc: "Your loved ones can check your status, location, and battery life anytime from their phones."
        },
        {
            icon: <HeartIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
            title: "Health Monitoring",
            desc: "Keeps track of heart rate and activity levels to spot potential issues early."
        }
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
            {/* Hero */}
            <Box sx={{ bgcolor: 'info.50', py: 10 }}>
                <Container>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <MotionTypography
                                variant="h2"
                                component="h1"
                                fontWeight="bold"
                                color="primary.main"
                                gutterBottom
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                sx={{ lineHeight: 1.2, mb: 3 }}
                            >
                                Independence for You. <br />
                                Peace of Mind for Them.
                            </MotionTypography>
                            <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
                                Live life on your terms with Arohan. The discreet safety companion that keeps you connected to those who care.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    component={Link}
                                    to="/pricing"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        px: 4, py: 1.5,
                                        fontSize: '1.1rem',
                                        borderRadius: 8,
                                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                                        transition: 'all 0.3s',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(37, 99, 235, 0.6)' }
                                    }}
                                >
                                    Get Arohan Now
                                </Button>
                                <Button
                                    component={Link}
                                    to="/how-it-works"
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        px: 4, py: 1.5,
                                        fontSize: '1.1rem',
                                        borderRadius: 8,
                                        transition: 'all 0.3s',
                                        '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.05)', borderColor: 'primary.main' }
                                    }}
                                >
                                    How to Use
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Box sx={{ p: 2, borderRadius: '50%', border: 2, borderColor: 'info.main', opacity: 0.3 }}>
                                    <Box sx={{ p: 2, borderRadius: '50%', border: 2, borderColor: 'info.light', opacity: 0.6 }}>
                                        <Box sx={{ width: 320, height: 320, borderRadius: '50%', overflow: 'hidden', border: 8, borderColor: 'white', boxShadow: 6 }}>
                                            <ImageWithFallback
                                                src={seniorImage}
                                                alt="Happy Senior"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Grid */}
            <Box sx={{ py: 10 }}>
                <Container>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                            Simple. Secure. Smart.
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            Designed specifically for seniors who value simplicity. No complex menus, just reliable protection.
                        </Typography>
                    </Box>

                    <Grid container spacing={4} justifyContent="center">
                        {features.map((item, i) => (
                            <Grid item xs={12} sm={6} md={6} lg={3} key={i}>
                                <Card elevation={0} sx={{ height: '100%', textAlign: 'center', bgcolor: 'grey.50', borderRadius: 4, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 10 } }}>
                                    <CardContent sx={{ pt: 4, px: 3, pb: 4 }}>
                                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                            {item.icon}
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.desc}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Testimonial */}
            <Box sx={{ bgcolor: 'secondary.main', color: 'common.white', py: 10 }}>
                <Container sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontStyle="italic" fontWeight={300} gutterBottom sx={{ mb: 4 }}>
                        "I don't feel like I'm wearing a medical device. It looks like a ring, but my daughter says it gives her so much relief knowing I'm safe."
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                        — Lakshmi N., 72, Bangalore
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
