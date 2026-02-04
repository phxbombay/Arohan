import pool from '../config/db.js';
import { executeTransaction } from '../utils/transaction.js';
import logger from '../config/logger.js';

/**
 * Get user's shopping cart
 */
export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(
            `SELECT id, product_id, product_name, description, price, quantity, image_url, features, created_at, updated_at
             FROM cart_items
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        const cart = result.rows.map(row => ({
            id: row.product_id,
            name: row.product_name,
            description: row.description,
            price: row.price,
            quantity: row.quantity,
            image: row.image_url,
            features: row.features || []
        }));

        res.json({ cart });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Failed to retrieve cart' });
    }
};

/**
 * Add item to cart
 * Uses transaction to ensure atomicity
 */
export const addToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { id, name, description, price, image, features } = req.body;

        if (!id || !name || !price) {
            return res.status(400).json({ error: 'Missing required fields: id, name, price' });
        }

        // Use transaction for atomic check-and-update
        const result = await executeTransaction(async (client) => {
            // Check if item already exists
            const existing = await client.query(
                'SELECT quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
                [userId, id]
            );

            if (existing.rows.length > 0) {
                // Update quantity
                const newQuantity = existing.rows[0].quantity + 1;
                await client.query(
                    'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE user_id = $2 AND product_id = $3',
                    [newQuantity, userId, id]
                );

                return { message: 'Cart updated', quantity: newQuantity };
            } else {
                // Insert new item
                await client.query(
                    `INSERT INTO cart_items (user_id, product_id, product_name, description, price, quantity, image_url, features)
                     VALUES ($1, $2, $3, $4, $5, 1, $6, $7)`,
                    [userId, id, name, description || '', price, image || '', JSON.stringify(features || [])]
                );

                return { message: 'Item added to cart' };
            }
        });

        res.json(result);
    } catch (error) {
        logger.error('Add to cart error', { error: error.message, userId: req.params.userId });
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

/**
 * Update item quantity
 */
export const updateCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        const result = await pool.query(
            'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
            [quantity, userId, productId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        res.json({ message: 'Quantity updated', item: result.rows[0] });
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const result = await pool.query(
            'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *',
            [userId, productId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};

/**
 * Clear entire cart
 */
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};

/**
 * Get cart count
 */
export const getCartCount = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(
            'SELECT COALESCE(SUM(quantity), 0) as count FROM cart_items WHERE user_id = $1',
            [userId]
        );

        res.json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error('Get cart count error:', error);
        res.status(500).json({ error: 'Failed to get cart count' });
    }
};
