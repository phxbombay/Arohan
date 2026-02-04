import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import { trackFormSubmission } from '../../utils/eventTracking';

export function NewsletterSignup({ inline = false }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // TODO: Replace with actual Mailchimp API endpoint
            // const response = await fetch('/api/newsletter/subscribe', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email })
            // });

            // Simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Track signup
            trackFormSubmission('Newsletter Signup', true);

            setStatus('success');
            setEmail('');

            // Reset after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('Newsletter signup error:', error);
            trackFormSubmission('Newsletter Signup', false);
            setStatus('error');
        }
    };

    if (inline) {
        return (
            <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
                {status === 'success' && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Thanks! Check your email to confirm subscription.
                    </Alert>
                )}
                {status === 'error' && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Something went wrong. Please try again.
                    </Alert>
                )}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={status === 'loading'}
                        size="small"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={status === 'loading'}
                        sx={{ minWidth: 100 }}
                    >
                        {status === 'loading' ? <CircularProgress size={24} /> : 'Subscribe'}
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: { xs: 6, md: 8 },
                px: 3,
                borderRadius: 2,
                textAlign: 'center'
            }}
        >
            <EmailIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Stay Updated
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Get the latest health tips, product updates, and exclusive offers
            </Typography>

            {status === 'success' && (
                <Alert severity="success" sx={{ maxWidth: 500, mx: 'auto', mb: 2 }}>
                    Thanks! Check your email to confirm subscription.
                </Alert>
            )}
            {status === 'error' && (
                <Alert severity="error" sx={{ maxWidth: 500, mx: 'auto', mb: 2 }}>
                    Something went wrong. Please try again.
                </Alert>
            )}

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    gap: 2,
                    maxWidth: 500,
                    mx: 'auto',
                    flexDirection: { xs: 'column', sm: 'row' }
                }}
            >
                <TextField
                    fullWidth
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'loading'}
                    sx={{
                        bgcolor: 'white',
                        borderRadius: 1,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { border: 'none' }
                        }
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={status === 'loading'}
                    sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        minWidth: 150,
                        '&:hover': {
                            bgcolor: 'grey.100'
                        }
                    }}
                >
                    {status === 'loading' ? <CircularProgress size={24} /> : 'Subscribe'}
                </Button>
            </Box>

            <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.8 }}>
                We respect your privacy. Unsubscribe anytime.
            </Typography>
        </Box>
    );
}
