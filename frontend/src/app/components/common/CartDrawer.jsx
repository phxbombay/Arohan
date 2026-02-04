import { Drawer, IconButton, Typography, Box, Stack, Button, List, ListItem, Avatar, Divider } from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon, Add as AddIcon, ShoppingCart as ShoppingCartIcon, Remove as RemoveIcon } from '@mui/icons-material';
// @ts-ignore
import { useCartStore } from '../../../context/cartStore';

export function CartDrawer({ isOpen, onClose }) {
    // @ts-ignore
    const { items, removeItem, addItem, totalPrice } = useCartStore();

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
        >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingCartIcon /> Your Cart
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                {items.length === 0 ? (
                    <Stack spacing={2} alignItems="center" justifyContent="center" height="100%" color="text.secondary">
                        <ShoppingCartIcon sx={{ fontSize: 64, opacity: 0.2 }} />
                        <Typography>Your cart is empty.</Typography>
                        <Button variant="outlined" onClick={onClose}>Start Shopping</Button>
                    </Stack>
                ) : (
                    <Stack spacing={2}>
                        {items.map((item) => (
                            <Box key={item.id} sx={{ display: 'flex', gap: 2, p: 1, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                                <Box sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 1,
                                    bgcolor: 'grey.100',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        boxShadow: 1,
                                        bgcolor: item.image === 'black' ? 'common.black' : 'grey.400',
                                        border: '2px solid white'
                                    }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">{item.name}</Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        ₹{item.price.toLocaleString('en-IN')}
                                    </Typography>

                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                                            <IconButton size="small" onClick={() => addItem({ ...item, quantity: -1 })} disabled={item.quantity <= 1}>
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</Typography>
                                            <IconButton size="small" onClick={() => addItem(item)}>
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        <IconButton color="error" size="small" onClick={() => removeItem(item.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>

            {items.length > 0 && (
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                    <Stack direction="row" justifyContent="space-between" mb={2}>
                        <Typography color="text.secondary">Subtotal</Typography>
                        <Typography variant="h6" fontWeight="bold">₹{totalPrice().toLocaleString('en-IN')}</Typography>
                    </Stack>
                    <Button variant="contained" fullWidth size="large">
                        Proceed to Checkout
                    </Button>
                    <Typography variant="caption" display="block" textAlign="center" color="text.secondary" mt={1}>
                        Secure Checkout powered by Stripe
                    </Typography>
                </Box>
            )}
        </Drawer>
    );
}
