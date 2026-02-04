import express from 'express';
import { submitEarlyAccess } from '../controllers/leadController.js';

const router = express.Router();

router.post('/early-access', submitEarlyAccess);

export default router;
