import pool from '../config/db.js';

// @desc    Sync data from wearable
// @route   POST /v1/vitals/sync
// @access  Private
export const syncVitals = async (req, res) => {
    const { device_id, data } = req.body;
    const user_id = req.user.user_id;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ message: 'Invalid data format' });
    }

    try {
        const query = `
      INSERT INTO health_vitals (user_id, device_id, recorded_at, heart_rate, steps, oxygen_level, battery_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id, recorded_at) DO NOTHING
    `;

        let count = 0;
        for (const record of data) {
            await pool.query(query, [
                user_id,
                device_id,
                record.timestamp,
                record.hr,
                record.steps,
                record.spo2 || null,
                record.battery || null
            ]);
            count++;
        }

        res.json({ synced: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error from syncVitals' });
    }
};

// @desc    Get latest live stats
// @route   GET /v1/vitals/live
// @access  Private
export const getLiveVitals = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const result = await pool.query(
            'SELECT heart_rate, battery_level, recorded_at FROM health_vitals WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 1',
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.json({ message: 'No data available' });
        }

        const { heart_rate, battery_level, recorded_at } = result.rows[0];
        res.json({ heart_rate, battery: battery_level, last_seen: recorded_at });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get history
// @route   GET /v1/vitals/history
// @access  Private
export const getHistoryVitals = async (req, res) => {
    const user_id = req.user.user_id;
    const { range } = req.query; // e.g. '24h'

    // Default limit
    let limit = 50;

    try {
        const query = `
            SELECT recorded_at as time, heart_rate as hr 
            FROM health_vitals 
            WHERE user_id = $1 
            ORDER BY recorded_at DESC 
            LIMIT $2
        `;

        const result = await pool.query(query, [user_id, limit]);
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
