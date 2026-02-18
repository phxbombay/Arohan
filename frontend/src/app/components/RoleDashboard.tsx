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

    // Role-based redirection
    if (user?.role) {
        const role = user.role.toLowerCase();

        if (role === 'admin') {
            console.log('✅ Admin user detected - Redirecting to /admin');
            return <Navigate to="/admin" replace />;
        }

        if (['physician', 'doctor'].includes(role)) {
            console.log('✅ Physician/Doctor detected - Redirecting to /physician/dashboard');
            return <Navigate to="/physician/dashboard" replace />;
        }

        if (role === 'hospital_admin') {
            console.log('✅ Hospital Admin detected - Redirecting to /hospital/dashboard');
            return <Navigate to="/hospital/dashboard" replace />;
        }

        if (role === 'patient') {
            console.log('✅ Patient detected - Redirecting to /patient/dashboard');
            return <Navigate to="/patient/dashboard" replace />;
        }
    }

    // Default: Show children (HealthDashboard)
    console.log('📍 Default - Showing children');
    return <>{children}</>;
}
