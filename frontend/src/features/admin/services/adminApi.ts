/**
 * Admin API Service
 * API calls for admin operations
 */

import apiClient from '@core/api/client';
import type {
    AdminUser,
    AdminMessage,
    AdminLog,
    AdminLead,
    BlogPost,
    AdminStats
} from '../types/admin.types';

export const adminApi = {
    // Stats & Dashboard
    getStats: async (): Promise<AdminStats> => {
        const { data } = await apiClient.get('/admin/stats');
        return data.data || data;
    },

    // User Management
    getUsers: async (): Promise<AdminUser[]> => {
        const { data } = await apiClient.get('/admin/users');
        return data.data || data;
    },

    getUser: async (userId: string): Promise<AdminUser> => {
        const { data } = await apiClient.get(`/admin/users/${userId}`);
        return data.data || data;
    },

    updateUser: async (userId: string, updates: Partial<AdminUser>): Promise<AdminUser> => {
        const { data } = await apiClient.put(`/admin/users/${userId}`, updates);
        return data.data || data;
    },

    deleteUser: async (userId: string): Promise<void> => {
        await apiClient.delete(`/admin/users/${userId}`);
    },

    // Messages
    getMessages: async (): Promise<AdminMessage[]> => {
        const { data } = await apiClient.get('/admin/messages');
        return data.data || data;
    },

    getMessage: async (messageId: string): Promise<AdminMessage> => {
        const { data } = await apiClient.get(`/admin/messages/${messageId}`);
        return data.data || data;
    },

    markMessageRead: async (messageId: string): Promise<void> => {
        await apiClient.put(`/admin/messages/${messageId}/read`);
    },

    replyToMessage: async (messageId: string, reply: string): Promise<void> => {
        await apiClient.post(`/admin/messages/${messageId}/reply`, { reply });
    },

    // Logs
    getLogs: async (filters?: { level?: string; limit?: number }): Promise<AdminLog[]> => {
        const { data } = await apiClient.get('/admin/logs', { params: filters });
        return data.data || data;
    },

    // Leads
    getLeads: async (): Promise<AdminLead[]> => {
        const { data } = await apiClient.get('/admin/leads');
        return data.data || data;
    },

    getLead: async (leadId: string): Promise<AdminLead> => {
        const { data } = await apiClient.get(`/admin/leads/${leadId}`);
        return data.data || data;
    },

    updateLead: async (leadId: string, updates: Partial<AdminLead>): Promise<AdminLead> => {
        const { data } = await apiClient.put(`/admin/leads/${leadId}`, updates);
        return data.data || data;
    },

    deleteLead: async (leadId: string): Promise<void> => {
        await apiClient.delete(`/admin/leads/${leadId}`);
    },

    // Blog Management
    getPosts: async (): Promise<BlogPost[]> => {
        const { data } = await apiClient.get('/admin/blog/posts');
        return data.data || data;
    },

    getPost: async (postId: string): Promise<BlogPost> => {
        const { data } = await apiClient.get(`/admin/blog/posts/${postId}`);
        return data.data || data;
    },

    createPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
        const { data } = await apiClient.post('/admin/blog/posts', post);
        return data.data || data;
    },

    updatePost: async (postId: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
        const { data } = await apiClient.put(`/admin/blog/posts/${postId}`, updates);
        return data.data || data;
    },

    deletePost: async (postId: string): Promise<void> => {
        await apiClient.delete(`/admin/blog/posts/${postId}`);
    },

    publishPost: async (postId: string): Promise<BlogPost> => {
        const { data } = await apiClient.post(`/admin/blog/posts/${postId}/publish`);
        return data.data || data;
    }
};
