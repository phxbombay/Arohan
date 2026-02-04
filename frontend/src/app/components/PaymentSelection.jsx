import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Chip
} from '@mui/material';
import {
    Google as GoogleIcon,
    AccountBalanceWallet as PaytmIcon,
    Payment as UPIIcon,
    LocalShipping as CODIcon,
    CheckCircle as CheckIcon,
    Shield as ShieldIcon
} from '@mui/icons-material';
import axios from 'axios';

export function PaymentSelection({ amount, customerDetails, items, onSuccess, onError }) {
    const [selectedMethod, setSelectedMethod] = useState('google_pay');
    const [loading, setLoading] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const paymentMethods = [
        {
            id: 'google_pay',
            label: 'Google Pay',
            icon: <GoogleIcon sx={{ fontSize: 40, color: '#4285F4' }} />,
            description: 'Pay via Google Pay UPI',
            badge: 'Instant'
        },
        {
            id: 'paytm',
            label: 'Paytm',
            icon: <PaytmIcon sx={{ fontSize: 40, color: '#00B9F5' }} />,
            description: 'Wallet & UPI',
            badge: 'Popular'
        },
        {
            id: 'upi',
            label: 'Other UPI',
            icon: <UPIIcon sx={{ fontSize: 40, color: '#6C63FF' }} />,
            description: 'Navi, PhonePe, BHIM & more',
            badge: 'Secure'
        },
        {
            id: 'cod',
            label: 'Cash on Delivery',
            icon: <CODIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
            description: 'Pay when you receive',
            badge: 'No Risk'
        }
    ];

    const handlePayment = async () => {
        setLoading(true);

        try {
            // Handle Cash on Delivery
            if (selectedMethod === 'cod') {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders/create`, {
                    amount: amount,
                    currency: 'INR',
                    paymentMethod: 'COD',
                    customerDetails: customerDetails,
                    items: items
                });

                if (response.data.success) {
                    setLoading(false);
                    if (onSuccess) onSuccess(response.data);
                    alert('Order placed successfully! You will pay on delivery.');
                } else {
                    setLoading(false);
                    if (onError) onError(response.data);
                    alert('Failed to place order. Please try again.');
                }
                return;
            }

            // Handle Online Payment (GPay, Paytm, UPI)
            if (!razorpayLoaded) {
                alert('Payment system loading... Please try again in a moment.');
                setLoading(false);
                return;
            }

            // Create order in backend
            const orderResponse = await axios.post(`${import.meta.env.VITE_API_URL}/orders/create`, {
                amount: amount,
                currency: 'INR',
                paymentMethod: 'ONLINE',
                customerDetails: customerDetails,
                items: items
            });

            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.message || 'Failed to create order');
            }

            const { order, razorpayKeyId } = orderResponse.data;

            // Razorpay checkout options
            const options = {
                key: razorpayKeyId,
                amount: order.amount,
                currency: order.currency,
                name: 'Arohan Health',
                description: 'Health Monitoring Devices',
                order_id: order.id,
                prefill: {
                    name: customerDetails.name,
                    email: customerDetails.email || '',
                    contact: customerDetails.mobile
                },
                theme: {
                    color: '#1976d2'
                },
                handler: async function (paymentResponse) {
                    try {
                        // Verify payment with backend
                        const verifyResponse = await axios.post(`${import.meta.env.VITE_API_URL}/orders/verify`, {
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature
                        });

                        setLoading(false);

                        if (verifyResponse.data.success) {
                            if (onSuccess) onSuccess(verifyResponse.data);
                            alert('Payment successful! Your order is confirmed.');
                        } else {
                            if (onError) onError(verifyResponse.data);
                            alert('Payment verification failed.');
                        }
                    } catch (error) {
                        setLoading(false);
                        console.error('Verification error:', error);
                        if (onError) onError(error);
                        alert('Error verifying payment. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        alert('Payment cancelled');
                    }
                }
            };

            // Open Razorpay checkout
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            setLoading(false);
            console.error('Payment Error:', error);
            if (onError) onError(error);
            alert(error.message || 'Payment failed. Please try again.');
        }
    };

    const getButtonText = () => {
        if (selectedMethod === 'cod') {
            return 'Place COD Order';
        }
        return `Pay ₹${amount?.toFixed(2) || '0.00'}`;
    };

    return (
        <Card
            elevation={16}
            sx={{
                maxWidth: 600,
                mx: 'auto',
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                overflow: 'visible',
                position: 'relative'
            }}
        >
            {/* Security Badge */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -16,
                    right: 20,
                    bgcolor: 'success.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                }}
            >
                <ShieldIcon sx={{ fontSize: 16 }} />
                100% Secure
            </Box>

            <CardContent sx={{ p: 4 }}>
                {/* Header */}
                <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                    Select Payment Method
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    Choose your preferred payment option
                </Typography>

                {/* Payment Methods */}
                <RadioGroup value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {paymentMethods.map((method) => (
                            <Paper
                                key={method.id}
                                elevation={selectedMethod === method.id ? 8 : 2}
                                sx={{
                                    p: 2,
                                    border: 2,
                                    borderColor: selectedMethod === method.id ? 'primary.main' : 'grey.200',
                                    borderRadius: 3,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6,
                                        borderColor: 'primary.light'
                                    }
                                }}
                                onClick={() => setSelectedMethod(method.id)}
                            >
                                <FormControlLabel
                                    value={method.id}
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                            <Box>{method.icon}</Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {method.label}
                                                    </Typography>
                                                    <Chip
                                                        label={method.badge}
                                                        size="small"
                                                        color="primary"
                                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                                    />
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    {method.description}
                                                </Typography>
                                            </Box>
                                            {selectedMethod === method.id && (
                                                <CheckIcon color="primary" sx={{ fontSize: 28 }} />
                                            )}
                                        </Box>
                                    }
                                    sx={{ m: 0, width: '100%' }}
                                />
                            </Paper>
                        ))}
                    </Box>
                </RadioGroup>

                <Divider sx={{ my: 3 }} />

                {/* Amount Display */}
                <Box sx={{ bgcolor: 'grey.100', borderRadius: 2, p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight="bold">
                            Total Amount:
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary.main">
                            ₹{amount?.toFixed(2) || '0.00'}
                        </Typography>
                    </Box>
                </Box>

                {/* Payment Button */}
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handlePayment}
                    disabled={loading}
                    sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: 3,
                        background: selectedMethod === 'cod'
                            ? 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
                            : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 32px rgba(25, 118, 210, 0.5)'
                        }
                    }}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={24} sx={{ color: 'white' }} />
                            <span>Processing...</span>
                        </Box>
                    ) : (
                        getButtonText()
                    )}
                </Button>

                {/* Trust Indicators */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                        icon={<ShieldIcon />}
                        label="Bank-level Security"
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    />
                    <Chip
                        icon={<CheckIcon />}
                        label="PCI DSS Certified"
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    />
                </Box>

                {/* Razorpay Branding */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        Powered by <strong>Razorpay</strong>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
