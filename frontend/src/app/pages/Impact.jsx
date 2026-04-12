import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { TrendingUp as TrendingUpIcon, People as PeopleIcon, Smartphone as SmartphoneIcon, Home as HomeIcon } from '@mui/icons-material';
import SEO from '../components/SEO';

export function Impact() {
    const trends = [
        {
            icon: <PeopleIcon sx={{ fontSize: 48 }} />,
            title: 'Growing Elderly Population',
            description: 'India\'s 60+ population is projected to reach 194 million by 2031, with many choosing independent living.',
            color: 'primary.main'
        },
        {
            icon: <SmartphoneIcon sx={{ fontSize: 48 }} />,
            title: 'Rising Digital Adoption',
            description: 'Wearable adoption and digital health literacy are increasing rapidly across urban India.',
            color: 'success.main'
        },
        {
            icon: <HomeIcon sx={{ fontSize: 48 }} />,
            title: 'Independent Living Trend',
            description: 'More seniors prefer aging in place with family support from afar, creating new care challenges.',
            color: 'warning.main'
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
            title: 'Emergency Response Gap',
            description: 'Critical minutes are lost in emergencies due to delayed detection and lack of first-aid knowledge.',
            color: 'error.main'
        }
    ];

    return (
        <Box sx={{ minHeight: '100dvh' }}>
            <SEO 
                title="Our Impact & Vision"
                description="Harnessing AI-powered health monitoring to transform elder-care in India and beyond. Faster response times, fewer preventable deaths, and better quality of life."
                keywords="social impact, elder-care India, health technology, AI for good, Arohan Health impact"
            />
            {/* Hero Section */}
            <Box sx={{ py: 12, bgcolor: 'grey.50' }}>
                <Container>
                    <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
                        <Typography variant="h2" fontWeight="bold" gutterBottom>
                            The future of elder‑care, starting in India
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Box sx={{ py: 12, bgcolor: 'background.paper' }}>
                <Container>
                    <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 900, mx: 'auto', lineHeight: 1.9, mb: 8, textAlign: 'center' }}>
                        India's elderly population is growing rapidly, and more seniors are choosing to live independently. At the same time, wearable adoption and digital health literacy are rising. Arohan sits at the intersection of these trends, using AI and discreet biosensors to make emergency‑ready care accessible at home, in senior‑living facilities and in gated communities.
                    </Typography>

                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Our goal is simple:
                        </Typography>
                        <Grid container spacing={4} sx={{ mt: 4 }} justifyContent="center">
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={0} sx={{ p: 4, bgcolor: 'error.50', borderRadius: 3, border: 2, borderColor: 'error.light' }}>
                                    <Typography variant="h3" fontWeight="bold" color="error.main" gutterBottom>
                                        Fewer
                                    </Typography>
                                    <Typography variant="h6" fontWeight="medium">
                                        Preventable Deaths
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={0} sx={{ p: 4, bgcolor: 'success.50', borderRadius: 3, border: 2, borderColor: 'success.light' }}>
                                    <Typography variant="h3" fontWeight="bold" color="success.main" gutterBottom>
                                        Faster
                                    </Typography>
                                    <Typography variant="h6" fontWeight="medium">
                                        Response Times
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={0} sx={{ p: 4, bgcolor: 'primary.50', borderRadius: 3, border: 2, borderColor: 'primary.light' }}>
                                    <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
                                        Better
                                    </Typography>
                                    <Typography variant="h6" fontWeight="medium">
                                        Quality of Life
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
            
            {/* Security Section */}
            <Box sx={{ py: 12, bgcolor: 'background.paper', borderTop: 1, borderColor: 'grey.100' }}>
                <Container>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Security & Data Governance
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Your health data is protected by industry-leading security protocols
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {[
                            {
                                title: "End-to-End Encryption",
                                description: "All data transmitted between the wearable, the app, and our servers is encrypted using AES-256 standards with rotating secure keys.",
                                icon: "🔒"
                            },
                            {
                                title: "AWS Cloud Guard",
                                description: "Our infrastructure is protected by AWS Shield and WAF (Web Application Firewall) to prevent unauthorized access and DDoS attacks.",
                                icon: "🛡️"
                            },
                            {
                                title: "Spam & Bot Protection",
                                description: "Automated filters prevent spam alerts and ensure that emergency triggers are validated against authenticated user profiles.",
                                icon: "🚫"
                            },
                            {
                                title: "Privacy First (HIPAA)",
                                description: "Health records are stored in HIPAA-compliant isolated environments, ensuring that only you and authorized responders have access.",
                                icon: "✅"
                            }
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Paper elevation={0} sx={{ p: 4, bgcolor: 'grey.50', borderRadius: 3, border: 1, borderColor: 'grey.200' }}>
                                    <Typography variant="h2" sx={{ mb: 2, fontSize: '2rem' }}>{item.icon}</Typography>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>{item.title}</Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>{item.description}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>


            {/* Trends Section */}
            <Box sx={{ py: 12, bgcolor: 'grey.50' }}>
                <Container>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Why Now?
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Converging trends make this the right time for Arohan
                        </Typography>
                    </Box>

                    <Grid container spacing={4} justifyContent="center">
                        {trends.map((trend, index) => (
                            <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                                <Paper elevation={0} sx={{ p: 4, height: '100%', textAlign: 'center', border: 2, borderColor: 'grey.200', borderRadius: 3, transition: 'all 0.3s', '&:hover': { boxShadow: 6, borderColor: trend.color, transform: 'translateY(-8px)' } }}>
                                    <Box sx={{ color: trend.color, mb: 3 }}>
                                        {trend.icon}
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {trend.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {trend.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Call to Action */}
            <Box sx={{ py: 12, bgcolor: 'primary.main', color: 'white' }}>
                <Container>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Join us in transforming elder care
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                            Whether you're a family member, healthcare provider, or potential partner, there's a place for you in the Arohan ecosystem.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                            <a href="/early-access" style={{ textDecoration: 'none' }}>
                                <Paper sx={{ px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 2, cursor: 'pointer', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
                                    Join Early Access
                                </Paper>
                            </a>
                            <a href="/partners" style={{ textDecoration: 'none' }}>
                                <Paper sx={{ px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 2, bgcolor: 'transparent', color: 'white', border: 2, borderColor: 'white', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { bgcolor: 'white', color: 'primary.main' } }}>
                                    Partner with Us
                                </Paper>
                            </a>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
