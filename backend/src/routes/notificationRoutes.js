import express from 'express';
import { subscribe, sendTestNotification, getVapidKey } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/vapid-key', getVapidKey);
router.post('/subscribe', protect, subscribe);
router.post('/send-test', protect, sendTestNotification);
router.get('/vapid-key', protect, getVapidKey);

export default router;
