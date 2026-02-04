import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getUserProfile,
    getEmergencyContacts,
    addEmergencyContact,
    deleteEmergencyContact
} from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.get('/emergency-contacts', protect, getEmergencyContacts);
router.post('/emergency-contacts', protect, addEmergencyContact);
router.delete('/emergency-contacts/:id', protect, deleteEmergencyContact);

export default router;
