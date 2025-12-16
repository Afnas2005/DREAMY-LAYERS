const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  get,
  add,
  remove,
} = require("../controllers/wishlistControl");
router.get("/:userId", auth, get);

// Add to wishlist
router.post("/:userId", auth, add);

// Remove from wishlist
router.delete("/:userId/:productId", auth, remove);

module.exports = router;
