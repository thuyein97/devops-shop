const express = require("express");
const healthRouter = require("./routes/health");
const productsRouter = require("./routes/products");
const metricsRouter = require("./routes/metrics");
const { httpRequestCounter, httpRequestDuration } = require("./metrics");

const app = express();

app.use(express.json());

// Middleware to record metrics for all incoming requests
app.use((req, res, next) => {
  // Ignore tracking the /metrics endpoint itself to avoid noise
  if (req.path === "/metrics") {
    return next();
  }

  const endTimer = httpRequestDuration.startTimer();

  res.on("finish", () => {
    // Fall back to req.path if route pattern isn't matched
    const route = req.route ? req.route.path : req.path;
    const labels = {
      method: req.method,
      route: route,
      status: res.statusCode
    };

    httpRequestCounter.inc(labels);
    endTimer(labels);
  });

  next();
});

// Routes
app.use("/health", healthRouter);
app.use("/api/products", productsRouter);
app.use("/metrics", metricsRouter);

module.exports = app;