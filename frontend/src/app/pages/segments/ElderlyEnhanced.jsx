import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    Button,
    Avatar,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Link } from 'react-router-dom';
import { CheckCircle as CheckIcon, Favorite as HeartIcon, EmojiPeople as PeopleIcon } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

export function Elderly() {
    const benefits = [
        'Live independently with confidence',
        'Instant help during falls or heart emergencies',
        'Simple one-button SOS for any emergency',
        'No complex buttons - just wear it',
        'Family can check your vitals anytime',
        'Comfortable, lightweight (28g) design',
        'Water-resistant for daily activities',
        '72-hour battery - charge every 3 days'
    ];

    const stories = [
        {
            name: 'Sunita Patel, 68',
            location: 'Mumbai',
            story: '"I fell in my bathroom at 3 AM. Within seconds, my daughter got an alert and called an ambulance. Arohan saved my life."',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
        },
        {
            name: 'Ramesh Kumar, 72',
            location: 'Bengaluru',
            story: '"Living alone after my wife passed was scary. Now my son can see I\'m okay even from the US. Peace of mind for both of us."',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        }
    ];

    return (
        <Box>
            <Helmet>
                <title>Arohan for Elderly & Families - Independent Living with Safety</title>
                <meta name="description" content="Stay independent while family stays connected. Arohan wearable provides fall detection, heart monitoring, and instant alerts for seniors living alone. Peace of mind for everyone." />
                <meta property="og:title" content="Arohan for Elderly - Live Independently, Stay Safe" />
            </Helmet>

            {/* Hero */}
            <Box sx={{ bgcolor: 'success.main', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container>
                    <PeopleIcon sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        For Elderly & Families
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9 }}>
                        Independent living. Constant protection. Family peace of mind.
                    </Typography>
                </Container>
            </Box>

            {/* Benefits */}
            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Why Seniors Love Arohan
                </Typography>
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {benefits.map((benefit, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                                <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="body1">{benefit}</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Success Stories */}
            <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 } }}>
                <Container>
                    <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                        Real Stories from Seniors
                    </Typography>
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        {stories.map((story, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card sx={{ p: 4 }}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                        <Avatar src={story.avatar} sx={{ width: 64, height: 64 }} />
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">{story.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{story.location}</Typography>
                                        </Box>
                                    </Stack>
                                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                                        {story.story}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Family Dashboard */}
            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Family Dashboard
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Even if your parent lives far away, stay connected through our family caregiver app.
                            View their health trends, receive instant emergency alerts, and check in anytime.
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                <ListItemText primary="View daily activity levels" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                <ListItemText primary="See heart rate trends (last 7 days)" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                <ListItemText primary="Get low-battery notifications" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                <ListItemText primary="Receive emergency alerts instantly" />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop"
                            alt="Family using mobile app"
                            sx={{ width: '100%', borderRadius: 4, boxShadow: 4 }}
                        />
                    </Grid>
                </Grid>
            </Container>

            {/* CTA */}
            <Box sx={{ bgcolor: 'success.main', color: 'white', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Give Your Loved Ones the Gift of Safety
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                        Join families worldwide protecting their elderly relatives with Arohan
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button
                            component={Link}
                            to="/checkout?product=elderly-watch"
                            variant="contained"
                            size="large"
                            sx={{ bgcolor: 'white', color: 'success.main', '&:hover': { bgcolor: 'grey.100' } }}
                        >
                            Order Now
                        </Button>
                        <Button
                            component={Link}
                            to="/contact"
                            variant="outlined"
                            size="large"
                            sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                        >
                            Talk to Our Team
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
