import { useState, useEffect } from 'react';
import { Box, Button, Paper, Stack, Typography, Checkbox, FormControlLabel, Link as MuiLink } from '@mui/material';
import { Close as XIcon, Cookie as CookieIcon } from '@mui/icons-material';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true, // Always enabled
        analytics: false,
        marketing: false
    });

    useEffect(() => {
        const consent = localStorage.getItem('arohan-cookie-consent');
        if (!consent) {
            // Show banner after 2 seconds
            setTimeout(() => setIsVisible(true), 2000);
        } else {
            const saved = JSON.parse(consent);
            setPreferences(saved);
            if (saved.analytics) {
                // Initialize Google Analytics
                window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
            }
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted = { essential: true, analytics: true, marketing: true };
        savePreferences(allAccepted);
    };

    const handleAcceptSelected = () => {
        savePreferences(preferences);
    };

    const handleRejectAll = () => {
        savePreferences({ essential: true, analytics: false, marketing: false });
    };

    const savePreferences = (prefs) => {
        localStorage.setItem('arohan-cookie-consent', JSON.stringify(prefs));
        localStorage.setItem('arohan-cookie-consent-date', new Date().toISOString());
        setIsVisible(false);

        // Update analytics consent
        if (prefs.analytics) {
            window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
        }
    };

    if (!isVisible) return null;

    return (
        <Paper
            elevation={8}
            sx={{
                position: 'fixed',
                bottom: 16,
                left: 16,
                right: 16,
                maxWidth: 500,
                p: 3,
                zIndex: 9999,
                border: '2px solid',
                borderColor: 'primary.main',
                '@media (min-width: 600px)': {
                    left: 'auto',
                    right: 24,
                    bottom: 24
                }
            }}
        >
            <Box sx={{ display: 'flex', gap: 2 }}>
                <CookieIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        We Value Your Privacy
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                        Your health data is never shared without consent.
                    </Typography>

                    <Stack spacing={1} sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={<Checkbox checked={preferences.essential} disabled />}
                            label={<Typography variant="body2"><strong>Essential</strong> - Required for site functionality</Typography>}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={preferences.analytics}
                                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                />
                            }
                            label={<Typography variant="body2"><strong>Analytics</strong> - Help us improve our service</Typography>}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={preferences.marketing}
                                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                                />
                            }
                            label={<Typography variant="body2"><strong>Marketing</strong> - Personalized content and offers</Typography>}
                        />
                    </Stack>

                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                        Read our <MuiLink href="/privacy" underline="hover" sx={{ color: 'primary.main' }}>Privacy Policy</MuiLink> and{' '}
                        <MuiLink href="/terms" underline="hover" sx={{ color: 'primary.main' }}>Terms of Service</MuiLink>
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <Button variant="contained" size="small" onClick={handleAcceptAll} fullWidth>
                            Accept All
                        </Button>
                        <Button variant="outlined" size="small" onClick={handleAcceptSelected} fullWidth>
                            Save Preferences
                        </Button>
                        <Button variant="text" size="small" onClick={handleRejectAll} fullWidth>
                            Reject Non-Essential
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Paper>
    );
}
