import express from 'express';
import { createOrder, verifyPayment, getOrderStatus, createQrCode, checkQrStatus, createCodOrder, handleWebhook } from '../controllers/razorpayController.js';

const router = express.Router();

/**
 * @route   POST /v1/orders/create
 * @desc    Create order (Online or COD)
 * @access  Public
 * @body    { amount, currency, paymentMethod, customerDetails, items }
 */
router.post('/create', createOrder);

/**
 * @route   POST /v1/orders/verify
 * @desc    Verify Razorpay payment signature
 * @access  Public
 * @body    { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
router.post('/verify', verifyPayment);

/**
 * @route   GET /v1/orders/:orderId
 * @desc    Get order status
 * @access  Public
 */
router.get('/:orderId', getOrderStatus);

/**
 * @route   POST /v1/orders/create-qr
 * @desc    Create UPI QR Code for payment
 * @access  Public
 * @body   { amount, user_email }
 */
router.post('/create-qr', createQrCode);

/**
 * @route   GET /v1/orders/check-qr/:qrId
 * @desc    Check QR Code payment status
 * @access  Public
 */
router.get('/check-qr/:qrId', checkQrStatus);

/**
 * @route   POST /v1/orders/create-cod
 * @desc    Create Cash on Delivery Order
 * @access  Public
 */
router.post('/create-cod', createCodOrder);

/**
 * @route   POST /v1/orders/webhook
 * @desc    Handle Razorpay webhooks
 * @access  Public (Razorpay servers)
 */
router.post('/webhook', handleWebhook);

export default router;
