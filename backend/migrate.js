import pool from './src/config/db.js';
import logger from './src/config/logger.js';

async function migrate() {
    try {
        console.log('--- Starting Schema Migration ---');

        // Add missing columns to users table
        console.log('Checking/Adding columns to users table...');
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS permissions TEXT[] DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
        `);
        console.log('✅ Users table columns updated.');

        // Verify other tables from schema.sql that might be missing
        // (contact_messages, audit_logs, early_access_leads, orders)

        console.log('Checking/Creating contact_messages table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                message TEXT NOT NULL,
                status VARCHAR(20) DEFAULT 'unread',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Checking/Creating audit_logs table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                actor_user_id UUID REFERENCES users(user_id),
                action VARCHAR(255) NOT NULL,
                target_record_id UUID,
                ip_address VARCHAR(45),
                user_agent TEXT,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Checking/Creating early_access_leads table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS early_access_leads (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                city VARCHAR(100),
                use_case TEXT,
                status VARCHAR(20) DEFAULT 'new',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Checking/Creating orders table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                order_id VARCHAR(50) PRIMARY KEY,
                user_id UUID REFERENCES users(user_id),
                amount INTEGER NOT NULL,
                currency VARCHAR(10) DEFAULT 'INR',
                receipt VARCHAR(50),
                status VARCHAR(20) DEFAULT 'start',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('--- Migration Completed Successfully ---');

    } catch (error) {
        console.error('❌ Migration Failed:', error.message);
        if (error.code === '28P01') {
            console.error('   Auth Error: Please check your database password in .env');
        }
    } finally {
        process.exit();
    }
}

migrate();
