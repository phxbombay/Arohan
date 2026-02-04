import bcrypt from 'bcryptjs';
import pool from './config/db.js';
import logger from './config/logger.js';

const seedAdmin = async () => {
    try {
        const email = 'admin@arohan.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if exists
        const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const query = `
            INSERT INTO users (full_name, email, password_hash, role, is_active)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id, email, role
        `;

        const result = await pool.query(query, [
            'System Admin',
            email,
            hashedPassword,
            'admin',
            true // is_active
        ]);

        console.log('✅ Admin user created successfully:', result.rows[0]);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
