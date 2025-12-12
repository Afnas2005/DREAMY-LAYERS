import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Package, Calendar, ChevronRight, ArrowLeft } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5001/api/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">

      <button
        onClick={() => navigate("/admin")}
        className="mb-6 flex items-center gap-2 text-pink-600 font-medium 
                   bg-pink-50 px-4 py-2 rounded-xl shadow-sm 
                   hover:bg-pink-100 transition-all duration-300 w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      <h2 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">
        Manage Orders
      </h2>

      <div className="space-y-6">
        {orders.map(order => (
          <div
            key={order._id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-1">
                  <Package className="h-5 w-5 text-pink-500 mr-2" />
                  Order #{order._id.slice(-6)}
                </h3>
                <p className="text-gray-500 text-sm flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>

              <Link
                to={`/admin/orders/${order._id}`}
                className="mt-4 md:mt-0 inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 font-medium text-sm"
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="border-t my-4"></div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {order?.items?.slice(0, 4).map((item, idx) => (
                <img
                  key={idx}
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-xl object-cover border border-gray-200 shadow-sm"
                />
              ))}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-gray-700 font-semibold text-lg">
                ₹{order.total}
              </div>

              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="mt-3 sm:mt-0 px-4 py-2 border border-gray-300 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
