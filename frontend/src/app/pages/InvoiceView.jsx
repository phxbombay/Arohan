import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Divider,
    Chip,
    CircularProgress,
    Stack
} from '@mui/material';
import {
    Download as DownloadIcon,
    Print as PrintIcon,
    ArrowBack as BackIcon,
    CheckCircle as CheckIcon
} from '@mui/icons-material';
import axios from 'axios';

export function InvoiceView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const fetchInvoice = async () => {
        try {
            setLoading(true);
            // using relative path, rely on proxy or baseURL
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/invoices/${id}`);
            if (response.data.success) {
                setInvoice(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching invoice:', err);
            setError('Failed to load invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        window.open(`${import.meta.env.VITE_API_URL}/invoices/${id}/pdf`, '_blank');
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !invoice) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography variant="h6" color="error">{error || 'Invoice not found'}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Action Buttons (not printed) */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, '@media print': { display: 'none' } }}>
                <Button
                    startIcon={<BackIcon />}
                    onClick={() => navigate(-1)}
                    variant="outlined"
                >
                    Back
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    variant="outlined"
                    color="primary"
                >
                    Print
                </Button>
                <Button
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPDF}
                    variant="contained"
                    color="primary"
                >
                    Download PDF
                </Button>
            </Box>

            {/* Invoice Paper */}
            <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
                        AROHAN HEALTH
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Health Monitoring Devices
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        contact@arohanhealth.com | www.arohanhealth.com
                    </Typography>
                </Box>

                {/* Invoice Title & Details */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                        <Typography variant="h4" fontWeight="bold">
                            INVOICE
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2"><strong>Invoice #:</strong> {invoice.invoiceNumber}</Typography>
                        <Typography variant="body2"><strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</Typography>
                        <Typography variant="body2"><strong>Order #:</strong> {invoice.orderNumber}</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Bill To */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        BILL TO:
                    </Typography>
                    <Typography variant="body2">{invoice.customer.name}</Typography>
                    <Typography variant="body2">{invoice.customer.mobile}</Typography>
                    {invoice.customer.email && (
                        <Typography variant="body2">{invoice.customer.email}</Typography>
                    )}
                    {invoice.customer.address && (
                        <>
                            <Typography variant="body2">{invoice.customer.address.street}</Typography>
                            {invoice.customer.address.landmark && (
                                <Typography variant="body2">Near {invoice.customer.address.landmark}</Typography>
                            )}
                            <Typography variant="body2">
                                {invoice.customer.address.city}, {invoice.customer.address.state} - {invoice.customer.address.pincode}
                            </Typography>
                        </>
                    )}
                </Box>

                {/* Items Table */}
                <TableContainer sx={{ mb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ITEM</TableCell>
                                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>QTY</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>PRICE</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>TOTAL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice.items.map((item, index) => (
                                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.50' } }}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell align="center">{item.quantity}</TableCell>
                                    <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                                    <TableCell align="right">₹{item.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Totals */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Box sx={{ width: 300 }}>
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Subtotal:</Typography>
                                <Typography variant="body2">₹{invoice.pricing.subtotal.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Tax ({invoice.pricing.taxRate}%):</Typography>
                                <Typography variant="body2">₹{invoice.pricing.tax.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Shipping:</Typography>
                                <Typography variant="body2">
                                    {invoice.pricing.shipping === 0 ? 'FREE' : `₹${invoice.pricing.shipping.toFixed(2)}`}
                                </Typography>
                            </Box>
                            {invoice.pricing.discount > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Discount:</Typography>
                                    <Typography variant="body2">-₹{invoice.pricing.discount.toFixed(2)}</Typography>
                                </Box>
                            )}
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" fontWeight="bold">TOTAL:</Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary.main">
                                    ₹{invoice.pricing.total.toFixed(2)}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Box>

                {/* Payment Info */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Payment Method:</strong> {invoice.paymentMethod}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Chip
                                icon={<CheckIcon />}
                                label={invoice.paymentStatus}
                                color={invoice.paymentStatus === 'PAID' ? 'success' : 'warning'}
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Footer */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" gutterBottom>
                        Thank you for your purchase!
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        For queries, contact: contact@arohanhealth.com | +91 XXXXXXXXXX
                    </Typography>
                </Box>

                {invoice.notes && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            <strong>Notes:</strong> {invoice.notes}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}
