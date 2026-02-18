import pool from './src/config/db.js';

const createOtpTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS user_otps (
        otp_id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        otp_code VARCHAR(10) NOT NULL,
        purpose VARCHAR(20) DEFAULT 'login',
        expires_at DATETIME NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
    `;

    try {
        console.log('🔄 Creating user_otp table...');
        await pool.query(query);
        console.log('✅ user_otp table created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to create table:', error.sqlMessage || error.message);
        process.exit(1);
    }
};

createOtpTable();
