const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const auth = require("../middleware/auth");


router.get("/:userId", auth,async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.params.userId });
  res.json(wishlist || { items: [] });
});
router.post("/:userId",auth, async (req, res) => {
  const product = req.body.product;
  let wishlist = await Wishlist.findOne({ userId: req.params.userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId: req.params.userId,
      items: [{ ...product, productId: product._id }]
    });
  } else {
    const exists = wishlist.items.some(i => i.productId == product._id);
    if (!exists) wishlist.items.push({ ...product, productId: product._id });
  }

  await wishlist.save();
  res.json(wishlist.items);
});

router.delete("/:userId/:productId",auth, async (req, res) => {
  let wishlist = await Wishlist.findOne({ userId: req.params.userId });
  wishlist.items = wishlist.items.filter(i => i.productId != req.params.productId);
  await wishlist.save();
  res.json(wishlist.items);
});

module.exports = router;
