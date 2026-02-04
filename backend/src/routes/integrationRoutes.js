import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { syncExternalData, getConnectedProviders } from '../controllers/healthIntegrationController.js';

const router = express.Router();

router.post('/sync/:provider', protect, syncExternalData);
router.get('/providers', protect, getConnectedProviders);

export default router;
