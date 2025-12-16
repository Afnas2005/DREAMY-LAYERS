const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const auth = require("../middleware/auth");
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get single product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// Add product (admin)
router.post("/", auth, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// Update product
router.put("/:id", auth, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(product);
});

// Delete product
router.delete("/:id", auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
