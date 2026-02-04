import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting specifically for contact form
router.post('/', apiLimiter, submitContactForm);

export default router;
