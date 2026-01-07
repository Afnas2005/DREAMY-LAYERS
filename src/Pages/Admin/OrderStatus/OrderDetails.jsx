import React, { useEffect, useState } from "react";
import api from "../../../tokenApi/setupAxios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calendar } from "lucide-react";

export default function OrderDetails() {
  const { _id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/api/orders/${_id}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error(err));
  }, [_id]);

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/admin/orders")}
        className="flex items-center text-pink-600 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Order #{order._id.slice(-6)}
        </h2>

        <p className="text-gray-600 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date(order.date).toLocaleString()}
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-700">Items</h3>
        {order.items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between border-b py-2 text-gray-700"
          >
            <span>{item.name}</span>
            <span>x{item.quantity}</span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
