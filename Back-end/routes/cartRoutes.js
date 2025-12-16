const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");
const {
  getCart,
  add,
  remove,
  decrease,
} = require("../controllers/cartControl");
router.get("/:userId", auth, getCart);

// Add / Increase item
router.post("/:userId", auth, add);

// Decrease quantity
router.put("/:userId/decrease", auth, decrease);

// Remove item
// CLEAR CART AFTER ORDER
router.delete("/:userId/all", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.json({ items: [] });
    }

    cart.items = [];
    await cart.save();

    res.json({ items: [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
});


module.exports = router;
