import { useState, useEffect } from 'react';
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
    Tooltip
} from '@mui/material';
import { Download as DownloadIcon, Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import api from '../../../services/api';
import { toast } from 'sonner';

export default function AdminLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLeads = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/leads');
            const leadsData = response.data?.data?.leads || response.data?.data || [];
            setLeads(Array.isArray(leadsData) ? leadsData : []);
        } catch (err) {
            console.error('Error fetching leads:', err);
            setError('Failed to load leads from server.');
            toast.error('Could not load leads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleDownloadCSV = () => {
        if (leads.length === 0) {
            toast.warning('No data to export');
            return;
        }

        // CSV Header
        const headers = ['ID', 'Name', 'Email', 'Phone', 'City', 'Use Case', 'Date'];

        // CSV Rows
        const rows = leads.map(lead => [
            lead.id,
            `"${lead.name}"`, // Quote to handle commas
            lead.email,
            lead.phone,
            `"${lead.city}"`,
            `"${lead.use_case?.replace(/"/g, '""')}"`, // Escape quotes
            new Date(lead.created_at).toLocaleString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.join(','))
        ].join('\n');

        // Create Blob and Link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `arohan_leads_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredLeads = leads.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{
                    background: 'linear-gradient(45deg, #1E293B 30%, #4F46E5 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent'
                }}>
                    Early Access Leads
                </Typography>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadCSV}
                    disabled={leads.length === 0}
                >
                    Export CSV
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    placeholder="Search leads..."
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
                <Button startIcon={<RefreshIcon />} onClick={fetchLeads}>
                    Refresh
                </Button>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} elevation={1}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Message / Use Case</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : filteredLeads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                                    No leads found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeads.map((lead) => (
                                <TableRow key={lead.id} hover>
                                    <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
                                        {new Date(lead.created_at).toLocaleDateString()}
                                        <br />
                                        <Typography variant="caption">{new Date(lead.created_at).toLocaleTimeString()}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="medium">{lead.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{lead.email}</Typography>
                                        {lead.phone && (
                                            <Typography variant="caption" color="text.secondary">{lead.phone}</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>{lead.city || '-'}</TableCell>
                                    <TableCell sx={{ maxWidth: 300 }}>
                                        <Tooltip title={lead.use_case || ''} arrow placement="top">
                                            <Typography variant="body2" sx={{
                                                display: '-webkit-box',
                                                overflow: 'hidden',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 2,
                                                cursor: 'help'
                                            }}>
                                                {lead.use_case || '-'}
                                            </Typography>
                                        </Tooltip>
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
