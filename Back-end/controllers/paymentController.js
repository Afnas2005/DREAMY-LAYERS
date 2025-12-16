const Razorpay = require("razorpay");

/**
 * CREATE RAZORPAY ORDER (TEST MODE)
 * POST /api/payment/create-order
 */
exports.createRazorpayOrder = async (req, res) => {
  try {
    // amount should come from frontend (in rupees)
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error);
    res.status(500).json({
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};
