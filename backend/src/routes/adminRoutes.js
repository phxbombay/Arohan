import express from 'express';
import {
    getDashboardStats,
    getAllUsers,
    getAllMessages,
    getSystemLogs,
    getAllOrders,
    createUser
} from '../controllers/adminController.js';
import { getAllLeads } from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = express.Router();

// Apply protection and admin requirement to all routes
router.use(protect);
router.use(requireAdmin);

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/messages', getAllMessages);
router.get('/logs', getSystemLogs);
router.get('/orders', getAllOrders);
router.get('/leads', getAllLeads);

export default router;
