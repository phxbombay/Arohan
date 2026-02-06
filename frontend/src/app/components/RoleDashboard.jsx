import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function RoleDashboard({ children }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    // Role-based redirection logic
    if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    if (user.role === 'physician' || user.role === 'doctor') {
        return <Navigate to="/physician/dashboard" replace />;
    }

    if (user.role === 'hospital_admin') {
        return <Navigate to="/hospital/dashboard" replace />;
    }

    // If it's a patient, or default, render children (which is typically PatientDashboard)
    // OR redirect to /patient/dashboard specific route
    if (user.role === 'patient') {
        return <Navigate to="/patient/dashboard" replace />;
    }

    // Fallback if role doesn't match specific dashboards but accessing /dashboard
    // Maybe render a generic dashboard or errors
    return children;
}
