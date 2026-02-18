import pool from '../config/db.js';
import logger from '../config/logger.js';

/**
 * physicianController.js
 * Handles requests from the Physician Dashboard
 */

export const getStats = async (req, res) => {
    try {
        // Mocking stats based on real table counts
        const [[{ totalPatients }]] = await pool.query("SELECT COUNT(*) as totalPatients FROM users WHERE role = 'patient'");
        const [[{ activeAlerts }]] = await pool.query("SELECT COUNT(*) as activeAlerts FROM emergency_alerts WHERE status = 'triggered'");

        res.json({
            status: 'success',
            data: {
                totalPatients: totalPatients || 0,
                activeAlerts: activeAlerts || 0,
                appointmentsToday: 5, // Mocked for now
                criticalCases: activeAlerts || 0
            }
        });
    } catch (error) {
        logger.error('Error fetching physician stats:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch stats' });
    }
};

export const getPatients = async (req, res) => {
    try {
        // Fetch all patients with their latest vitals
        const query = `
            SELECT u.user_id, u.full_name, u.email, 
                   hv.heart_rate, hv.recorded_at as last_check
            FROM users u
            LEFT JOIN (
                SELECT user_id, heart_rate, recorded_at
                FROM health_vitals hv1
                WHERE recorded_at = (SELECT MAX(recorded_at) FROM health_vitals hv2 WHERE hv1.user_id = hv2.user_id)
            ) hv ON u.user_id = hv.user_id
            WHERE u.role = 'patient'
            LIMIT 50
        `;

        const [rows] = await pool.query(query);

        const patients = rows.map(r => ({
            user_id: r.user_id,
            full_name: r.full_name,
            email: r.email,
            latest_vitals: {
                heart_rate: r.heart_rate || '--',
                blood_pressure: '120/80' // Placeholder
            },
            status: r.heart_rate > 100 ? 'Critical' : 'Stable'
        }));

        res.json({
            status: 'success',
            data: patients
        });
    } catch (error) {
        logger.error('Error fetching physician patients:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch patients' });
    }
};

export const getAlerts = async (req, res) => {
    try {
        const query = `
            SELECT a.*, u.full_name as patient_name
            FROM emergency_alerts a
            JOIN users u ON a.user_id = u.user_id
            ORDER BY a.triggered_at DESC
            LIMIT 20
        `;

        const [rows] = await pool.query(query);

        const alerts = rows.map(r => ({
            id: r.alert_id,
            patient_name: r.patient_name,
            alert_type: r.type,
            severity: r.type === 'cardiac_arrest' ? 'critical' : 'high',
            created_at: r.triggered_at,
            status: r.status
        }));

        res.json({
            status: 'success',
            data: alerts
        });
    } catch (error) {
        logger.error('Error fetching physician alerts:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch alerts' });
    }
};
