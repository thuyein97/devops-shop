const express = require("express");

const router = express.Router();

const products = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Keyboard", price: 80 },
  { id: 3, name: "Mouse", price: 40 }
];

router.get("/", (_req, res) => {
  res.json(products);
});

router.get("/:id", (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json(product);
});

module.exports = router;
