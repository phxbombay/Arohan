import crypto from 'crypto';
import pool from '../config/db.js';
import notificationService from '../services/notificationService.js';
import logger from '../config/logger.js';
import {
    SUPPORTED_ALERT_CHANNELS,
    normalizeAlertChannels,
    parseStoredAlertChannels,
} from '../services/emergencyAlertService.js';
import { decrypt } from '../utils/encryption.js';
import { auditLog } from '../middleware/auditLog.js';

const deserializeEmergencyContact = (contact) => {
    const phone = contact.phone ? decrypt(contact.phone) || contact.phone : null;
    const preferredChannels = parseStoredAlertChannels(contact.preferred_channels);

    return {
        ...contact,
        phone,
        preferred_channels: preferredChannels,
    };
};

const buildDeliverySummary = (deliveries, requestedChannels) => {
    const channelTotals = Object.fromEntries(
        SUPPORTED_ALERT_CHANNELS.map(channel => [channel, {
            attempted: 0,
            sent: 0,
            failed: 0,
            skipped: 0,
        }])
    );

    for (const delivery of deliveries) {
        for (const channel of delivery.attemptedChannels) {
            channelTotals[channel].attempted += 1;
        }

        for (const channel of delivery.sentChannels) {
            channelTotals[channel].sent += 1;
        }

        for (const channel of delivery.failedChannels) {
            channelTotals[channel].failed += 1;
        }

        for (const channel of delivery.skippedChannels) {
            channelTotals[channel].skipped += 1;
        }
    }

    return {
        requestedChannels,
        contactsProcessed: deliveries.length,
        contactsReached: deliveries.filter(delivery => delivery.sentChannels.length > 0).length,
        totalAttempted: deliveries.reduce((sum, delivery) => sum + delivery.attemptedChannels.length, 0),
        totalSent: deliveries.reduce((sum, delivery) => sum + delivery.sentChannels.length, 0),
        totalFailed: deliveries.reduce((sum, delivery) => sum + delivery.failedChannels.length, 0),
        totalSkipped: deliveries.reduce((sum, delivery) => sum + delivery.skippedChannels.length, 0),
        channelTotals,
    };
};

// @desc    Trigger emergency alert
// @route   POST /v1/alerts/trigger
// @access  Private
export const triggerAlert = async (req, res) => {
    const { type, location, channels } = req.body;
    const user_id = req.user.user_id;
    const requestedChannels = normalizeAlertChannels(channels, { defaultToAll: true });

    if (channels !== undefined && requestedChannels.length === 0) {
        return res.status(400).json({
            message: 'At least one supported alert channel is required',
            supported_channels: SUPPORTED_ALERT_CHANNELS,
        });
    }

    try {
        const alert_id = crypto.randomUUID();
        const triggered_at = new Date();
        const status = 'triggered';
        const alertType = type || 'manual_sos';
        const alertLocation = location || { lat: 0, lng: 0 };

        const query = `
      INSERT INTO emergency_alerts (alert_id, user_id, type, latitude, longitude, status, triggered_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        await pool.query(query, [
            alert_id,
            user_id,
            alertType,
            location?.lat || null,
            location?.lng || null,
            status,
            triggered_at
        ]);

        const [contactsRows] = await pool.query(
            'SELECT * FROM emergency_contacts WHERE user_id = ? ORDER BY priority ASC',
            [user_id]
        );

        const contacts = contactsRows.map(deserializeEmergencyContact);

        const [userRows] = await pool.query('SELECT full_name FROM users WHERE user_id = ?', [user_id]);
        const userName = userRows[0]?.full_name || 'Arohan User';

        const deliveryResults = await Promise.all(
            contacts.map(contact =>
                notificationService.broadcastEmergency(
                    contact,
                    {
                        user: userName,
                        type: alertType,
                        location: alertLocation,
                        triggered_at,
                    },
                    { channels: requestedChannels }
                )
            )
        );

        const deliverySummary = buildDeliverySummary(deliveryResults, requestedChannels);

        await auditLog('trigger_emergency_alert', alert_id, {
            userId: user_id,
            resourceId: alert_id,
            metadata: {
                contactsProcessed: contacts.length,
                type: alertType,
                requestedChannels,
                totalSent: deliverySummary.totalSent,
            }
        });

        res.status(201).json({
            alert_id,
            status,
            triggered_at,
            message: `Emergency alert triggered. ${contacts.length} contacts processed across ${requestedChannels.length} channels.`,
            delivery: {
                summary: deliverySummary,
                contacts: deliveryResults,
            }
        });
    } catch (error) {
        logger.error('Trigger alert error', { error: error.message, userId: user_id });
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark alert as resolved
// @route   PUT /v1/alerts/:id/resolve
// @access  Private (Caregiver/Admin/User)
export const resolveAlert = async (req, res) => {
    const { id } = req.params;
    const { status: newStatus, note } = req.body;
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
            return res.status(404).json({ message: 'Alert not found' });
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
        logger.error('Resolve alert error', { error: error.message, alertId: id });
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
        logger.error('Get active alerts error', { error: error.message, userId: req.user.user_id });
        res.status(500).json({ message: 'Server Error' });
    }
};
