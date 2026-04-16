import pool from './src/config/db.js';
import logger from './src/config/logger.js';

/**
 * Migration Script: Refine Schema (MySQL 8.0)
 * This script is the main entry point for database schema updates.
 */

async function migrate() {
    let connection;
    try {
        console.log('--- Starting Database Migration (MySQL) ---');
        connection = await pool.getConnection();

        // 1. Helper to check if index exists
        const indexExists = async (table, index) => {
            const [rows] = await connection.query(`
                SHOW INDEX FROM \`${table}\` WHERE Key_name = ?
            `, [index]);
            return rows.length > 0;
        };

        // 2. Helper to check if column exists
        const columnExists = async (table, column) => {
            const [rows] = await connection.query(`
                SHOW COLUMNS FROM \`${table}\` LIKE ?
            `, [column]);
            return rows.length > 0;
        };

        // 3. Update Users Table
        console.log('Refining users table...');
        if (!await indexExists('users', 'idx_user_role')) {
            await connection.query('CREATE INDEX idx_user_role ON users(role)');
        }
        if (!await indexExists('users', 'idx_user_active')) {
            await connection.query('CREATE INDEX idx_user_active ON users(is_active)');
        }
        
        if (!await columnExists('users', 'updated_at')) {
            await connection.query('ALTER TABLE users ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
        }

        // 4. Update Health Vitals (Efficiency)
        console.log('Refining health_vitals table...');
        await connection.query(`
            ALTER TABLE health_vitals 
            MODIFY heart_rate SMALLINT UNSIGNED,
            MODIFY steps MEDIUMINT UNSIGNED,
            MODIFY oxygen_level TINYINT UNSIGNED,
            MODIFY battery_level TINYINT UNSIGNED
        `);
        if (!await indexExists('health_vitals', 'idx_vitals_recorded_at')) {
            await connection.query('CREATE INDEX idx_vitals_recorded_at ON health_vitals(recorded_at)');
        }

        // 5. Audit Logs
        console.log('Refining audit_logs table...');
        if (!await indexExists('audit_logs', 'idx_audit_actor')) {
            await connection.query('CREATE INDEX idx_audit_actor ON audit_logs(actor_user_id)');
        }
        if (!await indexExists('audit_logs', 'idx_audit_timestamp')) {
            await connection.query('CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp)');
        }

        // 6. Emergency Contacts
        console.log('Refining emergency_contacts table...');
        await connection.query(`
            ALTER TABLE emergency_contacts
            MODIFY phone VARCHAR(50) NULL
        `);
        if (!await columnExists('emergency_contacts', 'email')) {
            await connection.query('ALTER TABLE emergency_contacts ADD COLUMN email VARCHAR(255) NULL AFTER phone');
        }
        if (!await columnExists('emergency_contacts', 'preferred_channels')) {
            await connection.query('ALTER TABLE emergency_contacts ADD COLUMN preferred_channels JSON NULL AFTER priority');
        }

        // 7. Orders & Payments
        console.log('Refining orders and payments...');
        if (!await indexExists('orders', 'idx_orders_user')) {
            await connection.query('CREATE INDEX idx_orders_user ON orders(user_id)');
        }
        if (!await indexExists('orders', 'idx_orders_status')) {
            await connection.query('CREATE INDEX idx_orders_status ON orders(status)');
        }
        if (!await indexExists('payments', 'idx_payments_order')) {
            await connection.query('CREATE INDEX idx_payments_order ON payments(order_id)');
        }

        // 8. Chat Tables (MySQL Conversion)
        console.log('Ensuring Chat tables exist...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS chats (
                chat_id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(36) NOT NULL,
                title VARCHAR(255) DEFAULT 'New Chat',
                status VARCHAR(50) DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                INDEX idx_chats_user (user_id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS chat_messages (
                message_id VARCHAR(36) PRIMARY KEY,
                chat_id VARCHAR(36) NOT NULL,
                sender ENUM('user', 'bot', 'agent') NOT NULL,
                content TEXT NOT NULL,
                metadata JSON,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE,
                INDEX idx_chat_msg_chat (chat_id)
            )
        `);

        // 9. Blogs refinements
        console.log('Refining blogs table...');
        await connection.query(`
            ALTER TABLE blogs 
            MODIFY status ENUM('draft', 'published', 'archived') DEFAULT 'draft'
        `);
        if (!await indexExists('blogs', 'idx_blogs_category')) {
            await connection.query('CREATE INDEX idx_blogs_category ON blogs(category)');
        }

        console.log('✅ Migration completed successfully!');

    } catch (error) {
        logger.error('❌ Migration Failed:', error.message);
        console.error(error);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

migrate();
