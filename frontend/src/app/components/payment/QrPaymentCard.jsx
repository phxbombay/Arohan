import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { CheckCircle as CheckIcon } from '@mui/icons-material';

const QrPaymentCard = ({ amount, email }) => {
    const [qrImage, setQrImage] = useState(null);
    const [status, setStatus] = useState('loading'); // loading, waiting, success, error

    useEffect(() => {
        // Generate QR on mount
        const generateQr = async () => {
            try {
                const res = await axios.post('/v1/orders/create-qr', {
                    amount,
                    user_email: email
                });

                if (res.data.success) {
                    setQrImage(res.data.image_url);
                    setStatus('waiting');
                } else {
                    setStatus('error');
                }
            } catch (err) {
                console.error("This feature will be enabled soon:", err);
                setStatus('error');
            }
        };
        generateQr();
    }, [amount, email]);

    return (
        <Card
            sx={{
                maxWidth: 400,
                m: 'auto',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)', // Antigravity shadow
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    animation: 'rotate 20s linear infinite',
                },
                '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                }
            }}
        >
            <CardContent sx={{ textAlign: 'center', p: 4, position: 'relative', zIndex: 1 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="white" sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                    Scan to Pay
                </Typography>
                <Typography variant="h3" fontWeight="900" color="white" sx={{ mb: 3, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                    ₹{amount}
                </Typography>

                <Box
                    sx={{
                        my: 3,
                        minHeight: 280,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'white',
                        borderRadius: 3,
                        p: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    {status === 'loading' ? (
                        <>
                            <CircularProgress sx={{ color: '#667eea' }} size={60} />
                            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                                Generating QR Code...
                            </Typography>
                        </>
                    ) : status === 'error' ? (
                        <Typography variant="h6" color="error">
                            Failed to generate QR code
                        </Typography>
                    ) : status === 'success' ? (
                        <Box sx={{ textAlign: 'center' }}>
                            <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                            <Typography variant="h5" color="success.main" fontWeight="bold">
                                Payment Successful! ✅
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Thank you for your payment
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <img
                                src={qrImage}
                                alt="Scan QR Code"
                                style={{
                                    width: '100%',
                                    maxWidth: 250,
                                    borderRadius: 10,
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', fontWeight: 500 }}>
                                Scan with any UPI app
                            </Typography>
                        </>
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Box
                        component="img"
                        src="https://upload.wikimedia.org/wikipedia/commons/f/fa/GPay_Logo.svg"
                        alt="GPay"
                        sx={{ height: 24, opacity: 0.9 }}
                    />
                    <Box
                        component="img"
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b6/PhonePe_Logo.svg"
                        alt="PhonePe"
                        sx={{ height: 24, opacity: 0.9 }}
                    />
                    <Box
                        component="img"
                        src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo.svg"
                        alt="Paytm"
                        sx={{ height: 20, opacity: 0.9, mt: 0.5 }}
                    />
                </Box>

                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', mt: 2, display: 'block' }}>
                    QR code expires in 15 minutes • Single use only
                </Typography>
            </CardContent>
        </Card>
    );
};

export default QrPaymentCard;
