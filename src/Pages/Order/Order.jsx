import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // 👍 FIX

  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`http://localhost:5001/api/orders/user/${user._id}`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, [user]);

  return (
    <div className="p-6 mt-16 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-pink-600 text-center animate-fade-in-up">
        📦 Your Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-10 animate-pulse">
          <p className="text-gray-500 text-lg">
            You don’t have any orders yet 😢
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up"
            >
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Order #{order._id.slice(-6)}
                </h2>
                <p className="text-gray-500 text-sm">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-4 mb-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row justify-between items-center py-3"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-2/3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-pink-600 font-bold">
                          ₹ {item.price}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-pink-600 text-lg mt-3 sm:mt-0">
                      ₹ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span
                  className={`font-semibold flex items-center ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Shipped"
                      ? "text-blue-600"
                      : order.status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full mr-2 animate-pulse"
                    style={{
                      background:
                        order.status === "Delivered"
                          ? "green"
                          : order.status === "Shipped"
                          ? "blue"
                          : order.status === "Cancelled"
                          ? "red"
                          : "orange",
                    }}
                  />
                  {order.status}
                </span>
                <p className="font-bold text-xl text-gray-800">
                  Total:{" "}
                  <span className="text-pink-600">
                    ₹ {order.total.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
