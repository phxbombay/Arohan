import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import { Visibility as ViewIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import api from '../../../services/api';
import { toast } from 'sonner';

export function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/orders');
            if (response.data.status === 'success') {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PAID': return 'success';
            case 'COD_CONFIRMED': return 'warning';
            case 'PENDING': return 'info';
            case 'FAILED': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight="bold">Order Management</Typography>
                <IconButton onClick={fetchOrders} color="primary" sx={{ bgcolor: 'action.hover' }}>
                    <RefreshIcon />
                </IconButton>
            </Box>

            <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell fontWeight="bold">Order ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Receipt</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                        <Typography color="text.secondary">No orders found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.order_id} hover>
                                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                            {order.order_id}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(order.created_at).toLocaleDateString()}
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {new Date(order.created_at).toLocaleTimeString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight="bold">
                                                ₹{(order.amount / 100).toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.status}
                                                color={getStatusColor(order.status)}
                                                size="small"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                        <TableCell>{order.receipt}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="View Details">
                                                <IconButton size="small">
                                                    <ViewIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
