import { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Box,
    TextField,
    Alert,
    Chip,
    IconButton,
    Divider
} from '@mui/material';
import {
    Shield as ShieldIcon,
    Lock as LockIcon,
    CheckCircle as CheckCircleIcon,
    Phone as PhoneIcon,
    CurrencyRupee as RupeeIcon
} from '@mui/icons-material';
import axios from 'axios';

export function PhonePePaymentCard({ amount, onSuccess, onError, orderDetails = {} }) {
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');

    const handlePayment = async () => {
        // Validation
        if (!mobile || mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        if (!amount || amount < 1) {
            setError('Invalid payment amount');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Call backend to initiate payment
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/phonepe/pay`, {
                amount: amount,
                mobile: mobile,
                userName: orderDetails.userName || 'Guest User',
                userId: orderDetails.userId || null,
                orderId: orderDetails.orderId || null
            });

            if (response.data.success && response.data.data.redirectUrl) {
                // Store transaction ID in localStorage for status check
                localStorage.setItem('phonepe_txn_id', response.data.data.transactionId);

                // Redirect to PhonePe payment page
                window.location.href = response.data.data.redirectUrl;
            } else {
                setError(response.data.message || 'Payment initiation failed');
                setLoading(false);
                if (onError) onError(response.data);
            }
        } catch (err) {
            console.error('Payment Error:', err);
            setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
            setLoading(false);
            if (onError) onError(err);
        }
    };

    return (
        <Card
            elevation={16}
            sx={{
                maxWidth: 500,
                mx: 'auto',
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
                position: 'relative',
                overflow: 'visible',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.15)'
                }
            }}
        >
            {/* Floating Security Badge */}
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
                Verified Secure
            </Box>

            <CardContent sx={{ p: 4 }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        PhonePe Payment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Fast, secure & trusted by millions
                    </Typography>
                </Box>

                {/* Amount Display */}
                <Box
                    sx={{
                        bgcolor: 'primary.50',
                        borderRadius: 3,
                        p: 3,
                        mb: 3,
                        textAlign: 'center',
                        border: '2px dashed',
                        borderColor: 'primary.main'
                    }}
                >
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Total Amount
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <RupeeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h3" fontWeight="bold" color="primary.main">
                            {amount?.toFixed(2) || '0.00'}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Mobile Number Input */}
                <TextField
                    fullWidth
                    label="Mobile Number"
                    placeholder="Enter 10-digit mobile number"
                    value={mobile}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setMobile(value);
                        setError('');
                    }}
                    variant="outlined"
                    disabled={loading}
                    InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />,
                        sx: {
                            borderRadius: 2,
                            '& fieldset': {
                                borderWidth: 2
                            }
                        }
                    }}
                    sx={{ mb: 2 }}
                />

                {/* Error Message */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Pay Button with Gradient */}
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handlePayment}
                    disabled={loading || !mobile || mobile.length !== 10}
                    sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #5f259f 0%, #3b0088 100%)',
                        boxShadow: '0 8px 24px rgba(95, 37, 159, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4a1c7d 0%, #2e006b 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 32px rgba(95, 37, 159, 0.5)'
                        },
                        '&:disabled': {
                            background: '#ccc',
                            boxShadow: 'none'
                        }
                    }}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={24} sx={{ color: 'white' }} />
                            <span>Processing...</span>
                        </Box>
                    ) : (
                        `Pay ₹${amount?.toFixed(2) || '0.00'}`
                    )}
                </Button>

                {/* Security Features */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                        icon={<LockIcon />}
                        label="256-bit Encrypted"
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    />
                    <Chip
                        icon={<CheckCircleIcon />}
                        label="PCI DSS Compliant"
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    />
                </Box>

                {/* PhonePe Logo/Text */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        Powered by <strong style={{ color: '#5f259f' }}>PhonePe</strong>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
