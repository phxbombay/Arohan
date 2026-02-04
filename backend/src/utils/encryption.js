import crypto from 'crypto';

// Use a secure key from environment variables (must be 32 bytes for AES-256)
// Fallback for development ONLY
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012';
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypts a text using AES-256-GCM
 * @param {string} text - text to encrypt
 * @returns {string} - salt:iv:tag:encrypted (colon separated)
 */
export const encrypt = (text) => {
    if (!text) return null;

    // Check key length
    if (ENCRYPTION_KEY.length !== 32) {
        console.warn('Encryption key is not 32 bytes! Using hash to stretch it.');
        // In real app, we might throw error, here we fix it for stability
    }

    // Derive a consistent 32-byte key from the secret (if strict 32 chars not guaranteed)
    // Or just use the buffer if we trust env is correct hex or string. 
    // For safety let's hash the key to ensure 32 bytes (256 bits)
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    // Return Format: iv:tag:encrypted
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
};

/**
 * Decrypts a text using AES-256-GCM
 * @param {string} text - iv:tag:encrypted
 * @returns {string} - decrypted text
 */
export const decrypt = (text) => {
    if (!text) return null;

    try {
        const parts = text.split(':');

        // Handle unencrypted legacy data gracefully (optional)
        if (parts.length !== 3) return text;

        const [ivHex, tagHex, encryptedHex] = parts;

        const iv = Buffer.from(ivHex, 'hex');
        const tag = Buffer.from(tagHex, 'hex');
        const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);

        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error.message);
        return null; // Return null on failure to avoid leaking raw errors
    }
};

export default { encrypt, decrypt };
