// Dashboard configuration - Easy to modify without touching code

export interface DashboardWidget {
    id: string;
    type: 'info' | 'stats' | 'list';
    title: string;
    icon: string; // Icon name string, component mapping happens in component
    content?: string;
    stats?: { label: string; value: string; unit: string }[];
    items?: string[];
    editable: boolean;
    [key: string]: any;
}

export interface QuickAction {
    id: string;
    label: string;
    icon: string;
    color: string;
    action: string;
}

export interface CustomSection {
    id: string;
    title: string;
    content: string[];
    editable: boolean;
}

export interface DashboardConfig {
    widgets: DashboardWidget[];
    quickActions: QuickAction[];
    customSections: CustomSection[];
}

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

// Helper to add custom widget
export const addCustomWidget = (widget: DashboardWidget): void => {
    dashboardConfig.widgets.push({
        ...widget,
        id: widget.id || `custom-${Date.now()}`,
        editable: true
    });
};

// Helper to update widget
export const updateWidget = (widgetId: string, updates: Partial<DashboardWidget>): void => {
    const widget = dashboardConfig.widgets.find(w => w.id === widgetId);
    if (widget) {
        Object.assign(widget, updates);
    }
};

// Helper to remove widget
export const removeWidget = (widgetId: string): void => {
    const index = dashboardConfig.widgets.findIndex(w => w.id === widgetId);
    if (index > -1) {
        dashboardConfig.widgets.splice(index, 1);
    }
};
