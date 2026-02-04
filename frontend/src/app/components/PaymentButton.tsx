import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
// @ts-ignore
import { useAuth } from '../../features/auth/hooks/useAuth';

const loadScript = (src: string) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

interface PaymentButtonProps {
    amount: number; // in INR
    onSuccess?: (paymentId: string) => void;
    onError?: (error: any) => void;
}

export function PaymentButton({ amount, onSuccess, onError }: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const { user, token } = useAuth();

    const handlePayment = async () => {
        setLoading(true);

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            if (onError) onError('SDK_LOAD_FAILED');
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order
            const result = await fetch(`${import.meta.env.VITE_API_URL}/payment/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: amount })
            });

            if (!result.ok) {
                const err = await result.json();
                throw new Error(err.message || 'Server error');
            }

            const order = await result.json();

            // 2. Open Razorpay Checkout
            // @ts-ignore
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use environment variable
                amount: order.amount,
                currency: order.currency,
                name: "Arohan Health",
                description: "Purchase Transaction",
                // image: "https://your-logo-url.com/logo.png",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/payment/verify`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyRes.ok) {
                            if (onSuccess) onSuccess(verifyData.paymentId);
                        } else {
                            if (onError) onError(verifyData.message);
                            alert(verifyData.message || 'Payment verification failed');
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: user?.full_name,
                    email: user?.email,
                    contact: user?.contact
                },
                notes: {
                    address: "Arohan Corporate Office"
                },
                theme: {
                    color: "#dc2626" // Red color to match Arohan theme
                }
            };

            // @ts-ignore
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            paymentObject.on('payment.failed', function (response: any) {
                console.error(response.error);
                if (onError) onError(response.error);
                alert(`Payment Failed: ${response.error.description}`);
            });

        } catch (error: any) {
            console.error(error);
            if (onError) onError(error.message);
            alert(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handlePayment}
            disabled={loading}
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ px: 4, py: 1.5 }}
        >
            {loading ? 'Processing...' : `Pay ₹${amount}`}
        </Button>
    );
}
