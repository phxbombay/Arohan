import helmet from 'helmet';

/**
 * Content Security Policy Configuration
 * Protects against XSS, clickjacking, and other code injection attacks
 */

export const cspMiddleware = helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
            "'self'",
            // Allow inline scripts for Swagger UI
            "'unsafe-inline'",
            // Add trusted CDNs if needed
            // "https://cdn.jsdelivr.net"
        ],

        styleSrc: [
            "'self'",
            "'unsafe-inline'", // For Swagger and dynamic styles
        ],

        imgSrc: [
            "'self'",
            "data:", // For data URLs (base64 images)
            "https:", // Allow HTTPS images from any domain
            "blob:", // For blob URLs
        ],

        connectSrc: [
            "'self'",
            // Add your API domains
            "http://localhost:5000",
            "http://localhost:3000",
            process.env.API_URL || "",
        ].filter(Boolean),

        fontSrc: [
            "'self'",
            "data:",
            // Add Google Fonts if needed
            // "https://fonts.googleapis.com",
            // "https://fonts.gstatic.com"
        ],

        objectSrc: ["'none'"],

        mediaSrc: ["'self'"],

        frameSrc: ["'none'"],

        baseUri: ["'self'"],

        formAction: ["'self'"],

        frameAncestors: ["'none'"], // Prevent clickjacking

        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
    reportOnly: process.env.NODE_ENV === 'development', // Report-only in dev, enforce in prod
});

/**
 * Additional security headers
 */
export const additionalSecurityHeaders = (req, res, next) => {
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Enable XSS filter
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy (formerly Feature Policy)
    res.setHeader(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(self), payment=()'
    );

    next();
};

export default { cspMiddleware, additionalSecurityHeaders };
