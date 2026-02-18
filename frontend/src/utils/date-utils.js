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
        // We replace hyphens with slashes if it looks like a date.
        // This is a safe operation for standard ISO dates.
        if (dateInput.includes('-')) {
            // Only replace if it looks like a date structure to avoid breaking other strings
            // But for safety in this utility, we assume it is a date string.
            // Replacing all hyphens with slashes is generally safe for date parsing
            return new Date(dateInput.replace(/-/g, '/'));
        }
    }

    return new Date(dateInput);
};
