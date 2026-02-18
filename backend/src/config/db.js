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
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true // Return dates as strings to format consistently
};

// Create the pool
const pool = mysql.createPool(dbConfig);

// Test connection on startup
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT NOW() as now');
        connection.release();
        logger.info('✅ Database connected successfully', { time: rows[0].now });
    } catch (err) {
        logger.error('❌ Database connection failed:', { error: err.message });
        // Don't exit process, let it retry or fail on request
    }
};

testConnection();

export default pool;
