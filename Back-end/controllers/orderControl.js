const Order = require("../models/Order");

/**
 * CREATE ORDER
 * POST /api/orders
 */
exports.create = async (req, res) => {
  try {
    // 🔐 userId comes from JWT (auth middleware)
    const userId = req.user.id;

    const {
      items,
      total,
      paymentMethod,
      shippingAddress,
      name,
      phone,
    } = req.body;

    // ❗ basic validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const order = await Order.create({
      userId,
      items,
      total,
      paymentMethod,
      shippingAddress,
      name,
      phone,
      status: "Pending",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

/**
 * GET ORDERS FOR LOGGED-IN USER
 * GET /api/orders/user/:userId
 */
exports.getUserOrders = async (req, res) => {
  try {
    // 🔒 user can only access his own orders
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};

/**
 * ADMIN – GET ALL ORDERS
 * GET /api/orders
 */
exports.getAll = async (req, res) => {
  try {
    // 🔐 admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

/**
 * ADMIN – UPDATE ORDER STATUS
 * PUT /api/orders/:id/status
 */
exports.updateStatus = async (req, res) => {
  try {
    // 🔐 admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
