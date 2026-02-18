import pool from '../config/db.js';
import logger from '../config/logger.js';

/**
 * Execute a database transaction
 * Automatically handles BEGIN, COMMIT, and ROLLBACK
 * 
 * @param {Function} callback - Async function that receives the connection
 * @returns {Promise<any>} - Result from the callback
 * @throws {Error} - Throws error if transaction fails
 */
export const executeTransaction = async (callback) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const result = await callback(connection);

        await connection.commit();

        logger.info('Transaction committed successfully');

        return result;
    } catch (error) {
        await connection.rollback();

        logger.error('Transaction rolled back', {
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });

        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Execute a query within a transaction connection
 * Convenience wrapper for connection.query
 */
export const transactionQuery = async (connection, query, params) => {
    return await connection.query(query, params);
};
