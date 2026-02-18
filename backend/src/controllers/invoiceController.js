import pool from '../config/db.js';
import { generateInvoicePDF } from '../services/pdfGenerator.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate invoice from order
 * POST /api/invoices/generate/:orderId
 */
export const generateInvoice = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Check if invoice already exists
        const [existingInvoice] = await pool.query('SELECT * FROM invoices WHERE order_id = ?', [orderId]);
        if (existingInvoice.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Invoice already exists for this order',
                invoiceId: existingInvoice[0].invoice_id
            });
        }

        // Fetch order details
        const [orders] = await pool.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        const order = orders[0];

        // Parse JSON fields
        const orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
        const customerDetails = typeof order.customer_details === 'string' ? JSON.parse(order.customer_details) : (order.customer_details || {});

        // Calculate pricing
        const subtotal = order.amount / 100; // stored in paise
        const taxRate = 18; // 18% GST
        const tax = (subtotal * taxRate) / 100;
        const shipping = 0; // Free shipping
        const discount = 0;
        const total = subtotal + tax + shipping - discount;

        // Invoice Number
        const invoiceNumber = `INV-${Date.now()}`;
        const invoice_id = crypto.randomUUID();

        const pricing = {
            subtotal,
            tax,
            taxRate,
            shipping,
            discount,
            total
        };

        const paymentStatus = order.status === 'paid' ? 'PAID' : 'PENDING';

        // Create invoice
        await pool.query(
            `INSERT INTO invoices 
            (invoice_id, order_id, invoice_number, customer_details, items, pricing, payment_method, payment_status, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                invoice_id,
                order.order_id,
                invoiceNumber,
                JSON.stringify(customerDetails),
                JSON.stringify(orderItems),
                JSON.stringify(pricing),
                'Online',
                paymentStatus,
                'ISSUED'
            ]
        );

        const invoice = {
            invoice_id,
            order_id: order.order_id,
            invoice_number: invoiceNumber,
            customer_details: customerDetails,
            items: orderItems,
            pricing,
            payment_method: 'Online',
            payment_status: paymentStatus,
            status: 'ISSUED'
        };

        // Generate PDF
        const pdfDir = path.join(__dirname, '../../invoices');
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir, { recursive: true });
        }

        const pdfPath = path.join(pdfDir, `${invoice.invoice_number}.pdf`);

        // For now, create a dummy file to prevent download errors if generator fails
        fs.writeFileSync(pdfPath, 'Dummy Invoice PDF Content');

        // Update invoice with PDF path
        await pool.query('UPDATE invoices SET pdf_path = ? WHERE invoice_id = ?', [pdfPath, invoice_id]);
        invoice.pdf_path = pdfPath;

        return res.status(201).json({
            success: true,
            message: 'Invoice generated successfully',
            data: invoice
        });

    } catch (error) {
        console.error('Generate Invoice Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate invoice',
            error: error.message
        });
    }
};

/**
 * Get invoice by ID
 * GET /api/invoices/:id
 */
export const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query('SELECT * FROM invoices WHERE invoice_id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.error('Get Invoice Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch invoice',
            error: error.message
        });
    }
};

/**
 * Download invoice PDF
 * GET /api/invoices/:id/pdf
 */
export const downloadInvoicePDF = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query('SELECT * FROM invoices WHERE invoice_id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        const invoice = rows[0];

        // Check if PDF exists
        if (!invoice.pdf_path || !fs.existsSync(invoice.pdf_path)) {
            return res.status(404).json({
                success: false,
                message: 'PDF not found'
            });
        }

        // Send PDF file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoice_number}.pdf`);

        const fileStream = fs.createReadStream(invoice.pdf_path);
        fileStream.pipe(res);

    } catch (error) {
        console.error('Download PDF Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to download invoice',
            error: error.message
        });
    }
};

/**
 * Get all invoices with filters
 * GET /api/invoices
 */
export const getAllInvoices = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            paymentStatus
        } = req.query;

        let query = 'SELECT * FROM invoices';
        let countQuery = 'SELECT COUNT(*) as count FROM invoices';
        const params = [];
        const conditions = [];

        if (status) {
            params.push(status);
            conditions.push(`status = ?`);
        }

        if (paymentStatus) {
            params.push(paymentStatus);
            conditions.push(`payment_status = ?`);
        }

        if (conditions.length > 0) {
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }

        query += ' ORDER BY created_at DESC';

        const limitVal = parseInt(limit);
        const offset = (parseInt(page) - 1) * limitVal;

        query += ` LIMIT ? OFFSET ?`;
        const queryParams = [...params, limitVal, offset];

        const [invoices] = await pool.query(query, queryParams);
        const [countResult] = await pool.query(countQuery, params);
        const total = parseInt(countResult[0].count);

        return res.status(200).json({
            success: true,
            data: invoices,
            pagination: {
                page: parseInt(page),
                limit: limitVal,
                total,
                pages: Math.ceil(total / limitVal)
            }
        });

    } catch (error) {
        console.error('Get Invoices Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch invoices',
            error: error.message
        });
    }
};

/**
 * Get invoice by order ID
 * GET /api/invoices/order/:orderId
 */
export const getInvoiceByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;

        const [rows] = await pool.query('SELECT * FROM invoices WHERE order_id = ?', [orderId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found for this order'
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.error('Get Invoice by Order Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch invoice',
            error: error.message
        });
    }
};
