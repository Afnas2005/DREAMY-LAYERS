import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../tokenApi/setupAxios";
import { ArrowLeft, Package, ShoppingCart, User, Mail, Calendar } from "lucide-react";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const userResponse = await api.get(`/api/users/${id}`);
        setUser(userResponse.data);

        const ordersResponse = await api.get(`/api/orders`);
        
        const userOrders = ordersResponse.data.filter(order => 
          order.userId === id || order.userId === parseInt(id) || 
          (order.user && (order.user.id === id || order.user.id === parseInt(id)))
        );
        
        setOrders(userOrders);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">User not found</h3>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition-colors duration-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-pink-600 hover:text-pink-700 transition-colors duration-200 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h2 className="text-3xl font-bold text-gray-800">User Details</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-pink-100 p-3 rounded-xl mr-4">
            <User className="h-8 w-8 text-pink-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
            <p className="text-gray-600 flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              {user.email}
            </p>
          </div>
        </div>

        {user.phone && (
          <p className="text-gray-600 mb-2">
            <strong>Phone:</strong> {user.phone}
          </p>
        )}
        {user.address && (
          <p className="text-gray-600">
            <strong>Address:</strong> {user.address}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <ShoppingCart className="h-6 w-6 text-pink-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-800">Order History</h3>
          <span className="ml-3 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No orders found for this user</p>
            <p className="text-gray-400 mt-2">This user hasn't placed any orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-gray-100">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Order #{order.id.toString().padStart(6, '0')}
                    </h4>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {order.date ? new Date(order.date).toLocaleDateString() : 'Date not available'}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      {order.status || 'Completed'}
                    </span>
                    <div className="font-bold text-pink-600 text-lg mt-1">
                      ₹{order.total ? order.total.toFixed(2) : '0.00'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium text-gray-700 mb-2">Items:</h5>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id || item.productId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">
                            {item.name || `Product ${item.productId}`}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            (x{item.quantity || 1})
                          </span>
                          {item.size && (
                            <span className="text-sm text-gray-500 ml-2">• Size: {item.size}</span>
                          )}
                        </div>
                        <span className="font-medium text-gray-800">
                          ₹{item.price ? (item.price * (item.quantity || 1)).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 py-3">No items found in this order</p>
                  )}
                </div>

                {order.shippingAddress && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <strong>Shipping to:</strong> {order.shippingAddress}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}