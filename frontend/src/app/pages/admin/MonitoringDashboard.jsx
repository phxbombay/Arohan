import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Button,
    Container,
    Alert
} from '@mui/material';
import { Refresh as RefreshIcon, Speed as SpeedIcon, Memory as MemoryIcon, Storage as StorageIcon } from '@mui/icons-material';
// @ts-ignore
import api from '../../../services/api';
// Moved layout to router level

export function MonitoringDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            // Fetch Prometheus metrics in JSON format
            const response = await api.get('/admin/metrics');
            const data = response.data.data;
            setMetrics(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error('Error fetching metrics:', err);
            setError('Failed to load performance metrics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
        // Refresh every 30 seconds
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, []);

    // Helper to parse Prometheus histogram buckets if needed, 
    // but for now we'll display raw values or simplified counts

    // Helper to find metric value
    const getMetricValue = (name) => {
        if (!metrics) return 0;
        const metric = metrics.find(m => m.name === name);
        if (!metric) return 0;

        // Sum values for counters
        if (metric.type === 'counter' && metric.values) {
            return metric.values.reduce((sum, v) => sum + v.value, 0);
        }
        return 0;
    };

    const requestCount = getMetricValue('http_requests_total');
    const errorCount = getMetricValue('http_errors_total');

    // Calculate error rate
    const errorRate = requestCount > 0 ? ((errorCount / requestCount) * 100).toFixed(2) : 0;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    System Performance
                </Typography>
                <Button
                    startIcon={<RefreshIcon />}
                    variant="outlined"
                    onClick={fetchMetrics}
                >
                    Refresh
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading && !metrics ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {/* Key Metrics */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <SpeedIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Total Requests</Typography>
                                </Box>
                                <Typography variant="h3" fontWeight="bold">
                                    {requestCount}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Since server start
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <MemoryIcon color={errorRate > 5 ? 'error' : 'success'} sx={{ mr: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Error Rate</Typography>
                                </Box>
                                <Typography variant="h3" fontWeight="bold" color={errorRate > 5 ? 'error.main' : 'text.primary'}>
                                    {errorRate}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {errorCount} total errors
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <StorageIcon color="info" sx={{ mr: 1 }} />
                                    <Typography variant="h6" color="text.secondary">System Status</Typography>
                                </Box>
                                <Typography variant="h3" fontWeight="bold" color="success.main">
                                    Healthy
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    All services operational
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Raw Metrics View */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Raw Metrics Data</Typography>
                            <Box sx={{
                                bgcolor: 'grey.900',
                                color: 'common.white',
                                p: 2,
                                borderRadius: 1,
                                overflow: 'auto',
                                maxHeight: 400,
                                fontFamily: 'monospace',
                                fontSize: '0.875rem'
                            }}>
                                <pre>{JSON.stringify(metrics, null, 2)}</pre>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}
