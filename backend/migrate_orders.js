
import pool from './src/config/db.js';

const migrate = async () => {
    console.log('🔄 Updating orders table schema...');
    try {
        await pool.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS customer_details JSONB,
            ADD COLUMN IF NOT EXISTS items JSONB;
        `);
        console.log('✅ Columns customer_details and items added to orders.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Failed:', error);
        process.exit(1);
    }
};

migrate();
