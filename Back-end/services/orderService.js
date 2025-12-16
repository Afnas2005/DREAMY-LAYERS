const Order = require("../models/Order");

exports.create = async (data) => Order.create(data);

exports.user = async (userId) => Order.find({ userId });

exports.all = async () => Order.find();

exports.update = async (id, status) =>
  Order.findByIdAndUpdate(id, { status });
