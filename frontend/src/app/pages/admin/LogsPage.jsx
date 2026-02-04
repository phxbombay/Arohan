import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
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
    CircularProgress
} from '@mui/material';
import {
    ReportProblem as WarnIcon,
    Info as InfoIcon,
    Security as ErrorIcon
} from '@mui/icons-material';
// @ts-ignore
import { useAuthStore } from '../../../features/auth/store/authStore';

export function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    // @ts-ignore
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/admin/logs?limit=50');
                setLogs(response.data.data);
            } catch (error) {
                console.error("Failed to fetch logs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const getIcon = (level) => {
        switch (level) {
            case 'error': return <ErrorIcon fontSize="small" color="error" />;
            case 'warn': return <WarnIcon fontSize="small" color="warning" />;
            default: return <InfoIcon fontSize="small" color="info" />;
        }
    };

    if (loading) return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>System Audit Logs</Typography>

            <TableContainer component={Paper} elevation={1}>
                <Table size="small">
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell width={50}></TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>User ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>IP Addr</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.log_id} hover>
                                <TableCell>{getIcon(log.level || 'info')}</TableCell>
                                <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                    {new Date(log.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'medium' }}>{log.action}</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                                    {log.user_id ? log.user_id.slice(0, 8) + '...' : 'System'}
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>{log.ip_address}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
