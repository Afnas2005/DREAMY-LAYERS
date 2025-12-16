const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  create,
  getUserOrders,
  getAll,
  updateStatus,
} = require("../controllers/orderControl");
router.post("/", auth, create);

// Get orders for a user
router.get("/user/:userId", auth, getUserOrders);

// Admin: get all orders
router.get("/", auth, getAll);

// Admin: update status
router.put("/:id/status", auth, updateStatus);

module.exports = router;
