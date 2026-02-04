import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert,
    Stack
} from '@mui/material';
import {
    Download as DownloadIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Email as MailIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
// @ts-ignore
import { useAuthStore } from '../../../features/auth/store/authStore';
import { toast } from 'sonner';

export function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // @ts-ignore
    const token = useAuthStore((state) => state.token);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/messages');
            // Handle different response structures (standard vs direct)
            const data = response.data.data || response.data;
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch messages", error);
            toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDownloadCSV = () => {
        if (messages.length === 0) {
            toast.warning('No data to export');
            return;
        }

        const headers = ['ID', 'Name', 'Email', 'Phone', 'Message', 'Date'];
        const rows = messages.map(msg => [
            msg.id,
            `"${msg.name}"`,
            msg.email,
            msg.phone || '',
            `"${msg.message?.replace(/"/g, '""')}"`,
            new Date(msg.created_at).toLocaleString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `arohan_messages_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredMessages = messages.filter(msg =>
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{
                    background: 'linear-gradient(45deg, #1E293B 30%, #D946EF 90%)', // Different tint for messages
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent'
                }}>
                    Contact Messages
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadCSV}
                    disabled={messages.length === 0}
                >
                    Export CSV
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    placeholder="Search messages..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 300 }}
                />
                <Button startIcon={<RefreshIcon />} onClick={fetchMessages}>
                    Refresh
                </Button>
            </Paper>

            <TableContainer component={Paper} elevation={1}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Sender</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : filteredMessages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                                    No messages found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMessages.map((msg) => (
                                <TableRow key={msg.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary', verticalAlign: 'top' }}>
                                        {new Date(msg.created_at).toLocaleDateString()}
                                        <br />
                                        <Typography variant="caption">{new Date(msg.created_at).toLocaleTimeString()}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography fontWeight="medium">{msg.name}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Stack spacing={0.5}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <MailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2">{msg.email}</Typography>
                                            </Box>
                                            {msg.phone && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">{msg.phone}</Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 400, verticalAlign: 'top' }}>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {msg.message}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
