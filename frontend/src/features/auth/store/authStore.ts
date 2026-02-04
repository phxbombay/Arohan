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
                        user_id: response.user_id,  // ✅ Fixed: was userId, should be user_id
                        full_name: response.full_name,
                        email: response.email,
                        role: response.role
                    };

                    console.log('🔵 AUTH STORE - Created User object:', user);
                    console.log('🔵 User role:', user.role, 'Type:', typeof user.role);

                    // Store token in localStorage for API client
                    localStorage.setItem('token', response.accessToken);

                    set({
                        user,
                        token: response.accessToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });

                    console.log('✅ AUTH STORE - Login complete. Final user:', get().user);
                } catch (err: any) {
                    const errorMessage = err.response?.data?.errors
                        ? err.response.data.errors.map((e: any) => e.message).join(', ')
                        : (err.response?.data?.message || 'Login failed');

                    set({
                        error: errorMessage,
                        isLoading: false
                    });

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

                    const user: User = {
                        user_id: response.user_id,
                        full_name: response.full_name,
                        email: response.email,
                        role: response.role
                    };

                    // Store token in localStorage for API client
                    localStorage.setItem('token', response.accessToken);

                    set({
                        user,
                        token: response.accessToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                } catch (err: any) {
                    const errorMessage = err.response?.data?.errors
                        ? err.response.data.errors.map((e: any) => e.message).join(', ')
                        : (err.response?.data?.message || 'Registration failed');

                    set({
                        error: errorMessage,
                        isLoading: false
                    });

                    throw err;
                }
            },

            /**
             * Logout user
             */
            logout: async () => {
                try {
                    await authApi.logout();
                } catch (err) {
                    console.error('Logout error:', err);
                } finally {
                    // Clear state regardless of API call result
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');

                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        error: null
                    });
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
