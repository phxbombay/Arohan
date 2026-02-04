/**
 * Orders API Service
 * API calls for cart and order operations
 */

import apiClient from '@core/api/client';
import type { CartItem, Order, CheckoutFormData, PaymentResponse } from '../types/order.types';

export const ordersApi = {
    // Cart Operations
    fetchCart: async (userId: string): Promise<{ cart: CartItem[] }> => {
        const { data } = await apiClient.get(`/cart/${userId}`);
        return data;
    },

    addToCart: async (userId: string, product: Omit<CartItem, 'quantity'>): Promise<void> => {
        await apiClient.post(`/cart/${userId}/items`, product);
    },

    removeFromCart: async (userId: string, productId: string): Promise<void> => {
        await apiClient.delete(`/cart/${userId}/items/${productId}`);
    },

    updateQuantity: async (userId: string, productId: string, quantity: number): Promise<void> => {
        await apiClient.put(`/cart/${userId}/items/${productId}`, { quantity });
    },

    clearCart: async (userId: string): Promise<void> => {
        await apiClient.delete(`/cart/${userId}`);
    },

    // Order Operations
    createOrder: async (orderData: CheckoutFormData): Promise<Order> => {
        const { data } = await apiClient.post('/orders', orderData);
        return data;
    },

    getOrders: async (userId: string): Promise<Order[]> => {
        const { data } = await apiClient.get(`/orders/user/${userId}`);
        return data;
    },

    getOrder: async (orderId: string): Promise<Order> => {
        const { data } = await apiClient.get(`/orders/${orderId}`);
        return data;
    },

    // Payment Operations
    createPayment: async (orderId: string, paymentMethod: string): Promise<PaymentResponse> => {
        const { data } = await apiClient.post('/payments/create', {
            order_id: orderId,
            payment_method: paymentMethod
        });
        return data;
    },

    verifyPayment: async (paymentData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<PaymentResponse> => {
        const { data } = await apiClient.post('/payments/verify', paymentData);
        return data;
    }
};
