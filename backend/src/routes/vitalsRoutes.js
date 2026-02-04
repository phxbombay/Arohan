import express from 'express';
import { syncVitals, getLiveVitals, getHistoryVitals } from '../controllers/vitalsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/sync', protect, syncVitals);
router.get('/live', protect, getLiveVitals);
router.get('/history', protect, getHistoryVitals);

export default router;
