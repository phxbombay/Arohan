import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, getCartCount } from '../controllers/cartController.js';
import { validate, validateParams, addToCartSchema, updateCartSchema, userIdSchema, cartItemParamsSchema } from '../validators/cartValidator.js';
import { cartLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply cart rate limiting to all routes
router.use(cartLimiter);

// Get user's cart
router.get('/:userId', validateParams(userIdSchema), getCart);

// Get cart count
router.get('/:userId/count', validateParams(userIdSchema), getCartCount);

// Add item to cart
router.post('/:userId/items', validateParams(userIdSchema), validate(addToCartSchema), addToCart);

// Update item quantity
router.put('/:userId/items/:productId', validateParams(cartItemParamsSchema), validate(updateCartSchema), updateCartItem);

// Remove item from cart
router.delete('/:userId/items/:productId', validateParams(cartItemParamsSchema), removeFromCart);

// Clear entire cart
router.delete('/:userId', validateParams(userIdSchema), clearCart);

export default router;
