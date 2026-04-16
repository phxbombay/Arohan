import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuth();
    console.log('🛡️ ProtectedRoute Check:', { path: window.location.pathname, isAuthenticated, role: user?.role, allowedRoles });

    if (!isAuthenticated) {
        console.warn('⛔ ProtectedRoute: Not authenticated, redirecting to /signin');
        return <Navigate to="/signin" replace />;
    }

    if (allowedRoles && user) {
        const userRoleLower = user.role.toLowerCase();

        // ✅ Admin has FULL access — bypasses all role restrictions
        if (userRoleLower === 'admin') {
            console.log('✅ ProtectedRoute: Admin bypass — full access granted');
            return <>{children}</>;
        }

        const allowedRolesLower = allowedRoles.map(r => r.toLowerCase());

        if (!allowedRolesLower.includes(userRoleLower)) {
            console.warn(`⛔ ProtectedRoute: Role mismatch. User: ${userRoleLower}, Allowed: ${allowedRolesLower}. Redirecting to /dashboard.`);
            return <Navigate to="/dashboard" replace />;
        }
        console.log('✅ ProtectedRoute: Access granted');
    }

    return <>{children}</>;
}
