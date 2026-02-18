/**
 * Authentication API Service
 * Handles all auth-related API calls
 */

import apiClient from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types';

export const authApi = {
    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );
        return data;
    },

    /**
     * Register new user
     */
    async register(userData: RegisterData): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.AUTH.REGISTER,
            userData
        );
        return data;
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    },

    /**
     * Refresh access token
     */
    async refreshToken(): Promise<{ accessToken: string }> {
        const { data } = await apiClient.post<{ accessToken: string }>(
            API_ENDPOINTS.AUTH.REFRESH_TOKEN
        );
        return data;
    },

    /**
     * Get current user profile
     */
    async getProfile(): Promise<User> {
        const { data } = await apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE);
        return data;
    },

    /**
     * Verify Registration OTP
     */
    async verifyOTP(user_id: string, otp_code: string): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>('/v1/auth/verify-otp', {
            user_id,
            otp_code
        });
        return data;
    },

    /**
     * Resend Registration OTP
     */
    async resendOTP(user_id: string): Promise<{ message: string }> {
        const { data } = await apiClient.post<{ message: string }>('/v1/auth/resend-otp', {
            user_id
        });
        return data;
    }
};
