import express from 'express';
import { triggerAlert, resolveAlert, getActiveAlerts } from '../controllers/alertsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/trigger', protect, triggerAlert);
router.put('/:id/resolve', protect, resolveAlert);
router.get('/active', protect, getActiveAlerts);

export default router;
