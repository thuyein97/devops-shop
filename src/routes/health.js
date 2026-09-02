const express = require("express");

const router = express.Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    status: "UP",
    service: "devops-shop",
    version: process.env.APP_VERSION || "local"
  });
});

module.exports = router;
