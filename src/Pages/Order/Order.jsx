import React, { useEffect, useState } from "react";
import api from "../../tokenApi/setupAxios";
import toast from "react-hot-toast";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrders = async () => {
    try {
      const res = await api.get(
        `/api/orders/user/${user._id}`
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(
        `/api/orders/${orderId}/cancel`
      );

      toast.success("Order cancelled successfully! ❌", {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });

      fetchOrders();
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error("Failed to cancel order. Please try again.", {
        duration: 3000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg">
              You don’t have any orders yet 😢
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const statusColor =
                order.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Shipped"
                  ? "bg-blue-100 text-blue-700"
                  : order.status === "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700";

              const dotColor =
                order.status === "Delivered"
                  ? "bg-green-500"
                  : order.status === "Shipped"
                  ? "bg-blue-500"
                  : order.status === "Cancelled"
                  ? "bg-red-500"
                  : "bg-yellow-500";

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Order #{order._id.slice(-4)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.date).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Total:{" "}
                        <span className="font-semibold text-gray-800">
                          ₹ {order.total.toFixed(2)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 truncate max-w-xs">
                        Address: {order.address || "Not provided"}
                      </p>
                    </div>

                    <div className="ml-auto">
                      <span
                        className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${dotColor}`}
                        />
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs">
                        🧾
                      </span>
                      Order Items
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
                        >
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                            />
                            <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-fuchsia-500 text-white text-xs flex items-center justify-center shadow">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-xs text-gray-500">
                              Price: ₹ {item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${dotColor}`}
                      />
                      <span className="font-medium mr-1">
                        Order Status:
                      </span>
                      <span className="font-semibold">{order.status}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {order.status !== "Cancelled" &&
                        order.status !== "Delivered" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 text-xs font-semibold text-red-600 bg-white hover:bg-red-50 transition"
                          >
                            ✖ Cancel Order
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
