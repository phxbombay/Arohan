import express from 'express';
import { pairDevice, getUserDevices, updateDeviceSettings } from '../controllers/devicesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/pair', protect, pairDevice);
router.get('/', protect, getUserDevices);
router.put('/:id/settings', protect, updateDeviceSettings);

export default router;
