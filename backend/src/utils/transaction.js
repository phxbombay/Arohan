import pool from '../config/db.js';
import logger from '../config/logger.js';

/**
 * Execute a database transaction
 * Automatically handles BEGIN, COMMIT, and ROLLBACK
 * 
 * @param {Function} callback - Async function that receives the client
 * @returns {Promise<any>} - Result from the callback
 * @throws {Error} - Throws error if transaction fails
 */
export const executeTransaction = async (callback) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await callback(client);

        await client.query('COMMIT');

        logger.info('Transaction committed successfully');

        return result;
    } catch (error) {
        await client.query('ROLLBACK');

        logger.error('Transaction rolled back', {
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });

        throw error;
    } finally {
        client.release();
    }
};

/**
 * Execute a query within a transaction client
 * Convenience wrapper for client.query
 */
export const transactionQuery = async (client, query, params) => {
    return await client.query(query, params);
};
