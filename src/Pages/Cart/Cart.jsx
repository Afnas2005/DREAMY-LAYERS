import React, { useContext } from "react";
import { CartContext } from "../../Context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } =
    useContext(CartContext);
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-b from-[#fff6ec] to-[#ffeede] px-4">
        <h2 className="text-3xl font-extrabold mb-4 text-[#9b4a0f]">
          Shopping Cart
        </h2>
        <p className="text-gray-600 text-lg mb-4">
          Please log in to view your cart.
        </p>
        <Link
          to="/login"
          className="bg-gradient-to-r from-[#c25a13] to-[#e06f1b] text-white px-6 py-2 rounded-full font-medium shadow-md hover:opacity-90 transition"
        >
          Login Now
        </Link>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-b from-[#fff6ec] to-[#ffeede] px-4">
        <h2 className="text-3xl font-extrabold mb-4 text-[#9b4a0f]">
          Shopping Cart
        </h2>
        <p className="text-gray-600 text-lg">Your cart is empty 🛒</p>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    navigate("/payment");
  };

  const handleQuantityChange = (id, action) => {
    if (!isAuthenticated) return;

    if (action === "increase") {
      increaseQuantity(id);
    } else if (action === "decrease") {
      decreaseQuantity(id);
    }
  };

  const handleRemoveItem = (id) => {
    if (!isAuthenticated) return;
    removeFromCart(id);
  };

  const handleClearCart = () => {
    if (!isAuthenticated) return;
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      clearCart();
    }
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#9b4a0f]">
            Shopping Cart
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {itemsCount} item{itemsCount !== 1 && "s"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-stretch bg-white rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition overflow-hidden"
              >
                <div className="flex flex-1 items-center gap-4 px-5 py-4">
                  <div className="w-24 h-24 bg-orange-50 rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                      {item.name}
                    </h3>
                    <p className="text-[#c25a13] font-bold text-base sm:text-lg mt-1">
                      ₹{item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="inline-flex items-center rounded-full border border-gray-200 bg-white">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, "decrease")
                          }
                          className="px-3 py-1 text-gray-500 hover:text-gray-700"
                        >
                          −
                        </button>
                        <span className="px-4 text-sm font-medium text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, "increase")
                          }
                          className="px-3 py-1 text-gray-500 hover:text-gray-700"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs text-gray-400">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end px-4 py-4 border-l border-orange-50 min-w-[90px]">
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-gray-300 hover:text-red-500 text-xl leading-none"
                  >
                    ×
                  </button>
                  <p className="text-sm font-semibold text-gray-800">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-500 font-semibold">Free</span>
              </div>
              <hr className="my-3 border-gray-200" />
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="text-[#c25a13]">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-[#c25a13] to-[#e06f1b] text-white text-sm font-semibold shadow-md hover:opacity-95 transition"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={handleClearCart}
              className="mt-3 w-full py-3 rounded-lg bg-[#ffe3db] text-[#c0392b] text-sm font-semibold border border-[#ffc9bb] hover:bg-[#ffd6cb] transition"
            >
              Clear Cart
            </button>

            <button
              onClick={handleContinueShopping}
              className="mt-3 w-full py-3 rounded-lg bg-white text-gray-700 text-sm font-semibold border border-gray-200 hover:bg-orange-50/60 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
