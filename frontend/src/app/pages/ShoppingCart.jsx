import { useState, useEffect } from 'react';
import {
    ShoppingBag as ShoppingBagIcon,
    Add as PlusIcon,
    Remove as MinusIcon,
    DeleteOutline as TrashIcon,
    ArrowForward as ArrowRightIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    IconButton,
    Grid,
    Card,
    CardContent,
    Divider,
    Stack,
    Paper,
    CircularProgress
} from '@mui/material';
import { toast } from 'sonner';
import { useCartStore } from '../../context/cartStore';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function ShoppingCart() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const {
        cart,
        loading,
        fetchCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal
    } = useCartStore();

    // Load cart from backend on mount
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin');
            return;
        }

        const userId = user?.user_id;
        if (userId) {
            fetchCart(userId);
        }
    }, [user?.user_id, isAuthenticated, fetchCart, navigate]);

    const handleUpdateQuantity = async (id, delta) => {
        const userId = user?.user_id;
        if (!userId) return;

        try {
            await updateQuantity(id, delta, userId);
            toast.success(delta > 0 ? 'Quantity increased' : 'Quantity decreased');
        } catch (error) {
            toast.error('Failed to update quantity');
        }
    };

    const handleRemove = async (id) => {
        const userId = user?.user_id;
        if (!userId) return;

        try {
            await removeFromCart(id, userId);
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const handleClearCart = async () => {
        const userId = user?.user_id;
        if (!userId) return;

        if (window.confirm('Are you sure you want to clear your cart?')) {
            try {
                await clearCart(userId);
                toast.success('Cart cleared');
            } catch (error) {
                toast.error('Failed to clear cart');
            }
        }
    };

    const subtotal = getCartTotal();
    const shipping = 0;
    const tax = 0; // Inclusive
    const total = subtotal + shipping + tax;

    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'grey.50', py: 6 }}>
            <Container>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <ShoppingBagIcon color="error" fontSize="large" />
                    <Typography variant="h4" fontWeight="bold">Shopping Cart</Typography>
                </Stack>

                {loading ? (
                    // Loading State
                    <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
                        <CircularProgress size={60} />
                        <Typography variant="h6" sx={{ mt: 3 }}>Loading your cart...</Typography>
                    </Paper>
                ) : cart.length === 0 ? (
                    // Empty Cart State
                    <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
                        <ShoppingBagIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Your cart is empty</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Add items to get started</Typography>
                        <Button
                            component={Link}
                            to="/products"
                            variant="contained"
                            color="error"
                            size="large"
                        >
                            Browse Products
                        </Button>
                    </Paper>
                ) : (
                    // Cart with Items
                    <Grid container spacing={4}>
                        {/* Cart Items */}
                        <Grid item xs={12} md={8}>
                            <Stack spacing={2}>
                                {cart.map((item) => (
                                    <Card key={item.id} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box
                                            component="img"
                                            src={item.image}
                                            alt={item.name}
                                            sx={{ width: 80, height: 80, borderRadius: 1, bgcolor: 'grey.100', objectFit: 'cover' }}
                                        />

                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="bold">{item.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">₹{item.price.toLocaleString()}</Typography>
                                        </Box>

                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleUpdateQuantity(item.id, -1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <MinusIcon fontSize="small" />
                                            </IconButton>
                                            <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                            >
                                                <PlusIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>

                                        <IconButton
                                            onClick={() => handleRemove(item.id)}
                                            color="error"
                                        >
                                            <TrashIcon />
                                        </IconButton>
                                    </Card>
                                ))}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        onClick={handleClearCart}
                                        color="error"
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Clear Cart
                                    </Button>
                                </Box>
                            </Stack>
                        </Grid>

                        {/* Order Summary */}
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>Order Summary</Typography>

                                    <Stack spacing={1.5} sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                            <Typography variant="body2" fontWeight="medium">₹{subtotal.toLocaleString()}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Shipping</Typography>
                                            <Typography variant="body2" fontWeight="medium">{shipping === 0 ? 'FREE' : `₹${shipping}`}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Tax (Included)</Typography>
                                            <Typography variant="body2" fontWeight="medium">₹{tax.toLocaleString()}</Typography>
                                        </Box>
                                    </Stack>

                                    <Divider sx={{ mb: 2 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                        <Typography variant="h6" fontWeight="bold">Total</Typography>
                                        <Typography variant="h6" fontWeight="bold" color="error.main">₹{total.toLocaleString()}</Typography>
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        component={Link}
                                        to={`/checkout?amount=${total}`}
                                        endIcon={<ArrowRightIcon />}
                                        sx={{
                                            borderRadius: 2,
                                            py: 1.5,
                                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                            boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                                                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.5)'
                                            }
                                        }}
                                    >
                                        Proceed to Payment
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
