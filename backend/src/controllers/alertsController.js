import pool from '../config/db.js';
import notificationService from '../services/notificationService.js';
import { decrypt } from '../utils/encryption.js';
import { auditLog } from '../middleware/auditLog.js';
import crypto from 'crypto';

// @desc    Trigger emergency alert
// @route   POST /v1/alerts/trigger
// @access  Private
export const triggerAlert = async (req, res) => {
    const { type, location } = req.body;
    const user_id = req.user.user_id;

    try {
        const alert_id = crypto.randomUUID();
        const triggered_at = new Date();
        const status = 'triggered';

        const query = `
      INSERT INTO emergency_alerts (alert_id, user_id, type, latitude, longitude, status, triggered_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        await pool.query(query, [
            alert_id,
            user_id,
            type || 'manual_sos',
            location?.lat || null,
            location?.lng || null,
            status,
            triggered_at
        ]);

        // 1. Fetch Emergency Contacts
        const [contactsRows] = await pool.query(
            'SELECT * FROM emergency_contacts WHERE user_id = ? ORDER BY priority ASC',
            [user_id]
        );

        const contacts = contactsRows.map(c => ({
            ...c,
            phone: decrypt(c.phone) || c.phone // Ensure we have the raw number for sending SMS
        }));

        // 2. Fetch User Profile for name
        const [userRows] = await pool.query('SELECT full_name FROM users WHERE user_id = ?', [user_id]);
        const userName = userRows[0]?.full_name || 'Arohan User';

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
            resourceId: alert_id,
            metadata: { contactsNotified: contacts.length, type }
        });

        res.status(201).json({
            alert_id,
            status,
            triggered_at,
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
    const { status: newStatus, note } = req.body; // status: 'resolved'
    const resolvedStatus = newStatus || 'resolved';
    const resolved_at = new Date();

    try {
        const query = `
      UPDATE emergency_alerts
      SET status = ?, resolved_at = ?
      WHERE alert_id = ?
    `;

        const [result] = await pool.query(query, [resolvedStatus, resolved_at, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Alert not found' })
        }

        res.json({
            updated: true,
            alert: {
                alert_id: id,
                status: resolvedStatus,
                resolved_at
            },
            note
        });
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
        const user_id = req.user.user_id;

        const [rows] = await pool.query(
            "SELECT * FROM emergency_alerts WHERE user_id = ? AND status = 'triggered'",
            [user_id]
        );

        res.json({ active_alerts: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
