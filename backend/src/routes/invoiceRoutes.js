import express from 'express';
import * as invoiceController from '../controllers/invoiceController.js';

const router = express.Router();

/**
 * @route   POST /api/invoices/generate/:orderId
 * @desc    Generate invoice from order
 * @access  Public (or Admin)
 */
router.post('/generate/:orderId', invoiceController.generateInvoice);

/**
 * @route   GET /api/invoices
 * @desc    Get all invoices with filters
 * @access  Admin
 * @query   page, limit, status, paymentStatus
 */
router.get('/', invoiceController.getAllInvoices);

/**
 * @route   GET /api/invoices/order/:orderId
 * @desc    Get invoice by order ID
 * @access  Public
 */
router.get('/order/:orderId', invoiceController.getInvoiceByOrderId);

/**
 * @route   GET /api/invoices/:id
 * @desc    Get single invoice
 * @access  Public
 */
router.get('/:id', invoiceController.getInvoice);

/**
 * @route   GET /api/invoices/:id/pdf
 * @desc    Download invoice as PDF
 * @access  Public
 */
router.get('/:id/pdf', invoiceController.downloadInvoicePDF);

export default router;
