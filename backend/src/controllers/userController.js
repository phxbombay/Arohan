import pool from '../config/db.js';
import logger from '../config/logger.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import { auditLog } from '../middleware/auditLog.js';
import crypto from 'crypto';

// @desc    Get user profile
// @route   GET /v1/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT user_id, full_name, email, role, created_at FROM users WHERE user_id = ?',
            [req.user.user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        logger.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get emergency contacts
// @route   GET /v1/users/emergency-contacts
// @access  Private
export const getEmergencyContacts = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM emergency_contacts WHERE user_id = ? ORDER BY priority ASC',
            [req.user.user_id]
        );

        // Decrypt phone numbers before sending
        const decryptedContacts = rows.map(contact => ({
            ...contact,
            phone: decrypt(contact.phone) || contact.phone // Fallback if not encrypted legacy data
        }));

        res.json(decryptedContacts);
    } catch (error) {
        logger.error('Get Contacts Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add emergency contact
// @route   POST /v1/users/emergency-contacts
// @access  Private
export const addEmergencyContact = async (req, res) => {
    const { name, phone, relation, priority } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ message: 'Name and phone are required' });
    }

    try {
        // Enforce limit of 5 contacts for non-VIP (example logic)
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM emergency_contacts WHERE user_id = ?', [req.user.user_id]);
        if (parseInt(rows[0].count) >= 5) {
            return res.status(400).json({ message: 'Contact limit reached' });
        }

        // Encrypt phone
        const encryptedPhone = encrypt(phone);
        const contact_id = crypto.randomUUID();

        await pool.query(
            'INSERT INTO emergency_contacts (contact_id, user_id, name, phone, relation, priority) VALUES (?, ?, ?, ?, ?, ?)',
            [contact_id, req.user.user_id, name, encryptedPhone, relation, priority || 1]
        );

        const createdContact = {
            contact_id,
            user_id: req.user.user_id,
            name,
            phone,
            relation,
            priority: priority || 1
        };

        await auditLog('add_emergency_contact', 'emergency_contacts', {
            userId: req.user.user_id,
            resourceId: createdContact.contact_id
        });

        res.status(201).json(createdContact);
    } catch (error) {
        logger.error('Add Contact Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete emergency contact
// @route   DELETE /v1/users/emergency-contacts/:id
// @access  Private
export const deleteEmergencyContact = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM emergency_contacts WHERE contact_id = ? AND user_id = ?',
            [req.params.id, req.user.user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.json({ message: 'Contact removed' });
    } catch (error) {
        logger.error('Delete Contact Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
