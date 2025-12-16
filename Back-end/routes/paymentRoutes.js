const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createRazorpayOrder } = require("../controllers/paymentController");

router.post("/create-order", auth, createRazorpayOrder);

module.exports = router;
