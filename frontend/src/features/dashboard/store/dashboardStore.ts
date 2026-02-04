/**
 * Dashboard Store
 * Manages dashboard state (widgets, sections)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Widget, CustomSection } from '../types/dashboard.types';
import { dashboardConfig } from '../config/dashboardConfig';

interface DashboardState {
    widgets: Widget[];
    customSections: CustomSection[];

    // Actions
    addWidget: (widget: Widget) => void;
    updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
    removeWidget: (widgetId: string) => void;
    resetWidgets: () => void;
}

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set) => ({
            widgets: dashboardConfig.widgets,
            customSections: dashboardConfig.customSections,

            addWidget: (widget) =>
                set((state) => ({
                    widgets: [...state.widgets, widget]
                })),

            updateWidget: (widgetId, updates) =>
                set((state) => ({
                    widgets: state.widgets.map((w) =>
                        w.id === widgetId ? { ...w, ...updates } : w
                    )
                })),

            removeWidget: (widgetId) =>
                set((state) => ({
                    widgets: state.widgets.filter((w) => w.id !== widgetId)
                })),

            resetWidgets: () =>
                set({
                    widgets: dashboardConfig.widgets,
                    customSections: dashboardConfig.customSections
                })
        }),
        {
            name: 'dashboard-storage',
            partialize: (state) => ({
                widgets: state.widgets,
                customSections: state.customSections
            })
        }
    )
);
