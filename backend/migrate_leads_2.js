
import pool from './src/config/db.js';

const migrate = async () => {
    console.log('🔄 Adding external_source to blogs table...');
    try {
        await pool.query(`
            ALTER TABLE blogs 
            ADD COLUMN IF NOT EXISTS external_source JSONB;
        `);
        console.log('✅ Column external_source added.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Failed:', error);
        process.exit(1);
    }
};

migrate();
