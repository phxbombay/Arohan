import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    HourglassEmpty as PendingIcon
} from '@mui/icons-material';
import axios from 'axios';

export function PaymentStatus() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, failed, pending
    const [paymentData, setPaymentData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        checkPaymentStatus();
    }, []);

    const checkPaymentStatus = async () => {
        try {
            // Get transaction ID from URL or localStorage
            const txnId = searchParams.get('txnId') || localStorage.getItem('phonepe_txn_id');

            if (!txnId) {
                setStatus('failed');
                setError('Transaction ID not found');
                return;
            }

            // Call backend to check status
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/phonepe/status/${txnId}`);

            if (response.data.success) {
                const paymentStatus = response.data.data.status;

                setPaymentData(response.data.data);

                // Map PhonePe status to our status
                if (paymentStatus === 'PAYMENT_SUCCESS') {
                    setStatus('success');
                    localStorage.removeItem('phonepe_txn_id');
                } else if (paymentStatus === 'PAYMENT_ERROR' || paymentStatus === 'PAYMENT_DECLINED') {
                    setStatus('failed');
                } else {
                    setStatus('pending');
                }
            } else {
                setStatus('failed');
                setError(response.data.message || 'Payment verification failed');
            }
        } catch (err) {
            console.error('Status Check Error:', err);
            setStatus('failed');
            setError(err.response?.data?.message || 'Failed to verify payment status');
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'success':
                return <SuccessIcon sx={{ fontSize: 80, color: 'success.main' }} />;
            case 'failed':
                return <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />;
            case 'pending':
                return <PendingIcon sx={{ fontSize: 80, color: 'warning.main' }} />;
            default:
                return <CircularProgress size={80} />;
        }
    };

    const getStatusTitle = () => {
        switch (status) {
            case 'success':
                return 'Payment Successful!';
            case 'failed':
                return 'Payment Failed';
            case 'pending':
                return 'Payment Pending';
            default:
                return 'Verifying Payment...';
        }
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'success':
                return 'Your payment has been processed successfully. Thank you for your purchase!';
            case 'failed':
                return error || 'Your payment could not be processed. Please try again.';
            case 'pending':
                return 'Your payment is being processed. Please wait for confirmation.';
            default:
                return 'Please wait while we verify your payment status...';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'success':
                return 'success.light';
            case 'failed':
                return 'error.light';
            case 'pending':
                return 'warning.light';
            default:
                return 'grey.100';
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8 }}>
            <Container maxWidth="sm">
                <Card
                    elevation={12}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        textAlign: 'center'
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: getStatusColor(),
                            py: 4,
                            borderBottom: '4px solid',
                            borderColor: status === 'success' ? 'success.main' : status === 'failed' ? 'error.main' : 'warning.main'
                        }}
                    >
                        {getStatusIcon()}
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {getStatusTitle()}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            {getStatusMessage()}
                        </Typography>

                        {paymentData && status === 'success' && (
                            <Box sx={{ bgcolor: 'grey.100', borderRadius: 2, p: 3, mb: 3, textAlign: 'left' }}>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                    Transaction Details
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Transaction ID:</Typography>
                                    <Typography variant="body2" fontWeight="bold">{paymentData.transactionId}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Amount Paid:</Typography>
                                    <Typography variant="body2" fontWeight="bold" color="success.main">
                                        ₹{paymentData.amount?.toFixed(2)}
                                    </Typography>
                                </Box>
                                {paymentData.paymentInstrument && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Payment Method:</Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            {paymentData.paymentInstrument.type}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/')}
                                sx={{ borderRadius: 2, px: 4 }}
                            >
                                Go to Home
                            </Button>
                            {status === 'failed' && (
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/shop')}
                                    sx={{ borderRadius: 2, px: 4 }}
                                >
                                    Try Again
                                </Button>
                            )}
                            {status === 'success' && (
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/products')}
                                    sx={{ borderRadius: 2, px: 4 }}
                                >
                                    Continue Shopping
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
