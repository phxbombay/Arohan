import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    if (allowedRoles && user) {
        // Normalize roles to lowercase for comparison
        const userRoleLower = user.role.toLowerCase();
        const allowedRolesLower = allowedRoles.map(r => r.toLowerCase());

        if (!allowedRolesLower.includes(userRoleLower)) {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
}

