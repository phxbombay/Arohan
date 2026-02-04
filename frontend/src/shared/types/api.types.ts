/**
 * Shared API Types
 * Common types used across the application
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: 'success' | 'error';
}

/**
 * API Error response
 */
export interface ApiError {
    message: string;
    errors?: ValidationError[];
    status: number;
    statusCode?: number;
}

/**
 * Validation error for specific fields
 */
export interface ValidationError {
    field: string;
    message: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore?: boolean;
}

/**
 * Common pagination params
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

/**
 * Common filter params
 */
export interface FilterParams {
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
}
