/**
 * Cart Store
 * Manages shopping cart state with TypeScript
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types/order.types';
import { ordersApi } from '../services/ordersApi';

interface CartState {
    cart: CartItem[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchCart: (userId: string) => Promise<void>;
    addToCart: (product: Omit<CartItem, 'quantity'>, userId: string) => Promise<void>;
    removeFromCart: (productId: string, userId: string) => Promise<void>;
    updateQuantity: (productId: string, delta: number, userId: string) => Promise<void>;
    clearCart: (userId: string) => Promise<void>;

    // Computed values
    getCartTotal: () => number;
    getCartCount: () => number;

    // Reset
    resetCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            loading: false,
            error: null,

            // Fetch cart from database
            fetchCart: async (userId) => {
                if (!userId) return;

                set({ loading: true, error: null });
                try {
                    const response = await ordersApi.fetchCart(userId);
                    set({ cart: response.cart || [], loading: false });
                } catch (error) {
                    console.error('Failed to fetch cart:', error);
                    set({ error: 'Failed to load cart', loading: false });
                }
            },

            // Add item to cart
            addToCart: async (product, userId) => {
                if (!userId) {
                    const error = 'User ID required to add to cart';
                    console.error(error);
                    throw new Error(error);
                }

                set({ loading: true, error: null });
                try {
                    await ordersApi.addToCart(userId, product);

                    // Update local state optimistically
                    const currentCart = get().cart;
                    const existingItem = currentCart.find((item) => item.id === product.id);

                    if (existingItem) {
                        set({
                            cart: currentCart.map((item) =>
                                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                            ),
                            loading: false
                        });
                    } else {
                        set({
                            cart: [...currentCart, { ...product, quantity: 1 }],
                            loading: false
                        });
                    }
                } catch (error: any) {
                    console.error('Failed to add to cart:', error);
                    const errorMessage =
                        error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to add item';
                    set({ error: errorMessage, loading: false });
                    throw new Error(errorMessage);
                }
            },

            // Remove item from cart
            removeFromCart: async (productId, userId) => {
                if (!userId) return;

                set({ loading: true });
                try {
                    await ordersApi.removeFromCart(userId, productId);

                    set({
                        cart: get().cart.filter((item) => item.id !== productId),
                        loading: false
                    });
                } catch (error) {
                    console.error('Failed to remove from cart:', error);
                    set({ error: 'Failed to remove item', loading: false });
                }
            },

            // Update item quantity
            updateQuantity: async (productId, delta, userId) => {
                if (!userId) return;

                const currentCart = get().cart;
                const item = currentCart.find((i) => i.id === productId);
                if (!item) return;

                const newQuantity = Math.max(1, item.quantity + delta);

                set({ loading: true });
                try {
                    await ordersApi.updateQuantity(userId, productId, newQuantity);

                    set({
                        cart: currentCart.map((i) => (i.id === productId ? { ...i, quantity: newQuantity } : i)),
                        loading: false
                    });
                } catch (error) {
                    console.error('Failed to update quantity:', error);
                    set({ error: 'Failed to update quantity', loading: false });
                }
            },

            // Clear entire cart
            clearCart: async (userId) => {
                if (!userId) return;

                set({ loading: true });
                try {
                    await ordersApi.clearCart(userId);
                    set({ cart: [], loading: false });
                } catch (error) {
                    console.error('Failed to clear cart:', error);
                    set({ error: 'Failed to clear cart', loading: false });
                }
            },

            // Get cart total
            getCartTotal: () => {
                return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            },

            // Get cart count
            getCartCount: () => {
                return get().cart.reduce((sum, item) => sum + item.quantity, 0);
            },

            // Reset cart locally (for logout)
            resetCart: () => {
                set({ cart: [], loading: false, error: null });
            }
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                cart: state.cart
            })
        }
    )
);
