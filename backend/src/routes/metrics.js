import express from 'express';
import os from 'os';
import pool from '../config/db.js';
import { getMetrics } from '../middleware/metrics.js';

const router = express.Router();

/**
 * Health and metrics endpoint
 * Provides system health status and performance metrics
 */

// Prometheus metrics endpoint
router.get('/', getMetrics);

router.get('/health/detailed', async (req, res) => {
    try {
        const metrics = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),

            // System metrics
            system: {
                platform: os.platform(),
                arch: os.arch(),
                cpus: os.cpus().length,
                totalMemory: os.totalmem(),
                freeMemory: os.freemem(),
                memoryUsage: process.memoryUsage(),
                loadAverage: os.loadavg(),
            },

            // Process metrics
            process: {
                pid: process.pid,
                version: process.version,
                nodeVersion: process.versions.node,
                uptime: process.uptime(),
            },

            // Database metrics
            database: await getDatabaseMetrics(),
        };

        res.json(metrics);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve metrics',
            error: error.message,
        });
    }
});

/**
 * Simple readiness probe
 */
router.get('/health/ready', async (req, res) => {
    try {
        // Check database connection
        await pool.query('SELECT 1');

        res.json({
            status: 'ready',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(503).json({
            status: 'not_ready',
            error: error.message,
        });
    }
});

/**
 * Liveness probe
 */
router.get('/health/live', (req, res) => {
    res.json({
        status: 'alive',
        timestamp: new Date().toISOString(),
    });
});

/**
 * Get database connection pool metrics
 */
async function getDatabaseMetrics() {
    try {
        const poolStats = {
            totalCount: pool.totalCount,
            idleCount: pool.idleCount,
            waitingCount: pool.waitingCount,
        };

        // Test query performance
        const start = Date.now();
        await pool.query('SELECT 1');
        const queryTime = Date.now() - start;

        return {
            status: 'connected',
            pool: poolStats,
            queryTime: `${queryTime}ms`,
        };
    } catch (error) {
        return {
            status: 'disconnected',
            error: error.message,
        };
    }
}

export default router;
