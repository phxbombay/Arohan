import { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    TextField,
    Button,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Chat as ChatIcon,
    LocationOn as LocationIcon,
    CheckCircle as CheckIcon
} from '@mui/icons-material';
import SEO from '../components/SEO';
import { trackEvent } from '../../utils/analytics';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function ContactEnhanced() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true); // Re-using state to verify loading/submitted ui, logic refined below

        // Track contact form submission
        trackEvent({ category: 'Contact', action: 'Form Submission', label: formData.subject });

        try {
            await axios.post('/v1/contact', formData);
            toast.success("Message sent successfully! We will get back to you soon.");
            setSubmitted(true);
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again later.");
            setSubmitted(false);
        }
    };

    const contacts = [
        {
            icon: <EmailIcon />,
            title: t('contact.emailTitle'),
            primary: 'support@arohanhealth.com',
            secondary: t('contact.emailSub'),
            action: 'mailto:support@arohanhealth.com'
        },
        {
            icon: <PhoneIcon />,
            title: t('contact.callTitle'),
            primary: '+91 70190 24300',
            secondary: t('contact.callSub'),
            action: 'tel:+917019024300'
        },
        {
            icon: <ChatIcon />,
            title: t('contact.chatTitle'),
            primary: t('contact.chatPrimary'),
            secondary: t('contact.chatSub'),
            action: '#'
        },
        {
            icon: <LocationIcon />,
            title: t('contact.visitTitle'),
            primary: 'HSR Layout, Bengaluru',
            secondary: t('contact.visitSub'),
            action: 'https://maps.google.com'
        }
    ];

    return (
        <Box>
            <SEO
                title="Contact Arohan Health"
                description="Reach the Arohan Health team at +91 70190 24300 or support@arohanhealth.com. Based in HSR Layout, Bengaluru. Sales, press, and career inquiries welcome."
                keywords="contact Arohan Health, health tech support Bengaluru, emergency wearable support India"
                canonical="https://arohanhealth.com/contact"
            />

            {/* Hero */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        {t('contact.heroTitle')}
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9 }}>
                        {t('contact.heroSubtitle')}
                    </Typography>
                </Container>
            </Box>

            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Grid container spacing={6}>
                    {/* Contact Form */}
                    <Grid item xs={12} md={7}>
                        <Card sx={{ p: 4 }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                {t('contact.formTitle')}
                            </Typography>
                            {submitted ? (
                                <Alert severity="success" sx={{ mt: 2 }}>
                                    <Typography variant="h6">{t('contact.successTitle')}</Typography>
                                    <Typography>{t('contact.successDesc')}</Typography>
                                </Alert>
                            ) : (
                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label={t('contact.name')}
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label={t('contact.email')}
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label={t('contact.phone')}
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label={t('contact.subject')}
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label={t('contact.message')}
                                                name="message"
                                                multiline
                                                rows={5}
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                sx={{
                                                    px: 6,
                                                    py: 1.5,
                                                    minWidth: '200px',
                                                    borderRadius: 8,
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {t('contact.submit')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Card>
                    </Grid>

                    {/* Contact Methods */}
                    <Grid item xs={12} md={5}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {t('contact.methodsTitle')}
                        </Typography>
                        <Stack spacing={3} sx={{ mt: 3 }}>
                            {contacts.map((contact, index) => (
                                <Card key={index} sx={{ p: 3 }}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Box sx={{ color: 'primary.main', mt: 0.5 }}>
                                            {contact.icon}
                                        </Box>
                                        <Box flexGrow={1}>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {contact.title}
                                            </Typography>
                                            <Typography variant="body1">{contact.primary}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {contact.secondary}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Card>
                            ))}
                        </Stack>

                        <Card sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {t('contact.inquiriesTitle')}
                            </Typography>
                            <List dense>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary={t('contact.sales')}
                                        secondary="sales@arohanhealth.com"
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary={t('contact.press')}
                                        secondary="press@arohanhealth.com"
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary={t('contact.careers')}
                                        secondary="careers@arohanhealth.com"
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary={t('contact.techSupport')}
                                        secondary="support@arohanhealth.com"
                                    />
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
