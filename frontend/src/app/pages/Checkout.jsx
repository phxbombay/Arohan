import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    Paper,
    Button
} from '@mui/material';
import { PhonePePaymentCard } from '../components/PhonePePaymentCard';
import { ArrowBack as BackIcon } from '@mui/icons-material';

export function Checkout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const amount = parseFloat(searchParams.get('amount') || '0');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin', { state: { from: location.pathname + location.search } });
        }
    }, [isAuthenticated, navigate, location]);

    const handlePaymentSuccess = (data) => {
        console.log('Payment successful:', data);
        // Additional success handling if needed
    };

    const handlePaymentError = (error) => {
        console.error('Payment error:', error);
        // Additional error handling if needed
    };

    if (amount <= 0) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8 }}>
                <Container maxWidth="sm">
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Invalid Amount
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Please add items to your cart before checkout.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/shop')}
                        >
                            Go to Shop
                        </Button>
                    </Paper>
                </Container>
            </Box >
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8 }}>
            <Container>
                {/* Back Button */}
                <Button
                    startIcon={<BackIcon />}
                    onClick={() => navigate('/shop')}
                    sx={{ mb: 4 }}
                >
                    Back to Cart
                </Button>

                <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 6 }}>
                    Secure Checkout
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {/* Order Summary */}
                    <Grid item xs={12} md={5}>
                        <Card elevation={4} sx={{ borderRadius: 3, position: 'sticky', top: 20 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Order Summary
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Order Total:
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                                        ₹{amount.toFixed(2)}
                                    </Typography>
                                </Box>

                                <Paper elevation={0} sx={{ bgcolor: 'success.50', p: 2, borderRadius: 2, mt: 3 }}>
                                    <Typography variant="caption" color="success.dark" display="block" gutterBottom>
                                        ✓ Secure SSL encrypted payment
                                    </Typography>
                                    <Typography variant="caption" color="success.dark" display="block">
                                        ✓ 100% safe and secure transactions
                                    </Typography>
                                </Paper>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Payment Card */}
                    <Grid item xs={12} md={7}>
                        <PhonePePaymentCard
                            amount={amount}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                            orderDetails={{
                                userName: 'Customer',
                                orderId: `ORD_${Date.now()}`
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
