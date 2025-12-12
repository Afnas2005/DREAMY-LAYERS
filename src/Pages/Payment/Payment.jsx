import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useCart } from "../../Context/CartContext";

export default function Payment() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const handlePayment = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await axios.post("http://localhost:5001/api/orders", {
        userId: user._id,
        name,
        phone,
        shippingAddress: address,
        items: cart,
        total: cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        paymentMethod,
        status: "Pending",
        date: new Date(),
      });

      clearCart();

      toast.success("Order placed successfully 🎉");
      navigate("/order");

    } catch (error) {
      console.error("Order submit failed", error);
      toast.error("Order failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handlePayment}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Payment Details 💳
        </h2>

        <label className="block mb-2 text-gray-700 font-semibold">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          required
        />

        <label className="block mb-2 text-gray-700 font-semibold">Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          maxLength="10"
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          required
        />

        <label className="block mb-2 text-gray-700 font-semibold">Delivery Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter delivery address"
          rows="3"
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          required
        />

        <label className="block mb-2 text-gray-700 font-semibold">Payment Method</label>
        <div className="mb-4">
          <label className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="netbanking"
              checked={paymentMethod === "netbanking"}
              onChange={() => setPaymentMethod("netbanking")}
            />
            Net Banking
          </label>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm text-gray-600">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 mt-2 pt-2 font-semibold">
            Total: ${cart.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ).toFixed(2)}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-full font-semibold shadow-md hover:scale-105 transform transition-all duration-300"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
