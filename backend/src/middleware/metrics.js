import client from 'prom-client';

// Create a Registry
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: 'arohan-backend'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Define custom metrics
export const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // buckets for response time from 0.1s to 10s
    registers: [register]
});

export const httpRequestTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'code'],
    registers: [register]
});

export const httpErrorTotal = new client.Counter({
    name: 'http_errors_total',
    help: 'Total number of HTTP errors',
    labelNames: ['method', 'route', 'code'],
    registers: [register]
});

// Middleware to measure request duration
export const metricsMiddleware = (req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const duration = process.hrtime(start);
        const durationInSeconds = duration[0] + duration[1] / 1e9;

        const route = req.route ? req.route.path : req.path;

        httpRequestDurationMicroseconds
            .labels(req.method, route, res.statusCode)
            .observe(durationInSeconds);

        httpRequestTotal
            .labels(req.method, route, res.statusCode)
            .inc();

        if (res.statusCode >= 400) {
            httpErrorTotal
                .labels(req.method, route, res.statusCode)
                .inc();
        }
    });

    next();
};

// Endpoint to expose metrics
export const getMetrics = async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
};

// Get metrics in JSON format for frontend dashboard
export const getMetricsJSON = async (req, res) => {
    try {
        const metrics = await register.getMetricsAsJSON();
        res.json({
            status: 'success',
            data: metrics
        });
    } catch (error) {
        logger.error('Metrics JSON Error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
            data: []
        });
    }
};
