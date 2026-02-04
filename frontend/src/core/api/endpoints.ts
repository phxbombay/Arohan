/**
 * API Endpoints
 * Centralized endpoint definitions
 */

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh-token',
        PROFILE: '/auth/profile'
    },

    // Orders
    ORDERS: {
        LIST: '/orders',
        CREATE: '/orders',
        GET: (id: string) => `/orders/${id}`,
        UPDATE: (id: string) => `/orders/${id}`,
        DELETE: (id: string) => `/orders/${id}`
    },

    // Payments
    PAYMENTS: {
        CREATE_RAZORPAY: '/payments/razorpay/create',
        VERIFY_RAZORPAY: '/payments/razorpay/verify',
        CREATE_PHONEPE: '/payments/phonepe/create',
        STATUS_PHONEPE: (transactionId: string) => `/payments/phonepe/status/${transactionId}`
    },

    // Blog
    BLOG: {
        LIST: '/blogs',
        GET: (id: string) => `/blogs/${id}`,
        CREATE: '/blogs',
        UPDATE: (id: string) => `/blogs/${id}`,
        DELETE: (id: string) => `/blogs/${id}`
    },

    // Leads
    LEADS: {
        CREATE: '/leads',
        LIST: '/leads',
        GET: (id: string) => `/leads/${id}`
    },

    // Admin
    ADMIN: {
        USERS: '/admin/users',
        STATS: '/admin/stats',
        SETTINGS: '/admin/settings'
    }
} as const;
