/**
 * useDashboard Hook
 * Convenience hook for accessing dashboard store
 */

import { useDashboardStore } from '../store/dashboardStore';
import { dashboardConfig } from '../config/dashboardConfig';

export const useDashboard = () => {
    const {
        widgets,
        customSections,
        addWidget,
        updateWidget,
        removeWidget,
        resetWidgets
    } = useDashboardStore();

    // Quick actions don't need state management, read from config
    const quickActions = dashboardConfig.quickActions;

    return {
        widgets,
        customSections,
        quickActions,
        addWidget,
        updateWidget,
        removeWidget,
        resetWidgets
    };
};
