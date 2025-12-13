const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart"); // ✅ FIX
const auth = require("../middleware/auth");

// CREATE ORDER + CLEAR CART
router.post("/", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    // 1. Get cart from DB
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Create order
    const order = await Order.create({
      userId,
      name: req.body.name,
      phone: req.body.phone,
      shippingAddress: req.body.shippingAddress,
      items: cart.items,
      total: cart.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      ),
      paymentMethod: req.body.paymentMethod,
      status: "Pending",
      date: new Date(),
    });

    // 3. Clear cart in DB
    cart.items = [];
    await cart.save();

    res.status(201).json(order);

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ORDERS OF LOGGED-IN USER
router.get("/user/:userId", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// GET ALL ORDERS (ADMIN)
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// UPDATE ORDER STATUS
router.put("/:id/status", auth, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
