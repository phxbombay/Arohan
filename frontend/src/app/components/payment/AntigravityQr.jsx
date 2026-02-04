import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import { CheckCircle, Shield } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'sonner';

const AntigravityQr = ({ amount = 1, email = "user@example.com", onSuccess }) => {
    const [qrData, setQrData] = useState(null);
    const [status, setStatus] = useState('loading'); // loading | waiting | success
    const pollInterval = useRef(null);

    // 1. Generate QR on Load
    useEffect(() => {
        const generate = async () => {
            try {
                const res = await axios.post('/v1/orders/create-qr', { amount, user_email: email });
                if (res.data.success) {
                    setQrData(res.data);
                    setStatus('waiting');
                } else {
                    setStatus('error');
                    toast.info('This feature will be enabled soon');
                }
            } catch (err) {
                console.error("QR Failed", err);
                setStatus('error');
                toast.info('This feature will be enabled soon');
            }
        };
        generate();

        return () => clearInterval(pollInterval.current);
    }, [amount, email]);

    // 2. Polling Logic (The "Listening" Part)
    useEffect(() => {
        if (status === 'waiting' && qrData?.qr_id) {
            pollInterval.current = setInterval(async () => {
                try {
                    // Note: using /v1/orders/check-qr/:qrId based on routes
                    const res = await axios.get(`/v1/orders/check-qr/${qrData.qr_id}`);

                    if (res.data.status === 'PAID') {
                        clearInterval(pollInterval.current);
                        setStatus('success');
                        setTimeout(() => onSuccess && onSuccess(), 2000); // Redirect or callback after 2s
                    }
                } catch (err) {
                    console.error("Poll Error");
                }
            }, 2000); // Check every 2 seconds
        }
    }, [status, qrData, onSuccess]);

    return (
        <Box
            sx={{
                position: 'relative',
                width: 320,
                mx: 'auto',
                p: 4,
                borderRadius: 4,
                textAlign: 'center',
                // GLASSMORPHISM STYLES
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // Deep shadow for floating effect
                transform: status === 'success' ? 'scale(1.05)' : 'translateY(0)',
                transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
        >
            {/* Header */}
            <Typography variant="h6" fontWeight="bold" color="text.primary">
                Scan to Pay
            </Typography>
            <Typography variant="h3" fontWeight="800" sx={{ my: 1, background: '-webkit-linear-gradient(45deg, #0ea5e9, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ₹{amount}
            </Typography>

            {/* Dynamic Content Area */}
            <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>

                {status === 'loading' && <CircularProgress size={50} thickness={4} sx={{ color: '#0ea5e9' }} />}

                {status === 'error' && <Typography color="text.secondary">This feature will be enabled soon</Typography>}

                {status === 'waiting' && qrData && (
                    <Fade in={true}>
                        <img
                            src={qrData.image_url}
                            alt="UPI QR"
                            style={{ width: '100%', borderRadius: 12, border: '4px solid white' }}
                        />
                    </Fade>
                )}

                {status === 'success' && (
                    <Fade in={true}>
                        <Box>
                            <CheckCircle sx={{ fontSize: 80, color: '#22c55e', mb: 2 }} />
                            <Typography variant="h6" fontWeight="bold">Payment Received!</Typography>
                            <Typography variant="body2" color="text.secondary">Order Confirmed</Typography>
                        </Box>
                    </Fade>
                )}
            </Box>

            {/* Footer */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.7 }}>
                <Shield sx={{ fontSize: 16, color: '#64748b' }} />
                <Typography variant="caption" fontWeight="bold" color="text.secondary">
                    100% Secure via Razorpay UPI
                </Typography>
            </Box>

            {/* Supported Apps Text */}
            <Typography variant="caption" display="block" sx={{ mt: 2, color: '#94a3b8' }}>
                Works with GPay, PhonePe, Paytm, Navi
            </Typography>
        </Box>
    );
};

export default AntigravityQr;
