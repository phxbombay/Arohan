/**
 * useAdmin Hook
 * Convenience hook for admin operations
 */

import { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import type { AdminStats } from '../types/admin.types';

export const useAdmin = () => {
    return {
        api: adminApi
    };
};

/**
 * useAdminStats Hook
 * Fetches and manages admin stats
 */
export const useAdminStats = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminApi.getStats();
            setStats(data);
        } catch (err: any) {
            console.error('Failed to fetch admin stats:', err);
            setError(err.message || 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return {
        stats,
        loading,
        error,
        refetch: fetchStats
    };
};
