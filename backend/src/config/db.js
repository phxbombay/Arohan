import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: parseInt(process.env.DB_POOL_MAX) || 20, // Maximum number of clients in the pool
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT) || 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT) || 2000, // Return error if connection takes longer than 2 seconds
});

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Test connection immediately to log errors on startup
pool.query('SELECT NOW()').catch(err => {
    console.error("❌ Database Connection Error:", err.message);
    if (err.code === '28P01') console.error("   -> Wrong Password for user");
    if (err.code === '3D000') console.error("   -> Database 'arohan_health_db' does not exist");
    if (err.code === 'ECONNREFUSED') console.error("   -> PostgreSQL not running on localhost:5432");
});

export default pool;
