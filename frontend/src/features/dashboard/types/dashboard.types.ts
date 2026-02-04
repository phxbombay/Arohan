/**
 * Dashboard Types
 * TypeScript definitions for dashboard feature
 */

export type WidgetType = 'info' | 'stats' | 'list';

export type QuickActionColor = 'red' | 'blue' | 'green';

export interface Stat {
    label: string;
    value: string;
    unit?: string;
}

export interface Widget {
    id: string;
    type: WidgetType;
    title: string;
    icon: string;
    editable?: boolean;
    // Type-specific fields
    content?: string;        // for 'info' type
    stats?: Stat[];          // for 'stats' type
    items?: string[];        // for 'list' type
}

export interface QuickAction {
    id: string;
    label: string;
    icon: string;
    color: QuickActionColor;
    action: string;  // Can be a route or tel: link
}

export interface CustomSection {
    id: string;
    title: string;
    content: string[];
    editable?: boolean;
}

export interface DashboardConfig {
    widgets: Widget[];
    quickActions: QuickAction[];
    customSections: CustomSection[];
}
