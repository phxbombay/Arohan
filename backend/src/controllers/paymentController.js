import Razorpay from 'razorpay';
import crypto from 'crypto';
import pool from '../config/db.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a new payment order
// @route   POST /v1/payment/create-order
// @access  Protected
export const createOrder = async (req, res) => {
    const { amount, currency = 'INR', receipt_id } = req.body;
    const userId = req.user.user_id;

    if (!amount) {
        return res.status(400).json({ message: 'Amount is required' });
    }

    try {
        const options = {
            amount: Math.round(amount * 100), // Razorpay works in paise
            currency,
            receipt: receipt_id || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        };

        const order = await razorpay.orders.create(options);

        // Store order intent in DB
        await pool.query(
            'INSERT INTO orders (order_id, user_id, amount, currency, receipt, status) VALUES (?, ?, ?, ?, ?, ?)',
            [order.id, userId, order.amount, order.currency, order.receipt, 'created']
        );

        res.json(order);
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

// @desc    Verify payment signature and record transaction
// @route   POST /v1/payment/verify
// @access  Protected
export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        let connection;

        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // 1. Update Order Status
            await connection.query(
                'UPDATE orders SET status = ? WHERE order_id = ?',
                ['paid', razorpay_order_id]
            );

            // 2. Insert Payment Record
            await connection.query(
                `INSERT INTO payments (payment_id, order_id, signature, amount, method, status) 
                 VALUES (?, ?, ?, ?, ?, 'success')`,
                [razorpay_payment_id, razorpay_order_id, razorpay_signature, 0, 'unknown']
            );

            await connection.commit();

            res.json({ message: 'Payment verified successfully', paymentId: razorpay_payment_id });

        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Payment Verification DB Error:', error);
            res.status(500).json({ message: 'Internal Server Error during verification' });
        } finally {
            if (connection) connection.release();
        }
    } else {
        res.status(400).json({ message: 'Invalid signature' });
    }
};

// @desc    Handle Razorpay Webhooks
// @route   POST /v1/payment/webhook
// @access  Public
export const handleWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        const event = req.body;
        const { id: eventId, event: eventType, payload } = event;

        try {
            // Idempotency Check
            const [existingLog] = await pool.query('SELECT 1 FROM webhook_logs WHERE event_id = ?', [eventId]);
            if (existingLog.length > 0) {
                console.log(`Webhook ${eventId} already processed.`);
                return res.json({ status: 'ok', message: 'Already processed' });
            }

            // Log the event
            await pool.query(
                'INSERT INTO webhook_logs (event_id, event_type, payload) VALUES (?, ?, ?)',
                [eventId, eventType, JSON.stringify(payload)]
            );

            if (eventType === 'payment.captured') {
                const payment = payload.payment.entity;
                const orderId = payment.order_id;

                await pool.query(
                    'UPDATE orders SET status = ? WHERE order_id = ?',
                    ['paid', orderId]
                );
            }

            res.json({ status: 'ok' });
        } catch (error) {
            console.error('Webhook processing error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(400).json({ message: 'Invalid signature' });
    }
};
