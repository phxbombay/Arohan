/**
 * Safely parses a date string into a Date object.
 * Fixes iOS/Safari issue where 'YYYY-MM-DD' is invalid.
 * @param {string|Date} dateInput
 * @returns {Date}
 */
export const safeDate = (dateInput) => {
    if (!dateInput) return new Date();
    if (dateInput instanceof Date) return dateInput;

    // specific fix for ISO-like strings (YYYY-MM-DD...)
    if (typeof dateInput === 'string') {
        // iOS/Safari fails on 'YYYY-MM-DD' and 'YYYY-MM-DD HH:mm:ss'
        // Replacing hyphens with slashes is the most compatible way for all Safari versions.
        let sanitized = dateInput;
        
        // Handle ISO with space instead of 'T'
        if (sanitized.includes(' ') && sanitized.includes('-')) {
            // Replace hyphens only in the date part (before the space)
            // or just replace all hyphens to be safe for most standard formats
            sanitized = sanitized.replace(/-/g, '/');
        } else if (sanitized.includes('-')) {
            sanitized = sanitized.replace(/-/g, '/');
        }

        const date = new Date(sanitized);
        // Fallback for invalid formats
        if (isNaN(date.getTime())) {
            // If still invalid, try standard Date.parse or return current date
            return new Date();
        }
        return date;
    }

    return new Date(dateInput);
};
