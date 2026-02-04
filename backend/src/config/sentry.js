import * as Sentry from '@sentry/node';
import '@sentry/tracing';

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
export const initSentry = (app) => {
    if (!process.env.SENTRY_DSN) {
        console.warn('Sentry DSN not configured. Error monitoring disabled.');
        return;
    }

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',

        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
        // In production, adjust this to a lower value (e.g., 0.1 for 10%)
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

        integrations: [
            // Enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // Enable Express.js middleware tracing
            new Sentry.Integrations.Express({ app }),
        ],

        // Filter out sensitive data
        beforeSend(event) {
            // Remove passwords and tokens from request data
            if (event.request) {
                delete event.request.cookies;
                if (event.request.data) {
                    const data = event.request.data;
                    if (data.password) data.password = '[Filtered]';
                    if (data.token) data.token = '[Filtered]';
                }
            }
            return event;
        },
    });

    return Sentry;
};

/**
 * Sentry request handler (must be first)
 */
export const sentryRequestHandler = () => Sentry.Handlers.requestHandler();

/**
 * Sentry tracing handler
 */
export const sentryTracingHandler = () => Sentry.Handlers.tracingHandler();

/**
 * Sentry error handler (must be before other error handlers)
 */
export const sentryErrorHandler = () => Sentry.Handlers.errorHandler();

export default { initSentry, sentryRequestHandler, sentryTracingHandler, sentryErrorHandler };
