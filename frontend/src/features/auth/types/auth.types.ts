/**
 * Authentication Types
 * Types for auth feature module
 */

import type { UserRole } from '@/shared/types/common.types';

/**
 * User entity
 */
export interface User {
    user_id: string;
    full_name: string;
    email: string;
    role: UserRole;
    created_at?: string;
    updated_at?: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
    full_name: string;
    email: string;
    password: string;
    role?: UserRole;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
    user_id: string;
    full_name: string;
    email: string;
    role: UserRole;
    accessToken?: string;
    refreshToken?: string;
    message?: string;
    unverified?: boolean; // For login errors
}

/**
 * Auth store state
 */
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginCredentials) => Promise<void | { unverified: boolean; user_id: string; email: string }>;
    register: (data: RegisterData) => Promise<AuthResponse>;
    verifyOTP: (user_id: string, otp_code: string) => Promise<void>;
    resendOTP: (user_id: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
}
