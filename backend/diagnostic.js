import pool from './src/config/db.js';

async function checkTables() {
    try {
        console.log('--- Checking Database Tables ---');

        const tables = ['users', 'contact_messages', 'audit_logs', 'orders', 'early_access_leads'];

        for (const table of tables) {
            try {
                const res = await pool.query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${table}')`);
                const exists = res.rows[0].exists;
                console.log(`Table '${table}': ${exists ? 'EXISTS' : 'MISSING'}`);

                if (exists) {
                    const columns = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}'`);
                    console.log(`  Columns: ${columns.rows.map(c => c.column_name).join(', ')}`);
                }
            } catch (err) {
                console.error(`  Error checking table '${table}':`, err.message);
            }
        }

    } catch (error) {
        console.error('Diagnostic failed:', error);
    } finally {
        process.exit();
    }
}

checkTables();
