import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Button,
    Stack,
    Divider
} from '@mui/material';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    FileText,
    LogOut,
    Home,
    ShoppingBag,
    Briefcase
} from 'lucide-react';
import { Speed as SpeedIcon } from '@mui/icons-material';
import { useAuth } from '../../../features/auth/hooks/useAuth';

export function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    // @ts-ignore
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
        { icon: Briefcase, label: 'Leads', path: '/admin/leads' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
        { icon: FileText, label: 'Logs', path: '/admin/logs' },
        { icon: SpeedIcon, label: 'Performance', path: '/admin/metrics' },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 80px)', bgcolor: '#f8fafc' }}>
            {/* Sidebar */}
            <Box
                component="aside"
                sx={{
                    width: 280,
                    bgcolor: '#0f172a', // slate-900
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 6,
                    transition: 'all 0.3s',
                    zIndex: 1200
                }}
            >
                {/* Header */}
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{
                            p: 1,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #3b82f6, #9333ea)', // blue-500 to purple-600
                            boxShadow: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Users size={24} color="white" />
                        </Box>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{
                                background: 'linear-gradient(to right, #ffffff, #94a3b8)', // white to slate-400
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Admin
                        </Typography>
                    </Stack>
                </Box>

                {/* Navigation */}
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                    <List disablePadding>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        sx={{
                                            borderRadius: 2,
                                            px: 2,
                                            py: 1.5,
                                            transition: 'all 0.2s',
                                            bgcolor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent', // blue-600/10
                                            borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent',
                                            boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                                            background: isActive ? 'linear-gradient(to right, rgba(37, 99, 235, 0.1), rgba(147, 51, 234, 0.1))' : 'transparent',
                                            '&:hover': {
                                                bgcolor: isActive ? 'rgba(37, 99, 235, 0.2)' : '#1e293b', // slate-800
                                                transform: 'translateX(4px)',
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <Icon
                                                size={20}
                                                color={isActive ? '#60a5fa' : '#64748b'} // blue-400 : slate-500
                                                style={{ transition: 'color 0.2s' }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontWeight: 500,
                                                color: isActive ? 'white' : '#94a3b8', // slate-400
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>

                {/* Footer Controls */}
                <Box sx={{
                    p: 2,
                    borderTop: '1px solid #1e293b',
                    bgcolor: 'rgba(15, 23, 42, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}>


                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            px: 2,
                            py: 1.5,
                            color: '#f87171', // red-400
                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                            <LogOut size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                    </ListItemButton>

                    <Typography variant="caption" align="center" sx={{ color: '#475569', mt: 2, display: 'block' }}>
                        Arohan v2.0
                    </Typography>
                </Box>
            </Box>

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    bgcolor: '#f8fafc', // slate-50
                    p: 4
                }}
            >
                <Box sx={{ maxWidth: '1280px', mx: 'auto' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
