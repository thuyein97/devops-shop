const express = require("express");
const healthRouter = require("./routes/health");
const productsRouter = require("./routes/products");
const metricsRouter = require("./routes/metrics");

const app = express();

app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/products", productsRouter);
app.use("/metrics", metricsRouter);

module.exports = app;
