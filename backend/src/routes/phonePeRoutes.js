import express from 'express';
import * as phonePeController from '../controllers/phonePeController.js';

const router = express.Router();

/**
 * @route   POST /api/phonepe/pay
 * @desc    Initiate PhonePe payment
 * @access  Public
 * @body    { amount, mobile, userName, userId, orderId }
 */
router.post('/pay', phonePeController.initiatePayment);

/**
 * @route   GET /api/phonepe/status/:txnId
 * @desc    Check payment status
 * @access  Public
 */
router.get('/status/:txnId', phonePeController.checkPaymentStatus);

/**
 * @route   POST /api/phonepe/callback
 * @desc    Handle PhonePe callback (webhook)
 * @access  Public (PhonePe servers)
 */
router.post('/callback', phonePeController.handleCallback);

export default router;
