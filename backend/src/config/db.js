import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT) : 20,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    dateStrings: true // Return dates as strings to format consistently
};

// Create the pool
const pool = mysql.createPool(dbConfig);

// Test connection on startup
const testConnection = async (retries = 5) => {
    while (retries > 0) {
        try {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT NOW() as now');
            connection.release();
            logger.info('✅ Database connected successfully', { time: rows[0].now });
            return;
        } catch (err) {
            logger.error(`❌ Database connection failed (Attempts remaining: ${retries-1}):`, { error: err.message });
            retries -= 1;
            if (retries === 0) {
                logger.error('❌ Max database connection retries reached.');
            } else {
                await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before retry
            }
        }
    }
};

testConnection();

export default pool;
