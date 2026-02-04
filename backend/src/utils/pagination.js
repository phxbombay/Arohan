/**
 * Pagination helper utility
 * Provides consistent pagination across all endpoints
 */

/**
 * Parse pagination parameters from query string
 * @param {Object} query - Express request query object
 * @returns {Object} - Parsed pagination parameters
 */
export const getPaginationParams = (query) => {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 20, 100); // Max 100 items per page
    const offset = (page - 1) * limit;

    return {
        page,
        limit,
        offset
    };
};

/**
 * Create pagination metadata for response
 * @param {number} total - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} - Pagination metadata
 */
export const getPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrev,
        nextPage: hasNext ? page + 1 : null,
        prevPage: hasPrev ? page - 1 : null
    };
};

/**
 * Create paginated response
 * @param {Array} data - Array of items
 * @param {number} total - Total count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} - Paginated response object
 */
export const createPaginatedResponse = (data, total, page, limit) => {
    return {
        data,
        pagination: getPaginationMeta(total, page, limit)
    };
};
