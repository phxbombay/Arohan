import pool from '../config/db.js';
import { executeTransaction } from '../utils/transaction.js';
import logger from '../config/logger.js';

/**
 * Get user's shopping cart
 */
export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const [rows] = await pool.query(
            `SELECT product_id, product_name, description, price, quantity, image_url, features, created_at, updated_at
             FROM cart_items
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );

        const cart = rows.map(row => ({
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
 */
export const addToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { id, name, description, price, image, features } = req.body;

        if (!id || !name || !price) {
            return res.status(400).json({ error: 'Missing required fields: id, name, price' });
        }

        const result = await executeTransaction(async (connection) => {
            console.log('🛒 [DEBUG] Transaction started for addToCart');

            // Check if item already exists
            const [rows] = await connection.query(
                'SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
                [userId, id]
            );

            console.log('🛒 [DEBUG] Item exists?', rows.length > 0);

            if (rows.length > 0) {
                // Update quantity
                const newQuantity = rows[0].quantity + 1;
                await connection.query(
                    'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?',
                    [newQuantity, userId, id]
                );
                return { message: 'Cart updated', quantity: newQuantity };
            } else {
                // Insert new item
                console.log('🛒 [DEBUG] Inserting new item:', { userId, id, price });
                await connection.query(
                    `INSERT INTO cart_items (id, user_id, product_id, product_name, description, price, quantity, image_url, features)
                     VALUES (UUID(), ?, ?, ?, ?, ?, 1, ?, ?)`,
                    [userId, id, name, description || '', price, image || '', JSON.stringify(features || [])]
                );
                return { message: 'Item added to cart' };
            }
        });

        res.json(result);
    } catch (error) {
        console.error('🛒 [DEBUG] Add to cart FAILED:', error);
        logger.error('Add to cart error', { error: error.message, userId: req.params.userId });
        res.status(500).json({ error: 'Failed to add item to cart: ' + error.message });
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

        const [result] = await pool.query(
            'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [quantity, userId, productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        res.json({ message: 'Quantity updated', item: { user_id: userId, product_id: productId, quantity } });
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

        const [result] = await pool.query(
            'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (result.affectedRows === 0) {
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

        await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

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

        const [rows] = await pool.query(
            'SELECT COALESCE(SUM(quantity), 0) as count FROM cart_items WHERE user_id = ?',
            [userId]
        );

        res.json({ count: parseInt(rows[0].count) });
    } catch (error) {
        console.error('Get cart count error:', error);
        res.status(500).json({ error: 'Failed to get cart count' });
    }
};
