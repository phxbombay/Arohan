import { Box, Button, Container, Typography, TextField, Grid, Paper, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useState } from 'react';
import {
    LocalHospital as HospitalIcon,
    Security as ShieldIcon,
    Devices as ChipIcon,
    Science as FlaskIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'sonner';

export default function Partners() {
    const [formData, setFormData] = useState({
        name: '',
        organization: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post('/leads/partnership', formData);
            setSubmitted(true);
            toast.success('Partnership inquiry submitted successfully!');
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
            toast.error('Failed to submit inquiry.');
        } finally {
            setLoading(false);
        }
    };

    const partnershipTypes = [
        {
            icon: <HospitalIcon sx={{ fontSize: 48 }} />,
            title: 'Hospitals & Senior‑Living Homes',
            description: 'Integrate Arohan into your monitoring and emergency protocols; use our dashboards for early warning and audit trails.',
            color: 'error.main'
        },
        {
            icon: <ShieldIcon sx={{ fontSize: 48 }} />,
            title: 'Insurers',
            description: 'Explore risk‑reduction programs and value‑added services for policyholders.',
            color: 'primary.main'
        },
        {
            icon: <ChipIcon sx={{ fontSize: 48 }} />,
            title: 'OEMs & Device Makers',
            description: 'Embed Arohan\'s plugin chip and AI stack into your smartwatches, rings or bands.',
            color: 'success.main'
        },
        {
            icon: <FlaskIcon sx={{ fontSize: 48 }} />,
            title: 'Researchers & Grants',
            description: 'Collaborate on clinical validation, AI models and public‑health impact studies.',
            color: 'warning.main'
        }
    ];

    if (submitted) {
        return (
            <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
                <Container maxWidth="sm">
                    <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: 2, borderColor: 'success.light' }}>
                        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Thank You!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            We've received your partnership inquiry. Our team will reach out to you within 2 business days.
                        </Typography>
                        <Button variant="contained" href="/" sx={{ mt: 2 }}>
                            Return to Home
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100dvh' }}>
            {/* Hero Section */}
            <Box sx={{ py: 12, bgcolor: 'primary.main', color: 'white' }}>
                <Container>
                    <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
                        <Typography variant="h2" fontWeight="bold" gutterBottom>
                            Let's scale safer elder‑care together
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
                            Partner with Arohan to bring AI-powered emergency detection and first aid guidance to more families, communities, and institutions.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Partnership Types */}
            <Box sx={{ py: 12, bgcolor: 'background.paper' }}>
                <Container>
                    <Grid container spacing={4} justifyContent="center">
                        {partnershipTypes.map((type, index) => (
                            <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                                <Card elevation={0} sx={{ height: '100%', border: 2, borderColor: 'grey.200', borderRadius: 3, transition: 'all 0.3s', '&:hover': { boxShadow: 6, borderColor: type.color, transform: 'translateY(-8px)' } }}>
                                    <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <Box sx={{ color: type.color, mb: 3 }}>
                                            {type.icon}
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {type.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.6 }}>
                                            {type.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Contact Form */}
            <Box sx={{ py: 12, bgcolor: 'grey.50' }}>
                <Container>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Contact Us for Pilots
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Fill out the form below and our partnerships team will get in touch with you.
                        </Typography>
                    </Box>

                    <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: 2, borderColor: 'grey.200' }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Your Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Organization"
                                        name="organization"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Phone Number"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Message / Use‑case"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        variant="outlined"
                                        multiline
                                        rows={5}
                                        placeholder="Tell us about your organization and how you'd like to partner with Arohan..."
                                    />
                                </Grid>
                                {error && (
                                    <Grid item xs={12}>
                                        <Alert severity="error">{error}</Alert>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        disabled={loading}
                                        sx={{ py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Partnership Inquiry'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
}
