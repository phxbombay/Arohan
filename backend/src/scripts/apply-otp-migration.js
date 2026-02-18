import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const applyMigration = async () => {
    try {
        const sqlPath = path.join(__dirname, '../../migrations/03_create_user_otps.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Applying migration:', sqlPath);

        // MySQL can't run multiple statements in one query by default in some configurations,
        // but pool.query often supports it if enabled. However, better to split by semicolon if needed.
        // For this specific migration, it has 3 distinct statements.
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            console.log('Executing statement...');
            await pool.query(statement);
        }

        console.log('✅ Migration applied successfully');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
};

applyMigration();
