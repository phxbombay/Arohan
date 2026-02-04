import Razorpay from 'razorpay';
import crypto from 'crypto';
import pool from '../config/db.js';

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SAMPLE_KEY',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'SAMPLE_SECRET'
});

/**
 * Create Order - Handles both Online Payments and COD
 * POST /api/orders/create
 * Body: { amount, currency, paymentMethod, customerDetails, items }
 */
export const createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', paymentMethod, customerDetails, items } = req.body;

        // Validation
        if (!amount || amount < 1) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        // 1. Handle Cash on Delivery (No Razorpay interaction)
        if (paymentMethod === 'COD') {
            const orderId = `COD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            // Save to Postgres
            const insertQuery = `
                INSERT INTO orders (order_id, user_id, amount, currency, status, receipt)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
            // Note: user_id is null for guests as per schema
            const userId = req.user ? req.user.id : null;

            const result = await pool.query(insertQuery, [
                orderId,
                userId,
                amount * 100, // Store in paise
                currency,
                'COD_CONFIRMED',
                `receipt_${Date.now()}`
            ]);

            return res.status(201).json({
                success: true,
                order: {
                    id: orderId,
                    amount: amount * 100,
                    currency,
                    status: 'COD_CONFIRMED'
                },
                message: 'COD Order created successfully'
            });
        }

        // 2. Handle Online Payment (Razorpay)
        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1,
            notes: {
                customer_name: customerDetails?.name,
                customer_mobile: customerDetails?.mobile
            }
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: 'Razorpay order creation failed' });
        }

        // Save order to Postgres
        const insertQuery = `
            INSERT INTO orders (order_id, user_id, amount, currency, status, receipt, customer_details, items)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        const userId = req.user ? req.user.id : null;

        await pool.query(insertQuery, [
            order.id,
            userId,
            order.amount,
            order.currency,
            order.status || 'created',
            order.receipt,
            JSON.stringify(customerDetails || {}),
            JSON.stringify(items || [])
        ]);

        return res.status(200).json({
            success: true,
            order,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Create Order Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Verify Payment Signature
 * POST /api/orders/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Update Order Status in DB
            const updateQuery = `
                UPDATE orders 
                SET status = 'PAID' 
                WHERE order_id = $1
            `;
            await pool.query(updateQuery, [razorpay_order_id]);

            // Save payment details to 'payments' table
            const insertPaymentQuery = `
                INSERT INTO payments (payment_id, order_id, signature, amount, method, created_at)
                VALUES ($1, $2, $3, (SELECT amount FROM orders WHERE order_id = $2), 'razorpay', NOW())
                ON CONFLICT (payment_id) DO NOTHING
            `;
            try {
                await pool.query(insertPaymentQuery, [razorpay_payment_id, razorpay_order_id, razorpay_signature]);
            } catch (err) {
                console.error("Payment insert error (non-fatal):", err);
            }

            return res.status(200).json({
                success: true,
                message: 'Payment verified successfully'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }
    } catch (error) {
        console.error('Verify Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

/**
 * Get Order Status
 * GET /v1/orders/:orderId
 */
export const getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, order: result.rows[0] });
    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Create COD Order explicitly (if separate endpoint needed)
 */
export const createCodOrder = async (req, res) => {
    req.body.paymentMethod = 'COD';
    return createOrder(req, res);
};

/**
 * Create QR Code (for Antigravity QR)
 * POST /api/orders/create-qr
 */
export const createQrCode = async (req, res) => {
    try {
        const { amount, user_email } = req.body;

        // 1. Create a Standard Order first
        const orderOptions = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `qr_${Date.now()}`,
            notes: { type: "qr_payment", email: user_email }
        };

        const order = await razorpay.orders.create(orderOptions);

        // 2. Create QR Code for this Order
        const qrOptions = {
            type: "upi_qr",
            name: "Arohan Store",
            usage: "single_use",
            fixed_amount: true,
            payment_amount: Math.round(amount * 100),
            description: "Scan to Pay for Order",
            close_by: Math.floor(Date.now() / 1000) + 1800, // 30 mins
            notes: {
                order_id: order.id
            }
        };

        const qrCode = await razorpay.qrCode.create(qrOptions);

        // Save to DB
        const insertQuery = `
            INSERT INTO orders (order_id, amount, currency, status, receipt)
            VALUES ($1, $2, $3, 'created', $4)
        `;
        await pool.query(insertQuery, [order.id, Math.round(amount * 100), 'INR', order.receipt]);

        res.json({
            success: true,
            qr_id: qrCode.id,
            image_url: qrCode.image_url,
            order_id: order.id
        });

    } catch (error) {
        console.error("QR Create Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Check QR Status
 * GET /api/orders/check-qr/:qrId
 */
export const checkQrStatus = async (req, res) => {
    try {
        const { qrId } = req.params;
        const qrCode = await razorpay.qrCode.fetch(qrId);

        // Check if any payment was made for this QR
        const payments = await razorpay.qrCode.fetchAllPayments(qrId);

        if (payments.count > 0 && (payments.items[0].status === 'captured' || payments.items[0].status === 'authorized')) {
            // Optional: Update DB status here if needed
            return res.json({ status: 'PAID', amount: payments.items[0].amount });
        }

        res.json({ status: qrCode.status }); // active/closed

    } catch (error) {
        console.error("Check QR Error:", error);
        res.status(500).json({ success: false });
    }
};

/**
 * Handle Razorpay Webhooks
 * POST /v1/orders/webhook
 * @access  Public
 */
export const handleWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        const event = req.body;
        const { id: eventId, event: eventType, payload } = event;

        // Idempotency Check
        const existingLog = await pool.query('SELECT 1 FROM webhook_logs WHERE event_id = $1', [eventId]);
        if (existingLog.rows.length > 0) {
            console.log(`Webhook ${eventId} already processed.`);
            return res.json({ status: 'ok', message: 'Already processed' });
        }

        // Log the event
        await pool.query(
            'INSERT INTO webhook_logs (event_id, event_type, payload) VALUES ($1, $2, $3)',
            [eventId, eventType, JSON.stringify(payload)]
        );

        if (eventType === 'payment.captured') {
            const payment = payload.payment.entity;
            const orderId = payment.order_id;

            // Update order status
            await pool.query(
                'UPDATE orders SET status = $1 WHERE order_id = $2',
                ['paid', orderId]
            );
        }

        res.json({ status: 'ok' });
    } else {
        res.status(400).json({ message: 'Invalid signature' });
    }
};
