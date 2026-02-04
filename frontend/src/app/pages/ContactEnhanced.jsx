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
import { Helmet } from 'react-helmet-async';
import { trackEvent } from '../../utils/analytics';
import axios from 'axios';
import { toast } from 'sonner';

export function ContactEnhanced() {
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
            title: 'Email Us',
            primary: 'support@arohanhealth.com',
            secondary: 'Response within 24 hours',
            action: 'mailto:support@arohanhealth.com'
        },
        {
            icon: <PhoneIcon />,
            title: 'Call Us',
            primary: '+91 80 4567 8900',
            secondary: 'Mon-Fri, 9 AM - 6 PM IST',
            action: 'tel:+918045678900'
        },
        {
            icon: <ChatIcon />,
            title: 'Live Chat',
            primary: 'Chat with our team',
            secondary: 'Available 10 AM - 6 PM',
            action: '#'
        },
        {
            icon: <LocationIcon />,
            title: 'Visit Us',
            primary: 'HSR Layout, Bengaluru',
            secondary: 'By appointment only',
            action: 'https://maps.google.com'
        }
    ];

    return (
        <Box>
            <Helmet>
                <title>Contact Arohan Health - Support, Sales, Partnerships</title>
                <meta name="description" content="Get in touch with Arohan: Email support@arohanhealth.com, Call +91 80 4567 8900, or visit our Bengaluru office. Live chat available 10 AM - 6 PM IST." />
            </Helmet>

            {/* Hero */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        Get in Touch
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9 }}>
                        We're here to help. Choose your preferred way to connect.
                    </Typography>
                </Container>
            </Box>

            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Grid container spacing={6}>
                    {/* Contact Form */}
                    <Grid item xs={12} md={7}>
                        <Card sx={{ p: 4 }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Send Us a Message
                            </Typography>
                            {submitted ? (
                                <Alert severity="success" sx={{ mt: 2 }}>
                                    <Typography variant="h6">Thank you for reaching out!</Typography>
                                    <Typography>We'll respond to {formData.email} within 24 hours.</Typography>
                                </Alert>
                            ) : (
                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email"
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
                                                label="Phone (Optional)"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Message"
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
                                                Send Message
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
                            Other Ways to Reach Us
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
                                For Specific Inquiries
                            </Typography>
                            <List dense>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary="Sales & Partnerships"
                                        secondary="sales@arohanhealth.com"
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary="Media & Press"
                                        secondary="press@arohanhealth.com"
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary="Careers"
                                        secondary="careers@arohanhealth.com"
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary="Technical Support"
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
