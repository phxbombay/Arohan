import React from 'react';
import { Shield as ShieldIcon, Info as InfoIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Box, Container, Typography, Paper, Grid, Card, CardContent } from '@mui/material';

export function Cookies() {
    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'grey.50', py: 8 }}>
            <Container>
                <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
                    <Box sx={{ bgcolor: 'error.main', px: 4, py: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: 1 }}>
                            <ShieldIcon sx={{ fontSize: 32, color: 'common.white' }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" color="common.white">Cookie Policy</Typography>
                    </Box>

                    <Box sx={{ p: { xs: 4, md: 6 } }}>
                        <Typography variant="body1" color="text.secondary" gutterBottom>Last updated: January 2026</Typography>

                        <Typography paragraph color="text.secondary">
                            At Arohan ("we", "us", or "our"), we use cookies and similar tracking technologies to improve your experience on our platform. This policy explains what cookies are, how we use them, and your choices regarding their use.
                        </Typography>

                        <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2, border: 1, borderColor: 'grey.200', mb: 6 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <InfoIcon color="error" /> What are Cookies?
                            </Typography>
                            <Typography variant="body2">
                                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They allow the website to recognize your device and remember your preferences, login details, and other information to make your visit smoother and more personalized.
                            </Typography>
                        </Box>

                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>How We Use Cookies</Typography>
                        <Grid container spacing={3} sx={{ mb: 6 }}>
                            {[
                                { title: "Essential Cookies", desc: "Strictly necessary for functionality like navigation and secure login. The site cannot function without these." },
                                { title: "Performance & Analytics", desc: "Help us understand how visitors interact with our website to improve performance and user experience." },
                                { title: "Functional Cookies", desc: "Remember choices like username, language, or region for a personalized experience." },
                                { title: "Marketing Cookies", desc: "Deliver relevant advertisements and track browsing habits for targeted marketing." }
                            ].map((item, i) => (
                                <Grid item xs={12} md={6} key={i}>
                                    <Card variant="outlined" sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" fontWeight="bold" color="error.main" gutterBottom>{item.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Typography variant="h5" fontWeight="bold" gutterBottom>Managing Your Preferences</Typography>
                        <Typography paragraph color="text.secondary">
                            Most web browsers allow you to control cookies through preferences. Limiting cookies may worsen your user experience and stop you from saving settings.
                        </Typography>

                        <Box sx={{ bgcolor: 'primary.50', color: 'info.contrastText', p: 3, borderRadius: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <CheckCircleIcon color="primary" />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">Your Choice</Typography>
                                <Typography variant="body2" color="primary.dark">
                                    By using our website, you agree to the use of cookies as described in this policy. You can change your cookie settings at any time in your browser settings.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
