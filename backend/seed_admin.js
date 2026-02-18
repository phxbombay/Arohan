import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from './src/config/db.js';
import logger from './src/config/logger.js';

// Helper to generate UUID
const generateUUID = () => {
    return crypto.randomUUID();
};

const seedAdmin = async () => {
    try {
        const email = 'admin@arohan.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('🚀 Starting Database Seed...');

        // 1. Ensure Admin Exists
        // MySQL uses ? for placeholders, not $1
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        let userId;

        if (rows.length > 0) {
            console.log('✅ Admin already exists. Updating password to ensure access...');
            await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [hashedPassword, email]);
            userId = rows[0].user_id;
        } else {
            userId = generateUUID();
            const query = `
                INSERT INTO users (user_id, full_name, email, password_hash, role, is_active)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            // MySQL2 returns [result, fields]
            await pool.query(query, [
                userId,
                'System Admin',
                email,
                hashedPassword,
                'admin',
                true
            ]);
            console.log('✅ Admin user created successfully');
        }

        // VERIFY IMMEDIATE LOGIN
        console.log('🔐 Verifying admin login capability...');
        const [verifyRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (verifyRows.length === 0) {
             throw new Error('Admin user not found after creation!');
        }
        
        const savedHash = verifyRows[0].password_hash;
        const isMatch = await bcrypt.compare(password, savedHash);
        console.log(`🔑 Password 'admin123' match check: ${isMatch ? 'PASSED ✅' : 'FAILED ❌'}`);
        
        if (!isMatch) {
            console.log('⚠️ Hash mismatch! Re-hashing...');
            const newHash = await bcrypt.hash(password, 10);
            await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [newHash, email]);
            console.log('🔄 Password forcibly updated.');
        }

        // 2. Seed Early Access Leads
        const [leadCountRows] = await pool.query('SELECT COUNT(*) as count FROM early_access_leads');
        if (leadCountRows[0].count === 0) {
            console.log('🌱 Seeding sample leads...');
            const leadId1 = generateUUID();
            const leadId2 = generateUUID();
            
            await pool.query(`
                INSERT INTO early_access_leads (id, name, email, phone, city, use_case, status)
                VALUES 
                (?, 'John Lead', 'lead@test.com', '9876543210', 'Bangalore', 'Elderly care at home', 'new'),
                (?, 'Dr. Smith', 'clinic@hospital.com', '9876543211', 'Mumbai', 'Remote patient monitoring', 'contacted')
            `, [leadId1, leadId2]);
            console.log('✅ Sample leads seeded');
        } else {
            console.log('ℹ️ Leads already exist, skipping seed.');
        }

        // 3. Seed Orders
        const [orderCountRows] = await pool.query('SELECT COUNT(*) as count FROM orders');
        if (orderCountRows[0].count === 0) {
            console.log('📦 Seeding sample orders...');
            await pool.query(`
                INSERT INTO orders (order_id, user_id, amount, currency, status, receipt)
                VALUES 
                ('order_sample_01', ?, 499900, 'INR', 'paid', 'rcpt_001'),
                ('order_sample_02', ?, 249900, 'INR', 'created', 'rcpt_002')
            `, [userId, userId]);
            console.log('✅ Sample orders seeded');
        } else {
            console.log('ℹ️ Orders already exist, skipping seed.');
        }

        // 4. Create & Seed Contact Messages
        // Ensure table exists (schema.sql should handle this, but good to be safe if running standalone)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                message TEXT NOT NULL,
                status VARCHAR(20) DEFAULT 'unread',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const [msgCountRows] = await pool.query('SELECT COUNT(*) as count FROM contact_messages');
        if (msgCountRows[0].count === 0) {
            console.log('💬 Seeding sample messages...');
            const msgId = generateUUID();
            await pool.query(`
                INSERT INTO contact_messages (id, name, email, message)
                VALUES (?, 'Alice Visitor', 'alice@example.com', 'Interested in bulk ordering.')
            `, [msgId]);
            console.log('✅ Sample messages seeded');
        }

        // 5. Seed Audit Logs
        const [logCountRows] = await pool.query('SELECT COUNT(*) as count FROM audit_logs');
        if (logCountRows[0].count === 0) {
            console.log('📋 Seeding sample audit logs...');
            const logId = generateUUID();
            await pool.query(`
                INSERT INTO audit_logs (log_id, actor_user_id, action, target_record_id, ip_address, user_agent)
                VALUES (?, ?, 'LOGIN_SUCCESS', ?, '127.0.0.1', 'Mozilla/5.0')
             `, [logId, userId, userId]);
            console.log('✅ Sample audit logs seeded');
        }

        console.log('✨ Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
