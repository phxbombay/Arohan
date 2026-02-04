/**
 * Dashboard Configuration
 * Centralized dashboard widget and action configuration
 */

import type { DashboardConfig } from '../types/dashboard.types';

export const dashboardConfig: DashboardConfig = {
    // User can easily add/remove widgets
    widgets: [
        {
            id: 'welcome',
            type: 'info',
            title: 'Welcome to Arohan',
            icon: 'Heart',
            content: 'Your personal health monitoring dashboard',
            editable: true
        },
        {
            id: 'quick-stats',
            type: 'stats',
            title: 'Quick Stats',
            icon: 'Activity',
            stats: [
                { label: 'Active Days', value: '0', unit: 'days' },
                { label: 'Health Score', value: '0', unit: '%' },
                { label: 'Alerts', value: '0', unit: 'total' }
            ],
            editable: true
        },
        {
            id: 'notifications',
            type: 'list',
            title: 'Recent Activity',
            icon: 'Bell',
            items: [
                'Dashboard created successfully',
                'Your account is active',
                'Start monitoring your health'
            ],
            editable: true
        }
    ],

    // Quick actions users can take
    quickActions: [
        {
            id: 'emergency',
            label: 'Emergency SOS',
            icon: 'Phone',
            color: 'red',
            action: 'tel:112'
        },
        {
            id: 'contact',
            label: 'Contact Support',
            icon: 'Mail',
            color: 'blue',
            action: '/contact'
        },
        {
            id: 'products',
            label: 'View Products',
            icon: 'ShoppingBag',
            color: 'green',
            action: '/products'
        }
    ],

    // Customizable sections
    customSections: [
        {
            id: 'health-tips',
            title: 'Health Tips',
            content: [
                'Stay hydrated throughout the day',
                'Get at least 30 minutes of exercise',
                'Maintain a regular sleep schedule',
                'Eat a balanced diet with fruits and vegetables'
            ],
            editable: true
        }
    ]
};
