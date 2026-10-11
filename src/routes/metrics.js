const express = require("express");
const client = require("prom-client");

const router = express.Router();

client.collectDefaultMetrics();

router.get("/", async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

const { register } = require("../metrics"); // Path to your metrics.js

router.get("/", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

module.exports = router;
