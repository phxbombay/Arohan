import React, { useEffect, useState } from 'react';
import {
    People as UsersIcon,
    Message as MessageIcon,
    Article as FileTextIcon,
    CheckCircle as CheckCircleIcon,
    TrendingUp as TrendingUpIcon,
    Groups as GroupsIcon
} from '@mui/icons-material';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Stack,
    Avatar,
    CircularProgress,
    Paper,
    LinearProgress
} from '@mui/material';
import api from '../../../services/api';

// Helper for Premium Metric Card
const StatCard = ({ title, value, icon: Icon, color1, color2, delay }) => (
    <Card
        sx={{
            height: '100%',
            borderRadius: 4,
            background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
            color: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 40px rgba(0,0,0,0.2)' },
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        <Box sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            opacity: 0.2,
            transform: 'rotate(-20deg)'
        }}>
            <Icon sx={{ fontSize: 120, color: 'white' }} />
        </Box>

        <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                    <Icon />
                </Avatar>
            </Box>
            <Typography variant="h3" fontWeight="800" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {value}
            </Typography>
            <Typography variant="subtitle1" fontWeight="500" sx={{ opacity: 0.9 }}>
                {title}
            </Typography>
        </CardContent>
    </Card>
);

export function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalMessages: 0,
        totalLogs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Stack alignItems="center" spacing={2}>
                <CircularProgress size={60} thickness={4} sx={{ color: '#4F46E5' }} />
                <Typography color="text.secondary">Loading Dashboard...</Typography>
            </Stack>
        </Box>
    );

    return (
        <Box>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" fontWeight="800" sx={{
                    background: 'linear-gradient(45deg, #1E293B 30%, #4F46E5 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Dashboard Overview
                </Typography>
                <Typography variant="h6" color="text.secondary" fontWeight="400">
                    Welcome back to your control center.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={UsersIcon}
                        color1="#4F46E5" // Indigo
                        color2="#818CF8"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Sessions"
                        value={stats.activeUsers}
                        icon={CheckCircleIcon}
                        color1="#059669" // Emerald
                        color2="#34D399"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="New Leads" // Placeholder logic
                        value={stats.totalMessages}
                        icon={MessageIcon}
                        color1="#D946EF" // Fuchsia
                        color2="#F472B6"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="System Logs"
                        value={stats.totalLogs}
                        icon={FileTextIcon}
                        color1="#EA580C" // Orange
                        color2="#FB923C"
                    />
                </Grid>
            </Grid>

            {/* Real Data Sections */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                    Recent Activity
                </Typography>
                <Paper elevation={0} sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                    color: 'text.secondary'
                }}>
                    <Typography>
                        Check the <strong>Logs</strong> tab for detailed system activity.
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}
