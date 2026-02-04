import bcrypt from 'bcryptjs';
import pool from './src/config/db.js';
import logger from './src/config/logger.js';

const seedAdmin = async () => {
    try {
        const email = 'admin@arohan.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Ensure Admin Exists
        const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let userId;

        if (check.rows.length > 0) {
            console.log('✅ Admin already exists. Updating password to ensure access...');
            await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hashedPassword, email]);
            userId = check.rows[0].user_id;
        } else {
            const query = `
                INSERT INTO users (full_name, email, password_hash, role, is_active)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING user_id
            `;
            const result = await pool.query(query, [
                'System Admin',
                email,
                hashedPassword,
                'admin',
                true
            ]);
            console.log('✅ Admin user created successfully');
            userId = result.rows[0].user_id;
        }

        // VERIFY IMMEDIATE LOGIN
        console.log('🔐 Verifying admin login capability...');
        const verifyUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const savedHash = verifyUser.rows[0].password_hash;
        const isMatch = await bcrypt.compare(password, savedHash);
        console.log(`🔑 Password 'admin123' match check: ${isMatch ? 'PASSED ✅' : 'FAILED ❌'}`);
        if (!isMatch) {
            console.log('⚠️ Hash mismatch! Re-hashing...');
            const newHash = await bcrypt.hash(password, 10);
            await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [newHash, email]);
            console.log('🔄 Password forcibly updated.');
        }

        // 2. Seed Early Access Leads (Fixes "Failed to load leads")
        const leadCheck = await pool.query('SELECT COUNT(*) FROM early_access_leads');
        if (parseInt(leadCheck.rows[0].count) === 0) {
            console.log('🌱 Seeding sample leads...');
            await pool.query(`
                INSERT INTO early_access_leads (name, email, phone, city, use_case, status)
                VALUES 
                ('John Lead', 'lead@test.com', '9876543210', 'Bangalore', 'Elderly care at home', 'new'),
                ('Dr. Smith', 'clinic@hospital.com', '9876543211', 'Mumbai', 'Remote patient monitoring', 'contacted')
            `);
            console.log('✅ Sample leads seeded');
        } else {
            console.log('ℹ️ Leads already exist, skipping seed.');
        }

        // 3. Seed Orders (Fixes "Failed to load orders")
        const orderCheck = await pool.query('SELECT COUNT(*) FROM orders');
        if (parseInt(orderCheck.rows[0].count) === 0) {
            console.log('📦 Seeding sample orders...');
            // Need a user for orders, use admin
            await pool.query(`
                INSERT INTO orders (order_id, user_id, amount, currency, status, receipt)
                VALUES 
                ('order_sample_01', $1, 499900, 'INR', 'paid', 'rcpt_001'),
                ('order_sample_02', $1, 249900, 'INR', 'created', 'rcpt_002')
            `, [userId]);
            console.log('✅ Sample orders seeded');
        } else {
            console.log('ℹ️ Orders already exist, skipping seed.');
        }

        // 4. Create & Seed Contact Messages (Fixes "Failed to load messages")
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(255),
                message TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const messageCheck = await pool.query('SELECT COUNT(*) FROM contact_messages');
        if (parseInt(messageCheck.rows[0].count) === 0) {
            console.log('💬 Seeding sample messages...');
            await pool.query(`
                INSERT INTO contact_messages (name, email, message)
                VALUES ('Alice Visitor', 'alice@example.com', 'Interested in bulk ordering.')
            `);
            console.log('✅ Sample messages seeded');
        }

        // 5. Seed Audit Logs (Fixes "System Audit Logs" empty)
        const logCheck = await pool.query('SELECT COUNT(*) FROM audit_logs');
        if (parseInt(logCheck.rows[0].count) === 0) {
            console.log('📋 Seeding sample audit logs...');
            await pool.query(`
                INSERT INTO audit_logs (actor_user_id, action, target_record_id, ip_address, user_agent)
                VALUES ($1, 'LOGIN_SUCCESS', $1, '127.0.0.1', 'Mozilla/5.0')
             `, [userId]);
            console.log('✅ Sample audit logs seeded');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
