/**
 * Orders & Cart Types
 * TypeScript definitions for orders feature
 */

// Cart Item
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    description?: string;
}

// Cart State
export interface Cart {
    items: CartItem[];
    total: number;
    count: number;
}

// Order Status
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Payment Status
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Payment Method
export type PaymentMethod = 'razorpay' | 'cod' | 'upi';

// Order Address
export interface OrderAddress {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

// Order Item (for order history)
export interface OrderItem {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

// Order
export interface Order {
    order_id: string;
    user_id: string;
    items: OrderItem[];
    total_amount: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    payment_method: PaymentMethod;
    shipping_address: OrderAddress;
    created_at: string;
    updated_at: string;
}

// Checkout Form Data
export interface CheckoutFormData {
    full_name: string;
    email: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    payment_method: PaymentMethod;
}

// Payment Response
export interface PaymentResponse {
    order_id: string;
    payment_id?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    status: PaymentStatus;
    message: string;
}
