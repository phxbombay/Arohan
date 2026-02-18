import React from 'react';
import { Container, Typography, Grid, Box, Paper, Divider } from '@mui/material';
import PaymentSelection from '../components/payment/PaymentSelection';
import AntigravityQr from '../components/payment/AntigravityQr';

export function PaymentDemo() {
    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100dvh', py: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" fontWeight="800" align="center" gutterBottom>
                    New Payment Integrations
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 8 }}>
                    Demonstrating both payment methods as requested
                </Typography>

                <Grid container spacing={6}>
                    {/* Method 1: Payment Selection */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 4, borderRadius: 4, height: '100%' }}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" fontWeight="bold" color="primary">
                                    Method 1: Payment Selection
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Prioritizes Google Pay, standard Razorpay popup, and COD.
                                </Typography>
                            </Box>

                            <PaymentSelection amount={1} />
                        </Paper>
                    </Grid>

                    {/* Method 2: Antigravity QR */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                height: '100%',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                            }}
                        >
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" fontWeight="bold" sx={{ color: '#6366f1' }}>
                                    Method 2: Antigravity QR
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Floating glassmorphism card with auto-polling. No popup.
                                </Typography>
                            </Box>

                            <Box sx={{ py: 4 }}>
                                <AntigravityQr
                                    amount={1}
                                    email="demo@arohan.com"
                                    onSuccess={() => alert('Payment Successful!')}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
