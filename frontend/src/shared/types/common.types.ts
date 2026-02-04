/**
 * Common Types
 * Shared types used across features
 */

/**
 * User roles in the system
 */
export type UserRole = 'patient' | 'doctor' | 'admin';

/**
 * Order status
 */
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';

/**
 * Payment status
 */
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

/**
 * Payment method
 */
export type PaymentMethod = 'razorpay' | 'phonepe' | 'cash';
