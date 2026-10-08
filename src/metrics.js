const client = require("prom-client");

// Create a Registry to register the metrics
const register = new client.Registry();

// Add default process metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({ register });

// Define Custom Metric 1: Total HTTP Requests Counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"]
});

// Define Custom Metric 2: Request Duration Histogram
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

// Register custom metrics
register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);

module.exports = {
  register,
  httpRequestCounter,
  httpRequestDuration
};