import bcrypt from 'bcryptjs';
import pool from './config/db.js';
import crypto from 'crypto';

const seedAdmin = async () => {
    try {
        const email = 'admin@arohan.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if exists
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const user_id = crypto.randomUUID();

        const query = `
            INSERT INTO users (user_id, full_name, email, password_hash, role, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await pool.query(query, [
            user_id,
            'System Admin',
            email,
            hashedPassword,
            'admin',
            true
        ]);

        console.log('✅ Admin user created successfully:', { user_id, email, role: 'admin' });
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
