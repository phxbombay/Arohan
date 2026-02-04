import notificationService from '../services/notificationService.js';
import logger from '../config/logger.js';

export const subscribe = async (req, res, next) => {
    try {
        const { subscription } = req.body;
        const userAgent = req.headers['user-agent'];

        await notificationService.subscribe(req.user.id, subscription, userAgent);

        res.status(201).json({ message: 'Subscribed to notifications' });
    } catch (error) {
        next(error);
    }
};

export const sendTestNotification = async (req, res, next) => {
    try {
        const { userId, title, body } = req.body;

        // Only allow admins or self
        if (req.user.role !== 'admin' && req.user.id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const payload = {
            title: title || 'Test Notification',
            body: body || 'This is a test notification from Arohan Health.',
            icon: '/icon-192.png',
            data: { url: '/' }
        };

        const result = await notificationService.sendNotification(userId, payload);

        res.json({ message: 'Notification sent', ...result });
    } catch (error) {
        next(error);
    }
};

export const getVapidKey = (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};
