import pool from '../config/db.js';
import notificationService from '../services/notificationService.js';
import { decrypt } from '../utils/encryption.js';
import { auditLog } from '../middleware/auditLog.js';

// @desc    Trigger emergency alert
// @route   POST /v1/alerts/trigger
// @access  Private
export const triggerAlert = async (req, res) => {
    const { type, location } = req.body;
    const user_id = req.user.user_id;

    try {
        const query = `
      INSERT INTO emergency_alerts (user_id, type, latitude, longitude)
      VALUES ($1, $2, $3, $4)
      RETURNING alert_id, status, triggered_at
    `;

        const result = await pool.query(query, [
            user_id,
            type || 'manual_sos',
            location?.lat || null,
            location?.lng || null,
        ]);

        const newAlert = result.rows[0];

        // 1. Fetch Emergency Contacts
        const contactsResult = await pool.query(
            'SELECT * FROM emergency_contacts WHERE user_id = $1 ORDER BY priority ASC',
            [user_id]
        );

        const contacts = contactsResult.rows.map(c => ({
            ...c,
            phone: decrypt(c.phone) || c.phone // Ensure we have the raw number for sending SMS
        }));

        // 2. Fetch User Profile for name
        const userRes = await pool.query('SELECT full_name FROM users WHERE user_id = $1', [user_id]);
        const userName = userRes.rows[0]?.full_name || 'Arohan User';

        // 3. Broadcast Alerts
        const notificationPromises = contacts.map(contact =>
            notificationService.broadcastEmergency(contact, {
                user: userName,
                type: type || 'manual_sos',
                location: location || { lat: 0, lng: 0 }
            })
        );

        await Promise.all(notificationPromises);

        // 4. Log the critical event for audit
        await auditLog('trigger_emergency_alert', 'emergency_alerts', {
            userId: user_id,
            resourceId: newAlert.alert_id,
            metadata: { contactsNotified: contacts.length, type }
        });

        res.status(201).json({
            alert_id: newAlert.alert_id,
            status: newAlert.status,
            triggered_at: newAlert.triggered_at,
            message: `Emergency alert triggered. ${contacts.length} contacts notified.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark alert as resolved
// @route   PUT /v1/alerts/:id/resolve
// @access  Private (Caregiver/Admin/User)
export const resolveAlert = async (req, res) => {
    const { id } = req.params;
    const { status, note } = req.body; // status: 'resolved'

    try {
        const query = `
      UPDATE emergency_alerts
      SET status = $1, resolved_at = NOW()
      WHERE alert_id = $2
      RETURNING alert_id, status, resolved_at
    `;

        // In production, verify user has permission to resolve this specific alert

        const result = await pool.query(query, [status || 'resolved', id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Alert not found' })
        }

        res.json({ updated: true, alert: result.rows[0], note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Check active alerts
// @route   GET /v1/alerts/active
// @access  Private
export const getActiveAlerts = async (req, res) => {
    try {
        // Retrieve active alerts for the user or their family
        // For simple MVP, just get user's active alerts
        const user_id = req.user.user_id;

        const result = await pool.query(
            "SELECT * FROM emergency_alerts WHERE user_id = $1 AND status = 'triggered'",
            [user_id]
        );

        res.json({ active_alerts: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
