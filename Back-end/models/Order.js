const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ FIX
    required: true,
  },
  items: Array,
  total: Number,
  paymentMethod: String,
  shippingAddress: String,
  status: {
    type: String,
    default: "Pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  name: String,
  phone: String,
});

module.exports = mongoose.model("Order", orderSchema);
