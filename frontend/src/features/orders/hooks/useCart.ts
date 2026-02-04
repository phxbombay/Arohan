/**
 * useCart Hook
 * Convenience hook for cart operations
 */

import { useCartStore } from '../store/cartStore';
import { useAuth } from '@features/auth/hooks/useAuth';

export const useCart = () => {
    const { user } = useAuth();
    const userId = user?.user_id;

    const {
        cart,
        loading,
        error,
        fetchCart,
        addToCart: addToCartStore,
        removeFromCart: removeFromCartStore,
        updateQuantity: updateQuantityStore,
        clearCart: clearCartStore,
        getCartTotal,
        getCartCount,
        resetCart
    } = useCartStore();

    // Wrapper functions that automatically pass userId
    const addToCart = async (product: Omit<Parameters<typeof addToCartStore>[0], 'quantity'>) => {
        if (!userId) throw new Error('User must be logged in');
        return addToCartStore(product, userId);
    };

    const removeFromCart = async (productId: string) => {
        if (!userId) throw new Error('User must be logged in');
        return removeFromCartStore(productId, userId);
    };

    const updateQuantity = async (productId: string, delta: number) => {
        if (!userId) throw new Error('User must be logged in');
        return updateQuantityStore(productId, delta, userId);
    };

    const clearCart = async () => {
        if (!userId) throw new Error('User must be logged in');
        return clearCartStore(userId);
    };

    const loadCart = async () => {
        if (!userId) return;
        return fetchCart(userId);
    };

    return {
        cart,
        loading,
        error,
        cartTotal: getCartTotal(),
        cartCount: getCartCount(),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCart,
        resetCart
    };
};
