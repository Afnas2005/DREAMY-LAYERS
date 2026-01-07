const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();   // 👈 1. create app FIRST

// 👇 2. ADD CORS CONFIG HERE (EXACTLY HERE)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://dreamy-layers-n2ao.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// 👇 3. Preflight support (MUST)
app.options("*", cors());

// 👇 4. Body parser
app.use(express.json());


// ================= ROUTES =================
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB Error:", err));

// ================= SERVER =================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
