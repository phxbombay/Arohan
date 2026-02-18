import express from 'express';
import { getStats, getPatients, getAlerts } from '../controllers/physicianController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// All physician routes are protected and require physician/admin role
router.use(protect);
router.use(requireRole(['physician', 'admin']));

router.get('/stats', getStats);
router.get('/patients', getPatients);
router.get('/alerts', getAlerts);

export default router;
