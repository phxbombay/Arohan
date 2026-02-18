/**
 * Authentication Store (TypeScript)
 * Manages authentication state using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/authApi';
import type { AuthState, LoginCredentials, RegisterData, User } from '../types/auth.types';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            /**
             * Login user
             */
            login: async (credentials: LoginCredentials) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authApi.login(credentials);

                    console.log('🔵 AUTH STORE - Login API Response:', response);
                    console.log('🔵 Response role:', response.role, 'Type:', typeof response.role);

                    const user: User = {
                        user_id: response.user_id,
                        full_name: response.full_name,
                        email: response.email,
                        role: response.role
                    };

                    console.log('🔵 AUTH STORE - Created User object:', user);
                    console.log('🔵 User role:', user.role, 'Type:', typeof user.role);

                    // Store token in localStorage for API client
                    localStorage.setItem('token', response.accessToken);
                    if (response.refreshToken) {
                        localStorage.setItem('refreshToken', response.refreshToken);
                    }
                    if (response.role) {
                        localStorage.setItem('user_role', response.role.toLowerCase());
                    }

                    set({
                        user,
                        token: response.accessToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });

                    console.log('✅ AUTH STORE - Login complete. Final user:', get().user);
                } catch (err: any) {
                    console.error('🔴 AUTH STORE - Login Error (Full):', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
                    console.error('🔴 AUTH STORE - Login Response Data:', err.response?.data);

                    // Extract the most specific error message possible
                    let errorMessage = 'Login failed';

                    if (err.response) {
                        // Server responded with a status code outside 2xx range
                        const data = err.response.data;
                        if (data?.errors && Array.isArray(data.errors)) {
                            errorMessage = data.errors.map((e: any) => e.message).join(', ');
                        } else if (data?.message) {
                            errorMessage = data.message;
                        } else if (data?.error?.message) {
                            // Handle nested error object (dev mode)
                            errorMessage = data.error.message;
                        } else if (typeof data === 'string') {
                            errorMessage = data; // HTML response or raw string
                        } else {
                            errorMessage = `Login failed (${err.response.status}: ${err.response.statusText})`;
                        }
                    } else if (err.request) {
                        // Request was made but no response received
                        errorMessage = 'No response from server. Check your internet connection.';
                    } else if (err.message) {
                        errorMessage = err.message;
                    }

                    set({
                        error: errorMessage,
                        isLoading: false
                    });

                    // If unverified, pass extra data
                    const errorData = err.response?.data;
                    if (errorData?.unverified) {
                        return { unverified: true, user_id: errorData.user_id, email: errorData.email };
                    }

                    throw err;
                }
            },

            /**
             * Register new user
             */
            register: async (data: RegisterData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authApi.register(data);

                    console.log('🔵 AUTH STORE - Register API Response:', response);

                    // Auto-login logic (OTP Disabled)
                    if (response.accessToken) {
                        const user: User = {
                            user_id: response.user_id,
                            full_name: response.full_name,
                            email: response.email,
                            role: response.role
                        };

                        // Store token in localStorage
                        localStorage.setItem('token', response.accessToken);
                        if (response.refreshToken) {
                            localStorage.setItem('refreshToken', response.refreshToken);
                        }
                        if (response.role) {
                            localStorage.setItem('user_role', response.role.toLowerCase());
                        }

                        set({
                            user,
                            token: response.accessToken,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        });
                        console.log('✅ AUTH STORE - Auto-login complete after registration');
                    } else {
                        // Fallback in case backend doesn't return tokens (shouldn't happen with new backend)
                        set({
                            isLoading: false,
                            error: null
                        });
                    }

                    return response;
                } catch (err: any) {
                    console.error('🔴 AUTH STORE - Register Error (Full):', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
                    console.error('🔴 AUTH STORE - Register Response Data:', err.response?.data);

                    // Extract the most specific error message possible
                    let errorMessage = 'Registration failed';

                    if (err.response) {
                        // Server responded with a status code outside 2xx range
                        const data = err.response.data;
                        if (data?.errors && Array.isArray(data.errors)) {
                            errorMessage = data.errors.map((e: any) => e.message).join(', ');
                        } else if (data?.message) {
                            errorMessage = data.message;
                        } else if (data?.error?.message) {
                            // Handle nested error object (dev mode)
                            errorMessage = data.error.message;
                        } else if (typeof data === 'string') {
                            errorMessage = data; // HTML response or raw string
                        } else {
                            errorMessage = `Registration failed (${err.response.status}: ${err.response.statusText})`;
                        }
                    } else if (err.request) {
                        // Request was made but no response received
                        errorMessage = 'No response from server. Check your internet connection.';
                    } else if (err.message) {
                        errorMessage = err.message;
                    }

                    set({
                        error: errorMessage,
                        isLoading: false
                    });

                    throw err;
                }
            },

            /**
             * Verify Registration OTP
             */
            verifyOTP: async (user_id: string, otp_code: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authApi.verifyOTP(user_id, otp_code);

                    const user: User = {
                        user_id: response.user_id,
                        full_name: response.full_name,
                        email: response.email,
                        role: response.role
                    };

                    // Store token in localStorage
                    if (response.accessToken) {
                        localStorage.setItem('token', response.accessToken);
                    }

                    set({
                        user,
                        token: response.accessToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                } catch (err: any) {
                    const errorMessage = err.response?.data?.message || 'Verification failed';
                    set({ error: errorMessage, isLoading: false });
                    throw err;
                }
            },

            /**
             * Resend Registration OTP
             */
            resendOTP: async (user_id: string) => {
                set({ isLoading: true, error: null });

                try {
                    await authApi.resendOTP(user_id);
                    set({ isLoading: false });
                } catch (err: any) {
                    const errorMessage = err.response?.data?.message || 'Failed to resend code';
                    set({ error: errorMessage, isLoading: false });
                    throw err;
                }
            },

            /**
             * Logout user
             */
            logout: async () => {
                // Clear state IMMEDIATELY for realtime UX
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                localStorage.removeItem('user_role');

                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null
                });

                // Call API in background to invalidate session on server
                try {
                    await authApi.logout();
                } catch (err) {
                    console.error('Logout error (background):', err);
                }
            },

            /**
             * Clear error message
             */
            clearError: () => {
                set({ error: null });
            },

            /**
             * Set user (for token refresh)
             */
            setUser: (user: User) => {
                set({ user, isAuthenticated: true });
            },

            /**
             * Set token (for refresh)
             */
            setToken: (token: string) => {
                set({ token });
                localStorage.setItem('token', token);
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);
