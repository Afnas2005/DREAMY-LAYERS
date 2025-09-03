import React from "react";
import { useCart } from "../../Context/cartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.length === 0) {
    return (
      <div className="p-6 min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-4 text-pink-600">Your Cart</h2>
        <p className="text-gray-600 text-lg">Your cart is empty 🛒</p>
        <div className="mt-6">
        </div>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate("/payment"); 
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center text-pink-600 animate-fade-in-up">
        Your Cart
      </h2>

      <ul className="space-y-6">
        {cart.map((item) => (
          <li
            key={item.id}
            className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up"
          >
            <div className="flex items-center gap-4 w-full md:w-2/3">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-lg object-cover shadow-md"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                <p className="text-pink-600 font-bold text-lg">${item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
              <p className="font-bold text-pink-600 text-lg">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="px-4 py-1 text-white bg-red-500 rounded-full hover:bg-red-600 shadow-md transition transform hover:scale-105"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-lg p-6 animate-fade-in-up">
        <h3 className="text-2xl font-bold text-gray-800">
          Total: <span className="text-pink-600">${total.toFixed(2)}</span>
        </h3>
        <button
          onClick={handleCheckout}
          className="mt-4 md:mt-0 px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:scale-105 transform transition-all duration-300"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}