import pool from '../config/db.js';
import crypto from 'crypto';

// @desc    Pair a new device
// @route   POST /v1/devices/pair
// @access  Private
export const pairDevice = async (req, res) => {
    const { serial_number } = req.body;
    const user_id = req.user.user_id;

    try {
        // 1. Check if device exists in inventory
        const [devices] = await pool.query(
            'SELECT device_id FROM devices WHERE serial_number = ?',
            [serial_number]
        );

        let device_id;

        if (devices.length === 0) {
            // For prototype purposes, auto-create the device if it doesn't exist
            device_id = crypto.randomUUID();
            await pool.query(
                "INSERT INTO devices (device_id, serial_number, status, model_version) VALUES (?, ?, 'active', 'v1.0')",
                [device_id, serial_number]
            );
        } else {
            device_id = devices[0].device_id;
        }

        // 2. Link to user
        const pairing_id = crypto.randomUUID();
        await pool.query(
            'INSERT IGNORE INTO user_devices (id, user_id, device_id, is_primary) VALUES (?, ?, ?, ?)',
            [pairing_id, user_id, device_id, true]
        );

        res.status(201).json({ device_id, status: 'paired', message: 'Device paired successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during pairing' });
    }
};

// @desc    Get user devices
// @route   GET /v1/devices
// @access  Private
export const getUserDevices = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const query = `
      SELECT d.device_id, d.serial_number, d.model_version, d.status, ud.paired_at
      FROM devices d
      JOIN user_devices ud ON d.device_id = ud.device_id
      WHERE ud.user_id = ?
    `;
        const [rows] = await pool.query(query, [user_id]);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update device settings
// @route   PUT /v1/devices/:id/settings
// @access  Private
export const updateDeviceSettings = async (req, res) => {
    // Placeholder for settings update logic
    res.json({ message: 'Device settings updated' });
}
