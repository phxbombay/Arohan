import crypto from 'crypto';
import pool from '../config/db.js';
import logger from '../config/logger.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import { auditLog } from '../middleware/auditLog.js';
import {
    getContactEnabledChannels,
    normalizeAlertChannels,
    parseStoredAlertChannels,
    serializeAlertChannels,
} from '../services/emergencyAlertService.js';

const hydrateEmergencyContact = (contact) => {
    const phone = contact.phone ? decrypt(contact.phone) || contact.phone : null;
    const preferredChannels = parseStoredAlertChannels(contact.preferred_channels);
    const hydratedContact = {
        ...contact,
        phone,
        preferred_channels: preferredChannels,
    };

    return {
        ...hydratedContact,
        available_channels: getContactEnabledChannels(hydratedContact),
    };
};

const sanitizeEmergencyContactInput = (body) => {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const relation = typeof body.relation === 'string' ? body.relation.trim() : null;
    const parsedPriority = Number.parseInt(body.priority, 10);
    const priority = Number.isNaN(parsedPriority) || parsedPriority < 1 ? 1 : parsedPriority;

    return {
        name,
        phone: phone || null,
        email: email || null,
        relation,
        priority,
    };
};

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

        res.json(rows.map(hydrateEmergencyContact));
    } catch (error) {
        logger.error('Get Contacts Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add emergency contact
// @route   POST /v1/users/emergency-contacts
// @access  Private
export const addEmergencyContact = async (req, res) => {
    const { name, phone, email, relation, priority } = sanitizeEmergencyContactInput(req.body);
    const requestedPreferredChannels = normalizeAlertChannels(req.body.preferred_channels);

    if (!name || (!phone && !email)) {
        return res.status(400).json({ message: 'Name and at least one contact method are required' });
    }

    if (req.body.preferred_channels !== undefined && requestedPreferredChannels.length === 0) {
        return res.status(400).json({ message: 'Preferred channels must include at least one supported channel' });
    }

    const contactCapabilities = [];
    if (phone) {
        contactCapabilities.push('sms', 'whatsapp');
    }
    if (email) {
        contactCapabilities.push('email');
    }

    const preferredChannels = requestedPreferredChannels.filter(channel => contactCapabilities.includes(channel));

    if (req.body.preferred_channels !== undefined && preferredChannels.length === 0) {
        return res.status(400).json({
            message: 'Preferred channels do not match the provided contact details'
        });
    }

    try {
        const [rows] = await pool.query(
            'SELECT COUNT(*) as count FROM emergency_contacts WHERE user_id = ?',
            [req.user.user_id]
        );

        if (parseInt(rows[0].count, 10) >= 5) {
            return res.status(400).json({ message: 'Contact limit reached' });
        }

        const contact_id = crypto.randomUUID();
        const encryptedPhone = phone ? encrypt(phone) : null;
        const serializedPreferredChannels = serializeAlertChannels(preferredChannels);

        await pool.query(
            `INSERT INTO emergency_contacts
            (contact_id, user_id, name, phone, email, relation, priority, preferred_channels)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                contact_id,
                req.user.user_id,
                name,
                encryptedPhone,
                email,
                relation,
                priority,
                serializedPreferredChannels
            ]
        );

        const createdContact = hydrateEmergencyContact({
            contact_id,
            user_id: req.user.user_id,
            name,
            phone: encryptedPhone,
            email,
            relation,
            priority,
            preferred_channels: preferredChannels,
        });

        await auditLog('add_emergency_contact', createdContact.contact_id, {
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
