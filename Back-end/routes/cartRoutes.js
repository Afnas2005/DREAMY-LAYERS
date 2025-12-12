const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart || { items: [] });
});

router.post("/:userId", async (req, res) => {
  const product = req.body.product;
  let cart = await Cart.findOne({ userId: req.params.userId });

  if (!cart) {
    cart = await Cart.create({
      userId: req.params.userId,
      items: [{ ...product, productId: product._id, quantity: 1 }]
    });
  } else {
    const index = cart.items.findIndex(i => i.productId == product._id);

    if (index > -1) {
      cart.items[index].quantity += 1;
    } else {
      cart.items.push({ ...product, productId: product._id, quantity: 1 });
    }
  }

  await cart.save();
  res.json(cart.items);
});

router.put("/:userId/decrease", async (req, res) => {
  const productId = req.body.productId;
  let cart = await Cart.findOne({ userId: req.params.userId });

  const index = cart.items.findIndex(i => i.productId == productId);
  if (index > -1 && cart.items[index].quantity > 1) {
    cart.items[index].quantity -= 1;
  }

  await cart.save();
  res.json(cart.items);
});

router.delete("/:userId/:productId", async (req, res) => {
  let cart = await Cart.findOne({ userId: req.params.userId });
  cart.items = cart.items.filter(i => i.productId != req.params.productId);
  await cart.save();
  res.json(cart.items);
});

module.exports = router;
