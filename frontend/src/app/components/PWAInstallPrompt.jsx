import { useState, useEffect } from 'react';
import { Box, Button, Card, IconButton, Stack, Typography } from '@mui/material';
import { Close as CloseIcon, GetApp as InstallIcon } from '@mui/icons-material';

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show prompt after 30 seconds (don't overwhelm on first visit)
            setTimeout(() => setShowPrompt(true), 30000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Don't show again for 7 days
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    // Don't show if already dismissed recently
    useEffect(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
            setShowPrompt(false);
        }
    }, []);

    if (!showPrompt || !deferredPrompt) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 9999,
                maxWidth: 400,
                animation: 'slideInUp 0.5s ease-out'
            }}
        >
            <Card
                sx={{
                    p: 3,
                    boxShadow: 6,
                    borderRadius: 2,
                    bgcolor: 'white',
                    border: '2px solid',
                    borderColor: 'primary.main'
                }}
            >
                <IconButton
                    onClick={handleDismiss}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    size="small"
                >
                    <CloseIcon />
                </IconButton>

                <Stack spacing={2}>
                    <InstallIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                        Install Arohan App
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Get instant access from your home screen. Works offline, faster load times, push notifications.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" fullWidth onClick={handleInstall}>
                            Install Now
                        </Button>
                        <Button variant="outlined" fullWidth onClick={handleDismiss}>
                            Not Now
                        </Button>
                    </Stack>
                </Stack>
            </Card>
        </Box>
    );
}
