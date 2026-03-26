import client from 'prom-client';

// Create a Registry which registers the metrics
export const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'arohan-health-backend'
});

// Enable the collection of default metrics (CPU, memory, event loop lag, etc.)
client.collectDefaultMetrics({ register });

// Expose a custom HTTP request duration histogram
export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});
register.registerMetric(httpRequestDurationMicroseconds);

// Expose a custom counter for tracking errors
export const errorCounter = new client.Counter({
  name: 'app_errors_total',
  help: 'Total number of errors encountered within the Express stack',
  labelNames: ['type', 'endpoint']
});
register.registerMetric(errorCounter);
