import { Box, Button, Container, Typography, TextField, Grid, Paper, Alert, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'sonner';

export default function EarlyAccess() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        useCase: ''
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
            await api.post('/leads/early-access', formData);
            setSubmitted(true);
            toast.success('Request submitted successfully!');
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
            toast.error('Failed to submit request.');
        } finally {
            setLoading(false);
        }
    };

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
                            We've received your request to join our early access program. Our team will get in touch with you soon.
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
        <Box sx={{ py: 12, bgcolor: 'grey.50', minHeight: '100dvh' }}>
            <Container>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        Join Early Access
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.7 }}>
                        We are currently preparing for pilot deployments with selected families and partner institutions. If you would like to participate in our early‑access program or explore collaboration opportunities, please share your details and we will get in touch.
                    </Typography>
                </Box>

                <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: 2, borderColor: 'grey.200' }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    variant="outlined"
                                    disabled={loading}
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
                                    disabled={loading}
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
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    variant="outlined"
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Use Case / How you plan to use Arohan"
                                    name="useCase"
                                    value={formData.useCase}
                                    onChange={handleChange}
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    placeholder="e.g., For my elderly parents, For our senior living facility, For research purposes..."
                                    disabled={loading}
                                />
                            </Grid>

                            {error && (
                                <Grid item xs={12}>
                                    <Alert severity="error">{error}</Alert>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    Your information will be kept confidential and used only to contact you about the Arohan early access program.
                                </Alert>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    sx={{ py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Have questions? <a href="mailto:info@arohanhealth.com" style={{ color: '#dc2626', textDecoration: 'none' }}>Contact us</a>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
