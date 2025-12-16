import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  Eye,
  User,
  MapPin
} from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
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

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.phone?.includes(searchTerm);
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "highest":
          return b.total - a.total;
        case "lowest":
          return a.total - b.total;
        case "newest":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(order => order.status === "Pending").length;
  const deliveredOrders = orders.filter(order => order.status === "Delivered").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Processing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Shipped": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Delivered": return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock className="h-4 w-4" />;
      case "Processing": return <RefreshCw className="h-4 w-4" />;
      case "Shipped": return <Truck className="h-4 w-4" />;
      case "Delivered": return <CheckCircle className="h-4 w-4" />;
      case "Cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600 animate-pulse">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <button
                onClick={() => navigate("/admin")}
                className="mb-4 flex items-center gap-2 text-pink-600 font-medium
                           bg-pink-50 px-4 py-2 rounded-xl shadow-sm
                           hover:bg-pink-100 transition-all duration-300 w-fit"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
                <ShoppingCart className="h-10 w-10 mr-4 text-pink-500" />
                Order Management
              </h1>
              <p className="text-gray-600 text-lg">
                Track and manage all customer orders efficiently
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 lg:mt-0">
              <button
                onClick={fetchOrders}
                className="group flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <RefreshCw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                Refresh Orders
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-pink-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending Orders</p>
                  <p className="text-3xl font-bold">{pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Delivered</p>
                  <p className="text-3xl font-bold">{deliveredOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search orders by ID, name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-2xl animate-fade-in">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-pink-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {searchTerm || statusFilter !== "All" ? "No orders match your filters" : "No orders found"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || statusFilter !== "All"
                ? "Try adjusting your search or filter criteria."
                : "Orders will appear here once customers start placing them."
              }
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div className="flex items-center gap-4 mb-4 lg:mb-0">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                          {order.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            Order #{order._id.slice(-8)}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {order.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="font-medium text-sm">{order.status}</span>
                        </div>
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Link>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 my-6"></div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-center gap-2 mb-3">
                          <Package className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700 font-medium">
                            {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {order?.items?.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="flex-shrink-0">
                              <img
                                src={item.image || "https://via.placeholder.com/60x60.png?text=No+Image"}
                                alt={item.name}
                                className="h-16 w-16 rounded-xl object-cover border-2 border-gray-200 shadow-sm hover:border-pink-300 transition-colors duration-300"
                              />
                            </div>
                          ))}
                          {order?.items?.length > 5 && (
                            <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-bold text-sm">+{order.items.length - 5}</span>
                            </div>
                          )}
                        </div>

                        {order.shippingAddress && (
                          <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{order.shippingAddress}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col lg:items-end gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-2xl font-bold text-pink-600">₹{order.total}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 font-medium">Update Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
