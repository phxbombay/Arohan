import pool from '../config/db.js';
import logger from '../config/logger.js';
import NotificationService from '../services/notificationService.js';

/**
 * Health Data Integration Controller
 * Handles synchronization with external providers (Google Fit, Apple Health)
 */

// @desc    Sync external health data (Webhook/API)
// @route   POST /v1/integration/sync/:provider
// @access  Private
export const syncExternalData = async (req, res) => {
    const { provider } = req.params; // 'google-fit', 'apple-health'
    const { metrics, timestamp } = req.body;
    const userId = req.user.user_id;

    try {
        if (!metrics || !Array.isArray(metrics)) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        // Normalize data based on provider
        const normalizedData = metrics.map(metric => ({
            userId,
            provider,
            type: metric.type, // e.g., 'heart_rate', 'steps'
            value: metric.value,
            unit: metric.unit,
            recordedAt: metric.timestamp || timestamp || new Date().toISOString()
        }));

        // In a real app, we would insert into a time-series DB or specialized table
        // For MVP, we'll store in the `health_vitals` table if it matches schema, 
        // or just log it for now as "processed".

        let processedCount = 0;

        // Simulating processing logic
        for (const data of normalizedData) {
            // Check for critical anomalies during sync
            if (data.type === 'heart_rate' && data.value > 150) {
                await NotificationService.sendSMS(
                    req.user.phone || '0000000000', // Assuming phone is in user obj or need fetch
                    `AROHAN WARN: High heart rate (${data.value} bpm) detected from ${provider}`
                );
            }

            // Here we would insert into DB
            processedCount++;
        }

        logger.info(`Synced ${processedCount} records from ${provider}`, { userId });

        res.json({
            status: 'success',
            synced: processedCount,
            provider,
            lastSync: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Integration Sync Error:', error);
        res.status(500).json({ message: 'Sync failed' });
    }
};

// @desc    Get connected providers
// @route   GET /v1/integration/providers
// @access  Private
export const getConnectedProviders = async (req, res) => {
    // Mock response for MVP
    res.json({
        providers: [
            { id: 'google-fit', name: 'Google Fit', connected: true, lastSync: '2025-01-20T10:00:00Z' },
            { id: 'apple-health', name: 'Apple Health', connected: false }
        ]
    });
};
