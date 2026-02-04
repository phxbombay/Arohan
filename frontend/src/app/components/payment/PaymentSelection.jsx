import React, { useState } from 'react';
import {
    Card, CardContent, Typography, Radio, RadioGroup,
    FormControlLabel, Box, Button, CircularProgress, Divider
} from '@mui/material';
import { Google, AccountBalanceWallet, Smartphone, LocalShipping, QrCodeScanner } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'sonner';
import AntigravityQr from './AntigravityQr';

// Mock auth service if not available, or import actual one
// import authService from '../../services/authService';
const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

const PaymentSelection = ({ amount = 1, customerDetails, onSuccess, onError }) => {
    const [method, setMethod] = useState('gpay'); // Default to Option 1
    const [loading, setLoading] = useState(false);

    // 1. Load Razorpay Script Dynamically
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // 2. Handle "Pay Now" Click
    const handlePayment = async () => {
        setLoading(true);
        const currentUser = getCurrentUser();

        // Use passed customerDetails or fall back to current user
        const user = {
            id: currentUser?.id || 'guest',
            name: customerDetails?.name || currentUser?.name || 'Guest',
            email: customerDetails?.email || currentUser?.email || '',
            phone: customerDetails?.mobile || currentUser?.phone || ''
        };

        if (!user.email && !user.phone) {
            toast.error("Please provide contact details");
            setLoading(false);
            return;
        }

        // A. Cash on Delivery Flow
        if (method === 'cod') {
            try {
                await axios.post('/v1/orders/create-cod', {
                    amount,
                    userId: user.id
                });
                toast.success("Order Placed Successfully! Pay on delivery.");
                if (onSuccess) onSuccess({ method: 'COD', status: 'success' });
            } catch (err) {
                toast.error("This feature will be enabled soon");
                console.error(err);
                if (onError) onError(err);
            } finally {
                setLoading(false);
            }
            return;
        }

        // B. Online Payment Flow (Razorpay)
        toast.info("This feature will be enabled soon");
        setLoading(false);
        return;

        const res = await loadRazorpay();
        if (!res) {
            toast.error("This feature will be enabled soon");
            setLoading(false);
            return;
        }

        try {
            // Step 1: Create Order on Backend
            const result = await axios.post('/v1/orders/create', {
                amount: amount,
                currency: 'INR',
                paymentMethod: 'ONLINE',
                customerDetails: {
                    name: user.name,
                    mobile: user.phone,
                    email: user.email
                },
                items: [] // Add items if needed
            });

            const { order, razorpayKeyId } = result.data;
            const { amount: orderAmount, id: order_id, currency } = order;

            // Step 2: Configure Razorpay Options based on Selection
            let methodSpecificConfig = {};

            // OPTION 1: GOOGLE PAY SPECIFIC LOGIC
            if (method === 'gpay') {
                methodSpecificConfig = {
                    method: 'upi',            // Force UPI
                    upi_app_package_name: 'com.google.android.apps.nbu.paisa.user' // Android Intent for GPay
                };
            }
            // OPTION 2: PAYTM SPECIFIC
            else if (method === 'paytm') {
                methodSpecificConfig = {
                    method: 'wallet',
                    wallet: 'paytm'
                };
            }

            const options = {
                key: razorpayKeyId, // Use key from backend
                amount: orderAmount.toString(),
                currency: currency,
                name: "Arohan Health",
                description: `Purchase for ₹${amount}`,
                order_id: order_id,
                ...methodSpecificConfig, // Merge specific configs
                handler: async function (response) {
                    // Verify Payment
                    try {
                        const verifyRes = await axios.post('/v1/orders/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        if (verifyRes.data.success) {
                            toast.success("Payment Successful!");
                            if (onSuccess) onSuccess(verifyRes.data);
                        } else {
                            toast.error("Payment Verification Failed");
                            if (onError) onError(verifyRes.data);
                        }
                    } catch (verr) {
                        toast.error("Verification Error");
                        if (onError) onError(verr);
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone,
                    method: method === 'gpay' ? 'upi' : undefined // Pre-select UPI tab for GPay
                },
                theme: {
                    color: "#0ea5e9",
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        toast.info('Payment cancelled');
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error(err);
            toast.error("Payment initiation failed");
            if (onError) onError(err);
        } finally {
            setLoading(false);
        }
    };

    // Helper to get current user details for rendering
    const getCurrentUserDetails = () => {
        const currentUser = getCurrentUser();
        return {
            email: customerDetails?.email || currentUser?.email || 'guest@arohan.com'
        };
    };

    return (
        <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4, borderRadius: 3, boxShadow: 6 }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Select Payment Method
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Choose your preferred payment option
                </Typography>

                <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>

                    {/* OPTION 1: GOOGLE PAY */}
                    <PaymentOption
                        value="gpay"
                        title="Google Pay"
                        subtitle="Pay via Google Pay UPI"
                        badge="Instant"
                        icon={<Google sx={{ color: '#4285F4' }} />}
                        selected={method === 'gpay'}
                    />

                    {/* OPTION 2: SCAN QR (NEW) */}
                    <PaymentOption
                        value="qr_scan"
                        title="Scan QR to Pay"
                        subtitle="Use GPay, Paytm, PhonePe"
                        badge="New"
                        icon={<QrCodeScanner sx={{ color: '#1e84e9ff' }} />}
                        selected={method === 'qr_scan'}
                    />

                    {/* OPTION 3: PAYTM */}
                    <PaymentOption
                        value="paytm"
                        title="Paytm"
                        subtitle="Wallet & UPI"
                        badge="Popular"
                        icon={<AccountBalanceWallet sx={{ color: '#00BAF2' }} />}
                        selected={method === 'paytm'}
                    />

                    {/* OPTION 4: OTHER UPI */}
                    <PaymentOption
                        value="upi_other"
                        title="Other UPI"
                        subtitle="Navi, PhonePe, BHIM & more"
                        badge="Secure"
                        icon={<Smartphone sx={{ color: '#673AB7' }} />}
                        selected={method === 'upi_other'}
                    />

                    <Divider sx={{ my: 2 }} />

                    {/* OPTION 5: COD */}
                    <PaymentOption
                        value="cod"
                        title="Cash on Delivery"
                        subtitle="Pay when you receive"
                        badge="No Risk"
                        icon={<LocalShipping sx={{ color: '#F57C00' }} />}
                        selected={method === 'cod'}
                    />

                </RadioGroup>

                <Box mt={4}>
                    {method === 'qr_scan' ? (
                        <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
                            <Typography variant="subtitle2" align="center" sx={{ mb: 2, color: 'text.secondary' }}>
                                Scan this QR code with any UPI App
                            </Typography>
                            <Box sx={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                                <AntigravityQr
                                    amount={amount}
                                    email={getCurrentUserDetails().email}
                                    onSuccess={(data) => {
                                        toast.success("Payment Received!");
                                        if (onSuccess) onSuccess({ ...data, method: 'QR' });
                                    }}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                            onClick={handlePayment}
                            sx={{
                                bgcolor: method === 'cod' ? '#F57C00' : '#0ea5e9',
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> :
                                method === 'cod' ? 'Place COD Order' : `Pay ₹${amount}`}
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

// Reusable Option Sub-Component
const PaymentOption = ({ value, title, subtitle, badge, icon, selected }) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            mb: 1.5,
            border: selected ? '2px solid #0ea5e9' : '1px solid #e0e0e0',
            borderRadius: 2,
            bgcolor: selected ? '#f0f9ff' : 'white',
            cursor: 'pointer',
            transition: 'all 0.2s'
        }}
    >
        <FormControlLabel
            value={value}
            control={<Radio size="small" />}
            label=""
            sx={{ mr: 1, m: 0 }}
        />
        <Box sx={{ mr: 2, display: 'flex' }}>{icon}</Box>
        <Box sx={{ flexGrow: 1 }}>
            <Box display="flex" alignItems="center">
                <Typography fontWeight="bold" variant="body1">{title}</Typography>
                {badge && (
                    <Box
                        component="span"
                        sx={{
                            ml: 1,
                            fontSize: '0.65rem',
                            bgcolor: badge === 'Instant' ? '#dcfce7' : '#f3f4f6',
                            color: badge === 'Instant' ? '#166534' : '#4b5563',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}
                    >
                        {badge}
                    </Box>
                )}
            </Box>
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
        </Box>
    </Box>
);

export default PaymentSelection;
