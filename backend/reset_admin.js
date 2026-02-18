import pool from './src/config/db.js';
import bcrypt from 'bcryptjs';

const resetAdmin = async () => {
    const email = 'admin@arohan.com';
    const password = 'admin123';

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        console.log(`🔒 Resetting password for ${email}...`);

        const [result] = await pool.query(
            'UPDATE users SET password_hash = ? WHERE email = ?',
            [hash, email]
        );

        if (result.affectedRows === 0) {
            console.log('⚠️ Admin user not found! Creating one...');
            const crypto = await import('crypto');
            // Mock UUID for now if not available in environment
            const userId = crypto.randomUUID ? crypto.randomUUID() : 'admin-uuid-' + Date.now();

            await pool.query(
                `INSERT INTO users (user_id, full_name, email, password_hash, role, is_active, phone_number) 
                 VALUES (?, 'System Admin', ?, ?, 'admin', TRUE, '9999999999')`,
                [userId, email, hash]
            );
            console.log('✅ Admin user created.');
        } else {
            console.log('✅ Admin password updated.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed:', error);
        process.exit(1);
    }
};

resetAdmin();
