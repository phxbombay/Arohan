import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Slide } from '@mui/material';
import { Cookie as CookieIcon } from '@mui/icons-material';

export const CookieConsent = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('arohan_cookie_consent');
        if (!consent) {
            setOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('arohan_cookie_consent', 'true');
        setOpen(false);
    };

    const handleDecline = () => {
        localStorage.setItem('arohan_cookie_consent', 'false');
        setOpen(false);
    };

    return (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
            <Paper
                elevation={6}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1300,
                    p: 3,
                    m: { xs: 0, md: 2 },
                    borderRadius: { xs: 0, md: 2 },
                    bgcolor: 'background.paper',
                    borderTop: '4px solid',
                    borderColor: 'primary.main',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 2,
                    maxWidth: { md: '1200px' },
                    mx: { md: 'auto' }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <CookieIcon color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            We value your privacy
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts.
                            By clicking "Accept", you consent to our use of cookies.
                            <br />
                            <Button href="/privacy" sx={{ p: 0, textTransform: 'none', minWidth: 'auto' }}>
                                Read our Privacy Policy
                            </Button>.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, minWidth: { md: '300px' }, justifyContent: 'flex-end', width: { xs: '100%', md: 'auto' } }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleDecline}
                        fullWidth
                    >
                        Decline
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAccept}
                        fullWidth
                    >
                        Accept
                    </Button>
                </Box>
            </Paper>
        </Slide>
    );
};
