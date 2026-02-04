import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import addRequestId from 'express-request-id';
import cookieParser from 'cookie-parser';
import pool from './config/db.js';
import logger from './config/logger.js';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import swaggerSpec from './config/swagger.js';
import { cspMiddleware, additionalSecurityHeaders } from './middleware/csp.js';

dotenv.config();

const app = express();

// Trust proxy (important for rate limiting behind load balancers)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());

// Content Security Policy
app.use(cspMiddleware);

// Additional security headers
app.use(additionalSecurityHeaders);

// Response compression
app.use(compression());

// CORS Configuration - Allow only specific origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost', 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:8080', 'http://127.0.0.1:8080', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5000'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from origin ${origin}.`;
            logger.warn('CORS blocked request', { origin, allowedOrigins });
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

// Request ID for tracking
app.use(addRequestId());
app.use(cookieParser());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging with Winston
app.use((req, res, next) => {
    logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        requestId: req.id
    });
    next();
});

// Apply rate limiting to all routes
app.use('/v1/', apiLimiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Arohan Health API Docs'
}));

// Root Endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Arohan Health API v1.0.0 is running',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Import routes
import authRoutes from './routes/authRoutes.js';
import vitalsRoutes from './routes/vitalsRoutes.js';
import alertsRoutes from './routes/alertsRoutes.js';
import devicesRoutes from './routes/devicesRoutes.js';
import healthRoutes from './routes/health.js';
import cartRoutes from './routes/cart.js';
import metricsRoutes from './routes/metrics.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import phonePeRoutes from './routes/phonePeRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// API Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/integration', integrationRoutes);
app.use('/v1/vitals', vitalsRoutes);
app.use('/v1/alerts', alertsRoutes);
app.use('/v1/devices', devicesRoutes);
app.use('/v1/health', healthRoutes);
app.use('/v1/cart', cartRoutes);
app.use('/v1/metrics', metricsRoutes);
app.use('/v1/contact', contactRoutes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/blog', blogRoutes);
app.use('/v1/payment', paymentRoutes);
app.use('/v1/leads', leadRoutes);
app.use('/v1/phonepe', phonePeRoutes);
app.use('/v1/orders', orderRoutes);
app.use('/v1/invoices', invoiceRoutes);
app.use('/v1/notifications', notificationRoutes);

// Health check endpoint (outside rate limiting)
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT NOW()');
        res.json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        logger.error('Health check failed', { error: err.message });
        res.status(500).json({
            status: 'error',
            database: 'disconnected',
            message: 'Database connection failed'
        });
    }
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Route ${req.originalUrl} not found`
    });
});

// Centralized error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server started`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
    });
});
