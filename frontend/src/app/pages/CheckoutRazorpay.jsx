import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    Paper,
    Button,
    TextField
} from '@mui/material';
import PaymentSelection from '../components/payment/PaymentSelection';
import { ArrowBack as BackIcon } from '@mui/icons-material';

import { useAuth } from '../../features/auth/hooks/useAuth';

export function CheckoutRazorpay() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const amount = parseFloat(searchParams.get('amount') || '0');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin', { state: { from: location.pathname + location.search } });
        }
    }, [isAuthenticated, navigate, location]);

    useEffect(() => {
        if (user) {
            setCustomerDetails(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                mobile: user.contact || user.phone || ''
            }));
        }
    }, [user]);

    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        email: '',
        mobile: '',
        address: {
            street: '',
            landmark: '',
            city: '',
            state: '',
            pincode: ''
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle nested address fields
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setCustomerDetails({
                ...customerDetails,
                address: {
                    ...customerDetails.address,
                    [addressField]: value
                }
            });
        } else {
            setCustomerDetails({
                ...customerDetails,
                [name]: value
            });
        }
    };

    const handlePaymentSuccess = (data) => {
        console.log('Payment successful:', data);
        navigate('/payment/success');
    };

    const handlePaymentError = (error) => {
        console.error('Payment error:', error);
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
            </Box>
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
                    {/* Customer Details */}
                    <Grid item xs={12} md={5}>
                        <Card elevation={4} sx={{ borderRadius: 3, mb: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Contact Information
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Full Name *"
                                        name="name"
                                        value={customerDetails.name}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        placeholder="Enter your full name"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Mobile Number *"
                                        name="mobile"
                                        value={customerDetails.mobile}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        placeholder="10-digit mobile number"
                                        inputProps={{ maxLength: 10 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email (Optional)"
                                        name="email"
                                        type="email"
                                        value={customerDetails.email}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        placeholder="your.email@example.com"
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        <Card elevation={4} sx={{ borderRadius: 3, mb: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Delivery Address
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Street Address / House No. *"
                                        name="address.street"
                                        value={customerDetails.address.street}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        placeholder="House no., Building name, Street"
                                        multiline
                                        rows={2}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Landmark (Optional)"
                                        name="address.landmark"
                                        value={customerDetails.address.landmark}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        placeholder="Nearby landmark for easy delivery"
                                    />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="City *"
                                                name="address.city"
                                                value={customerDetails.address.city}
                                                onChange={handleInputChange}
                                                required
                                                variant="outlined"
                                                placeholder="City name"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="State *"
                                                name="address.state"
                                                value={customerDetails.address.state}
                                                onChange={handleInputChange}
                                                required
                                                variant="outlined"
                                                placeholder="State name"
                                            />
                                        </Grid>
                                    </Grid>
                                    <TextField
                                        fullWidth
                                        label="Pincode *"
                                        name="address.pincode"
                                        value={customerDetails.address.pincode}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        placeholder="6-digit pincode"
                                        inputProps={{ maxLength: 6 }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        <Card elevation={4} sx={{ borderRadius: 3 }}>
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

                    {/* Payment Selection */}
                    <Grid item xs={12} md={7}>
                        <PaymentSelection
                            amount={amount}
                            customerDetails={customerDetails}
                            items={[]} // Pass cart items here
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
