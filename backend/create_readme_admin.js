import bcrypt from 'bcryptjs';
import pool from './src/config/db.js';

const createCorrectAdmin = async () => {
    try {
        const email = 'admin@arohanhealth.com';
        const password = 'Admin123!';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin already exists
        const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (check.rows.length > 0) {
            console.log('✅ Admin account exists. Updating password...');
            await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hashedPassword, email]);
        } else {
            console.log('🔐 Creating new admin account...');
            await pool.query(
                `INSERT INTO users (full_name, email, password_hash, role, is_active)
                 VALUES ($1, $2, $3, $4, $5)`,
                ['System Admin', email, hashedPassword, 'admin', true]
            );
        }

        // Verify
        const verify = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const isMatch = await bcrypt.compare(password, verify.rows[0].password_hash);
        console.log(`\n✅ Admin account ready:`);
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log(`   Password Match: ${isMatch ? 'PASSED ✅' : 'FAILED ❌'}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createCorrectAdmin();
