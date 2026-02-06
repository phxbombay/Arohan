import {
    HelpOutline as HelpIcon,
    MenuBook as BookIcon,
    OndemandVideo as VideoIcon,
    Chat as ChatIcon,
    Phone as PhoneIcon,
    Email as MailIcon,
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    EmojiPeople as SupportIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    InputAdornment,
    TextField,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Button,
    Stack,
    Paper
} from '@mui/material';

export function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSection, setExpandedSection] = useState(false);

    const helpSections = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: BookIcon,
            articles: [
                { title: 'Setting up your Arohan device', link: '#setup' },
                { title: 'Creating your account', link: '#account' },
                { title: 'Pairing with your smartphone', link: '#pairing' },
                { title: 'Understanding your dashboard', link: '#dashboard' }
            ]
        },
        {
            id: 'device-usage',
            title: 'Device Usage',
            icon: HelpIcon,
            articles: [
                { title: 'How to wear your device correctly', link: '#wear' },
                { title: 'Charging and battery life', link: '#battery' },
                { title: 'Water resistance and care', link: '#care' },
                { title: 'Troubleshooting device issues', link: '#troubleshoot' }
            ]
        },
        {
            id: 'emergency',
            title: 'Emergency Features',
            icon: PhoneIcon,
            articles: [
                { title: 'Using the SOS button', link: '#sos' },
                { title: 'Fall detection explained', link: '#fall' },
                { title: 'Adding emergency contacts', link: '#contacts' },
                { title: 'Testing emergency alerts', link: '#test' }
            ]
        },
        {
            id: 'monitoring',
            title: 'Health Monitoring',
            icon: VideoIcon,
            articles: [
                { title: 'Reading your health metrics', link: '#metrics' },
                { title: 'Setting health goals', link: '#goals' },
                { title: 'Understanding alerts and warnings', link: '#alerts' },
                { title: 'Sharing data with your doctor', link: '#sharing' }
            ]
        }
    ];

    const contactOptions = [
        {
            icon: PhoneIcon,
            title: 'Phone Support',
            content: 'Coming Soon',
            subtext: 'This feature will be enabled soon',
            action: '#'
        },
        {
            icon: MailIcon,
            title: 'Email Support',
            content: 'info@haspranahealth.com',
            subtext: 'Response within 24 hours',
            action: 'mailto:info@haspranahealth.com'
        },
        {
            icon: ChatIcon,
            title: 'Live Chat',
            content: 'Coming Soon',
            subtext: 'This feature will be enabled soon',
            action: '#'
        }
    ];

    const handleChange = (panel) => (event, isExpanded) => {
        setExpandedSection(isExpanded ? panel : false);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            {/* Hero */}
            <Box sx={{ background: 'linear-gradient(to right, #7b1fa2, #9c27b0)', color: 'common.white', py: 10, px: 2, textAlign: 'center' }}>
                <Container>
                    <SupportIcon sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h3" fontWeight="bold" gutterBottom>Help Center</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 6 }}>Find answers, guides, and support resources</Typography>

                    <TextField
                        fullWidth
                        placeholder="Search for help articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="outlined"
                        sx={{ bgcolor: 'common.white', borderRadius: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            )
                        }}
                    />
                </Container>
            </Box>

            {/* Quick Links */}
            <Box sx={{ py: 6, bgcolor: 'common.white' }}>
                <Container>
                    <Grid container spacing={3} justifyContent="center">
                        {[
                            { title: 'How It Works', icon: BookIcon, link: '/how-it-works', color: 'secondary.main', bgcolor: 'secondary.50' },
                            { title: 'FAQ', icon: HelpIcon, link: '/faq', color: 'info.main', bgcolor: 'info.50' },
                            { title: 'Product Guide', icon: VideoIcon, link: '/products', color: 'success.main', bgcolor: 'success.50' },
                            { title: 'Contact Us', icon: ChatIcon, link: '/contact', color: 'error.main', bgcolor: 'error.50' }
                        ].map((item, idx) => (
                            <Grid item xs={6} md={3} key={idx}>
                                <Link to={item.link} style={{ textDecoration: 'none' }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            textAlign: 'center',
                                            bgcolor: item.bgcolor,
                                            transition: '0.3s',
                                            '&:hover': { bgcolor: 'grey.100', transform: 'translateY(-4px)' }
                                        }}
                                    >
                                        <item.icon sx={{ fontSize: 40, color: item.color, mb: 1 }} />
                                        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">{item.title}</Typography>
                                    </Paper>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Help Sections */}
            <Box sx={{ py: 8 }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 6 }}>Browse Help Topics</Typography>
                    <Stack spacing={2}>
                        {helpSections.map((section) => (
                            <Accordion
                                key={section.id}
                                expanded={expandedSection === section.id}
                                onChange={handleChange(section.id)}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ p: 1, bgcolor: 'secondary.50', borderRadius: 1, color: 'secondary.main' }}>
                                            <section.icon />
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold">{section.title}</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        {section.articles.map((article, idx) => (
                                            <ListItem key={idx} button component="a" href={article.link}>
                                                <ListItemText
                                                    primary={article.title}
                                                    primaryTypographyProps={{ color: 'secondary.main', fontWeight: 'medium' }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Stack>
                </Container>
            </Box>

            {/* Contact Support */}
            <Box sx={{ py: 8, bgcolor: 'common.white' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 6 }}>Still Need Help?</Typography>
                    <Grid container spacing={4}>
                        {contactOptions.map((option, idx) => (
                            <Grid item xs={12} md={4} key={idx}>
                                <Card
                                    component="a"
                                    href={option.action}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        p: 3,
                                        textDecoration: 'none',
                                        transition: '0.3s',
                                        '&:hover': { boxShadow: 4 }
                                    }}
                                >
                                    <Box sx={{ p: 2, bgcolor: 'secondary.50', borderRadius: '50%', mb: 2, color: 'secondary.main' }}>
                                        <option.icon fontSize="large" />
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>{option.title}</Typography>
                                    <Typography variant="body1" color="secondary.main" fontWeight="medium" gutterBottom>{option.content}</Typography>
                                    <Typography variant="caption" color="text.secondary">{option.subtext}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Emergency */}
            <Box sx={{ py: 8, bgcolor: 'error.main', color: 'common.white', textAlign: 'center' }}>
                <Container>
                    <PhoneIcon sx={{ fontSize: 56, mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Emergency Support</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>For urgent technical issues affecting your safety features</Typography>
                    <Button
                        variant="contained"
                        size="large"
                        href="tel:112"
                        sx={{ bgcolor: 'common.white', color: 'error.main', py: 2, px: 4, fontSize: '1.2rem', fontWeight: 'bold', '&:hover': { bgcolor: 'grey.100' } }}
                    >
                        Call Emergency Support: 112
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}
