/**
 * Admin Types
 * TypeScript definitions for admin feature
 */

// User Management Types
export interface AdminUser {
    user_id: string;
    full_name: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    created_at: string;
    last_login?: string;
    is_active: boolean;
}

// Message Types
export interface AdminMessage {
    message_id: string;
    user_id: string;
    user_name: string;
    user_email: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'replied';
    created_at: string;
    replied_at?: string;
}

// Log Types
export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface AdminLog {
    log_id: string;
    level: LogLevel;
    message: string;
    source: string;
    user_id?: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

// Lead Types
export interface AdminLead {
    lead_id: string;
    full_name: string;
    email: string;
    phone?: string;
    source: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    created_at: string;
    notes?: string;
}

// Blog Types
export interface BlogPost {
    post_id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    author_id: string;
    author_name?: string;
    status: 'draft' | 'published' | 'archived';
    published_at?: string;
    created_at: string;
    updated_at: string;
    tags?: string[];
    featured_image?: string;
}

// Admin Stats
export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalMessages: number;
    unreadMessages: number;
    totalLogs: number;
    errorLogs: number;
    totalOrders: number;
    totalLeads: number;
    newLeads: number;
}

// Admin Dashboard Metrics
export interface DashboardMetric {
    label: string;
    value: number;
    trend?: 'up' | 'down' | 'stable';
    percentage?: number;
}
