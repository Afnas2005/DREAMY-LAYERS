const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  create,
  getUserOrders,
  getAll,
  updateStatus,
  cancelOrder,
} = require("../controllers/orderControl");
router.post("/", auth, create);

router.get("/user/:userId", auth, getUserOrders);

router.get("/", auth, getAll);

router.put("/:id/status", auth, updateStatus);

router.put("/:id/cancel", auth, cancelOrder);

module.exports = router;
