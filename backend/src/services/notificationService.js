import webpush from 'web-push';
import pool from '../config/db.js';
import logger from '../config/logger.js';
import { DatabaseError, NotFoundError } from '../utils/errors.js';

class NotificationService {
    constructor() {
        // Initialize VAPID keys
        if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
            webpush.setVapidDetails(
                'mailto:admin@arohanhealth.com',
                process.env.VAPID_PUBLIC_KEY,
                process.env.VAPID_PRIVATE_KEY
            );
        } else {
            logger.warn('VAPID keys not configured. Push notifications will not work.');
        }
    }

    /**
     * Save a user's push subscription
     */
    async subscribe(userId, subscription, userAgent) {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const { endpoint, keys } = subscription;

            // Check if subscription already exists
            const [existing] = await connection.query(
                'SELECT id FROM push_subscriptions WHERE user_id = ? AND endpoint = ?',
                [userId, endpoint]
            );

            if (existing.length === 0) {
                await connection.query(
                    `INSERT INTO push_subscriptions 
                    (user_id, endpoint, p256dh, auth, user_agent) 
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        userId,
                        endpoint,
                        keys.p256dh,
                        keys.auth,
                        userAgent
                    ]
                );
            }

            await connection.commit();
            return { subscribed: true };
        } catch (error) {
            if (connection) await connection.rollback();
            logger.error('Error saving subscription', { error: error.message, userId });
            throw new DatabaseError('Failed to save subscription');
        } finally {
            if (connection) connection.release();
        }
    }

    /**
     * Send push notification to a user
     */
    async sendNotification(userId, payload) {
        try {
            // Get all subscriptions for user
            const [subscriptions] = await pool.query(
                'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?',
                [userId]
            );

            if (subscriptions.length === 0) {
                logger.info(`No subscriptions found for user ${userId}`);
                return { sent: 0, failed: 0 };
            }

            const notifications = subscriptions.map(sub => {
                const pushConfig = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth
                    }
                };

                return webpush.sendNotification(pushConfig, JSON.stringify(payload))
                    .catch(error => {
                        if (error.statusCode === 410) {
                            // Expired subscription, remove it
                            this.removeSubscription(sub.endpoint);
                        }
                        throw error;
                    });
            });

            const results = await Promise.allSettled(notifications);
            const sent = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;

            return { sent, failed };
        } catch (error) {
            logger.error('Error sending notification', { error: error.message, userId });
            throw new Error('Failed to send notifications');
        }
    }

    async removeSubscription(endpoint) {
        try {
            await pool.query('DELETE FROM push_subscriptions WHERE endpoint = ?', [endpoint]);
        } catch (error) {
            logger.error('Error removing subscription', { error: error.message });
        }
    }
}

// Import emergency alert service for email/SMS
export { broadcastEmergency } from './emergencyAlertService.js';

export default new NotificationService();
