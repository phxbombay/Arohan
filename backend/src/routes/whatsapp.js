import express from 'express';
import { body, validationResult } from 'express-validator';
import { whatsappService } from '../services/whatsapp.js';
import logger from '../config/logger.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/whatsapp/send-message
 * @desc    Send WhatsApp message
 * @access  Private
 */
router.post(
    '/send-message',
    protect,
    [
        body('to').notEmpty().withMessage('Recipient phone number is required'),
        body('message').notEmpty().withMessage('Message is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 'fail',
                    errors: errors.array()
                });
            }

            const { to, message } = req.body;

            const result = await whatsappService.sendTextMessage(to, message);

            if (result.success) {
                res.json({
                    status: 'success',
                    message: 'WhatsApp message sent successfully',
                    data: {
                        messageId: result.messageId
                    }
                });
            } else {
                res.status(500).json({
                    status: 'error',
                    message: result.error
                });
            }
        } catch (error) {
            logger.error('Error sending WhatsApp message:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to send WhatsApp message'
            });
        }
    }
);

/**
 * @route   POST /api/whatsapp/send-emergency-alert
 * @desc    Send emergency alert via WhatsApp
 * @access  Private
 */
router.post(
    '/send-emergency-alert',
    protect,
    [
        body('to').notEmpty().withMessage('Emergency contact is required'),
        body('alertData').notEmpty().withMessage('Alert data is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 'fail',
                    errors: errors.array()
                });
            }

            const { to, alertData } = req.body;

            const result = await whatsappService.sendEmergencyAlert(to, alertData);

            if (result.success) {
                res.json({
                    status: 'success',
                    message: 'Emergency alert sent successfully',
                    data: {
                        messageId: result.messageId
                    }
                });
            } else {
                res.status(500).json({
                    status: 'error',
                    message: result.error
                });
            }
        } catch (error) {
            logger.error('Error sending emergency alert:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to send emergency alert'
            });
        }
    }
);

/**
 * @route   POST /api/whatsapp/webhook
 * @desc    WhatsApp webhook for receiving messages
 * @access  Public
 */
router.post('/webhook', async (req, res) => {
    try {
        const { entry } = req.body;

        if (entry && entry[0]?.changes) {
            const change = entry[0].changes[0];
            const value = change.value;

            if (value.messages) {
                const message = value.messages[0];
                logger.info('Received WhatsApp message:', {
                    from: message.from,
                    type: message.type,
                    timestamp: message.timestamp
                });

                // TODO: Process incoming message
                // Can be used for chatbot responses, user queries, etc.
            }
        }

        res.sendStatus(200);
    } catch (error) {
        logger.error('Error processing WhatsApp webhook:', error);
        res.sendStatus(500);
    }
});

/**
 * @route   GET /api/whatsapp/webhook
 * @desc    WhatsApp webhook verification
 * @access  Public
 */
router.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'arohan_verify_token';

    if (mode === 'subscribe' && token === verifyToken) {
        logger.info('WhatsApp webhook verified');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

export default router;
