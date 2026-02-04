import express from 'express';
const router = express.Router();
import HealthDataGenerator from '../services/healthDataGenerator.js';
import HealthAnalyzer from '../services/healthAnalyzer.js';
import pool from '../config/db.js';

// In-memory store for generators (kept for performance)
const userHealthData = new Map();
const analyzer = new HealthAnalyzer();

/**
 * GET /api/health/simulate
 * Start simulating health data for a user
 */
router.post('/simulate/start', async (req, res) => {
    try {
        const { userId, userProfile } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const generator = new HealthDataGenerator(userId, userProfile);

        // Store generator for this user
        if (!userHealthData.has(userId)) {
            userHealthData.set(userId, {
                generator,
                snapshots: [],
                isActive: true
            });
        }

        res.json({
            status: 'started',
            message: `Health data simulation started for user ${userId}`,
            userId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/health/snapshot
 * Get current health snapshot for a user
 */
router.get('/snapshot/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        let userData = userHealthData.get(userId);

        // Auto-start if not exists
        if (!userData) {
            const generator = new HealthDataGenerator(userId);
            userData = {
                generator,
                snapshots: [],
                isActive: true
            };
            userHealthData.set(userId, userData);
        }

        // Generate new snapshot
        const snapshot = userData.generator.generateSnapshot();

        // Analyze health data
        const analysis = analyzer.analyze(snapshot, {});

        // Store snapshot (keep last 100 in memory for quick access)
        userData.snapshots.push({ snapshot, analysis });
        if (userData.snapshots.length > 100) {
            userData.snapshots.shift();
        }

        // Persist to database
        try {
            await pool.query(
                `INSERT INTO health_simulations (user_id, snapshot_data, analysis_data)
                 VALUES ($1, $2, $3)`,
                [userId, JSON.stringify(snapshot), JSON.stringify(analysis)]
            );
        } catch (dbError) {
            console.error('Failed to persist health snapshot:', dbError);
            // Continue even if DB save fails - data is still in memory
        }

        res.json({
            snapshot,
            analysis,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/health/history/:userId
 * Get historical health data
 */
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50 } = req.query;

        const userData = userHealthData.get(userId);

        if (!userData || userData.snapshots.length === 0) {
            return res.json({
                userId,
                snapshots: [],
                message: 'No data available. Call /simulate/start first.'
            });
        }

        const snapshots = userData.snapshots.slice(-parseInt(limit));

        res.json({
            userId,
            count: snapshots.length,
            snapshots
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/health/emergency
 * Trigger emergency alert
 */
router.post('/emergency', async (req, res) => {
    try {
        const { userId, location, type } = req.body;

        const userData = userHealthData.get(userId);
        const latestSnapshot = userData?.snapshots[userData.snapshots.length - 1];

        // Simulate emergency response
        const emergencyResponse = {
            alertId: `ALERT-${Date.now()}`,
            userId,
            timestamp: new Date().toISOString(),
            type: type || 'manual_sos',
            location: location || latestSnapshot?.snapshot.location,
            vitals: latestSnapshot?.snapshot.vitals,
            status: 'dispatched',
            estimatedArrival: '8 minutes',
            contacts: {
                ambulance: '112',
                nearestHospital: 'Apollo Hospital, Bengaluru',
                emergencyContact: '+91 98765 43210'
            },
            actions: [
                'Emergency services notified',
                'Family members alerted via SMS',
                'Nearest hospital contacted',
                'Location shared with ambulance'
            ]
        };

        res.json(emergencyResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/health/dashboard/:userId
 * Get comprehensive dashboard data
 */
router.get('/dashboard/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        let userData = userHealthData.get(userId);

        // Auto-start if needed
        if (!userData) {
            const generator = new HealthDataGenerator(userId);
            const snapshot = generator.generateSnapshot();
            const analysis = analyzer.analyze(snapshot);

            userData = {
                generator,
                snapshots: [{ snapshot, analysis }],
                isActive: true
            };
            userHealthData.set(userId, userData);
        }

        const latestData = userData.snapshots[userData.snapshots.length - 1];
        const last24Hours = userData.snapshots.slice(-288); // Every 5 min for 24h

        // Calculate trends
        const trends = calculateTrends(last24Hours);

        res.json({
            userId,
            current: latestData,
            trends,
            stats: {
                totalSnapshots: userData.snapshots.length,
                simulationActive: userData.isActive,
                lastUpdate: latestData.snapshot.timestamp
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Helper: Calculate health trends
 */
function calculateTrends(snapshots) {
    if (snapshots.length < 2) return null;

    const heartRates = snapshots.map(s => s.snapshot.vitals.heartRate);
    const steps = snapshots.map(s => s.snapshot.activity.steps);

    return {
        heartRate: {
            current: heartRates[heartRates.length - 1],
            average: Math.round(heartRates.reduce((a, b) => a + b) / heartRates.length),
            min: Math.min(...heartRates),
            max: Math.max(...heartRates),
            trend: heartRates[heartRates.length - 1] > heartRates[0] ? 'increasing' : 'decreasing'
        },
        steps: {
            current: steps[steps.length - 1],
            total: steps[steps.length - 1],
            dailyGoal: 10000,
            progress: Math.round((steps[steps.length - 1] / 10000) * 100)
        }
    };
}

export default router;
