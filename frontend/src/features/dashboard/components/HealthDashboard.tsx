/**
 * Health Dashboard - Refactored with New Architecture
 * Uses: @features/dashboard for dashboard logic
 */

import { useState } from 'react';
import {
    Favorite as HeartIcon,
    Timeline as ActivityIcon,
    Notifications as BellIcon,
    Phone as PhoneIcon,
    Email as MailIcon,
    ShoppingBag as ShoppingBagIcon,
    Add as PlusIcon,
    Edit as EditIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import type { Widget, QuickAction } from '../types/dashboard.types';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
    Heart: HeartIcon,
    Activity: ActivityIcon,
    Bell: BellIcon,
    Phone: PhoneIcon,
    Mail: MailIcon,
    ShoppingBag: ShoppingBagIcon,
    Plus: PlusIcon,
    Edit2: EditIcon
};

export function HealthDashboard() {
    const { user } = useAuth();
    const { widgets, customSections, quickActions, removeWidget } = useDashboard();

    const handleDeleteWidget = (widgetId: string) => {
        if (confirm('Are you sure you want to delete this widget?')) {
            removeWidget(widgetId);
        }
    };

    // Render different widget types
    const renderWidget = (widget: Widget) => {
        const Icon = iconMap[widget.icon] || ActivityIcon;

        const CommonHeader = () => (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        variant="rounded"
                        sx={{
                            bgcolor:
                                widget.type === 'stats'
                                    ? 'primary.light'
                                    : widget.type === 'list'
                                        ? 'success.light'
                                        : 'error.light',
                            color:
                                widget.type === 'stats'
                                    ? 'primary.main'
                                    : widget.type === 'list'
                                        ? 'success.main'
                                        : 'error.main'
                        }}
                    >
                        <Icon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                        {widget.title}
                    </Typography>
                </Stack>
            </Box>
        );

        switch (widget.type) {
            case 'info':
                return (
                    <Card
                        key={widget.id}
                        sx={{ height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 4 } }}
                    >
                        <CardContent>
                            <CommonHeader />
                            <Typography variant="body1" color="text.secondary">
                                {widget.content}
                            </Typography>
                        </CardContent>
                    </Card>
                );

            case 'stats':
                return (
                    <Card
                        key={widget.id}
                        sx={{ height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 4 } }}
                    >
                        <CardContent>
                            <CommonHeader />
                            {/* @ts-ignore - MUI Grid type definition issue, works correctly at runtime */}
                            <Grid container spacing={2}>
                                {widget.stats?.map((stat, idx) => (
                                    // @ts-ignore - MUI Grid item prop type issue
                                    <Grid item xs={4} key={idx} sx={{ textAlign: 'center' }}>
                                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {stat.label}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                );

            case 'list':
                return (
                    <Card
                        key={widget.id}
                        sx={{ height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 4 } }}
                    >
                        <CardContent>
                            <CommonHeader />
                            <Stack spacing={1}>
                                {widget.items?.map((item, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckIcon fontSize="small" color="success" />
                                        <Typography variant="body2" color="text.primary">
                                            {item}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    // Render quick action button
    const renderQuickAction = (action: QuickAction) => {
        const Icon = iconMap[action.icon] || ActivityIcon;
        const colorMap: Record<string, 'error' | 'primary' | 'success'> = {
            red: 'error',
            blue: 'primary',
            green: 'success'
        };

        const ActionButton = (
            <Button
                fullWidth
                variant="contained"
                color={colorMap[action.color] || 'primary'}
                size="large"
                startIcon={<Icon />}
                sx={{
                    py: 3,
                    justifyContent: 'center',
                    px: 3,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    boxShadow: 2,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' }
                }}
            >
                {action.label}
            </Button>
        );

        if (action.action.startsWith('tel:')) {
            return (
                // @ts-ignore - MUI Grid type definition issue
                <Grid item xs={12} md={4} key={action.id}>
                    <a href={action.action} style={{ textDecoration: 'none' }}>
                        {ActionButton}
                    </a>
                </Grid>
            );
        }

        return (
            // @ts-ignore - MUI Grid type definition issue
            <Grid item xs={12} md={4} key={action.id}>
                <Link to={action.action} style={{ textDecoration: 'none' }}>
                    {ActionButton}
                </Link>
            </Grid>
        );
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 6 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 6,
                        flexDirection: { xs: 'column', md: 'row' },
                        textAlign: { xs: 'center', md: 'left' }
                    }}
                >
                    <Box sx={{ mb: { xs: 2, md: 0 } }}>
                        <Typography variant="h4" fontWeight="800" gutterBottom>
                            Welcome, {user?.full_name || 'User'}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Your personalized health dashboard
                        </Typography>
                    </Box>
                </Box>

                {/* Quick Actions */}
                <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
                    {quickActions.map(renderQuickAction)}
                </Grid>

                {/* Widgets Grid */}
                {/* @ts-ignore - MUI Grid type definition issue */}
                <Grid container spacing={4} sx={{ mb: 6 }} justifyContent="center">
                    {widgets.map((widget) => (
                        // @ts-ignore - MUI Grid item prop type issue
                        <Grid xs={12} md={6} lg={4} key={widget.id}>
                            {renderWidget(widget)}
                        </Grid>
                    ))}
                </Grid>

                {/* Custom Sections */}
                {customSections.map((section) => (
                    <Card key={section.id} sx={{ mb: 4, textAlign: 'center' }}>
                        <CardHeader
                            title={section.title}
                            titleTypographyProps={{ variant: 'h5', fontWeight: 'bold', align: 'center' }}
                        />
                        <CardContent>
                            <Stack spacing={1.5}>
                                {section.content.map((item, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <CheckIcon fontSize="small" color="success" />
                                        <Typography variant="body1">{item}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Container>
        </Box>
    );
}
