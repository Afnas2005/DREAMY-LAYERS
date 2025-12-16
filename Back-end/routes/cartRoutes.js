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

router.post("/:userId", auth, add);

router.put("/:userId/decrease", auth, decrease);


router.delete('/:userId/all', async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndDelete({ userId: userId }); 
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: userId },
      { $pull: { products: { productId: productId } } }, 
      { new: true } 
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

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
