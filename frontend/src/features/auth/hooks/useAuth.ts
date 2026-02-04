/**
 * useAuth Hook
 * Convenience hook for accessing auth store
 */

import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
    const {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError
    } = useAuthStore();

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError
    };
};
