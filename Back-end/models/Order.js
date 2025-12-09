const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  items: [],
  total: Number,
  paymentMethod: String,
  shippingAddress: String,
  status: {
    type: String,
    default: "Pending"
  },
  date: Date,
  name: String,
  phone: String
});

module.exports = mongoose.model("Order", orderSchema);
