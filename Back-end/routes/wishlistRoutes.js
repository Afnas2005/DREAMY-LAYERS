const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  get,
  add,
  remove,
} = require("../controllers/wishlistControl");
router.get("/:userId", auth, get);

router.post("/:userId", auth, add);

router.delete("/:userId/:productId", auth, remove);

module.exports = router;
