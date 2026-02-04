import { Navigate } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';

/**
 * RoleDashboard - Routes users to correct dashboard based on role
 * - Admin users → /admin (admin dashboard)
 * - Regular users → HealthDashboard (patient/health dashboard)
 */
export function RoleDashboard({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    console.log('🔍 RoleDashboard - Checking user role:', user?.role);

    // If user is admin, redirect to admin dashboard
    if (user?.role && user.role.toLowerCase() === 'admin') {
        console.log('✅ Admin user detected - Redirecting to /admin');
        return <Navigate to="/admin" replace />;
    }

    // Regular users see the health dashboard
    console.log('📍 Regular user - Showing health dashboard');
    return <>{children}</>;
}
