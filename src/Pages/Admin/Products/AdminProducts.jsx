import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../tokenApi/setupAxios";
import toast from "react-hot-toast";
import { Edit3, Trash2, Plus, Package, RefreshCw, Search, Filter, Star, TrendingUp, Eye, DollarSign } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to load products", e);
      setError("Failed to load products. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/api/products/${id}`);
      await fetchProducts();
      toast.success("Product deleted successfully! 🗑️", {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
    } catch (e) {
      console.error("Delete failed", e);
      toast.error("Failed to delete product. Please try again.", {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    }
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const avgPrice = products.length > 0 ? (totalValue / products.length).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600 animate-pulse">Loading your delicious products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
                <Package className="h-10 w-10 mr-4 text-pink-500" />
                Product Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your bakery's delicious offerings with style
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 lg:mt-0">
              <Link
                to="/admin/products/add"
                className="group flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add New Product
              </Link>
              <button
                onClick={fetchProducts}
                className="group flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <RefreshCw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-pink-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Categories</p>
                  <p className="text-3xl font-bold">{categories.length - 1}</p>
                </div>
                <Filter className="h-8 w-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Avg Price</p>
                  <p className="text-3xl font-bold">₹{avgPrice}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Value</p>
                  <p className="text-3xl font-bold">₹{totalValue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 flex items-center animate-fade-in">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span>{error}</span>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-2xl animate-fade-in">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-pink-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {searchTerm || selectedCategory !== "All" ? "No products match your filters" : "No products found"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first delicious product to your bakery."
              }
            </p>
            <Link
              to="/admin/products/add"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Plus className="h-6 w-6 mr-3" />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || "https://via.placeholder.com/400x300.png?text=No+Image"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-bold text-pink-600 shadow-lg">
                      {product.category || "Uncategorized"}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Eye className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="absolute bottom-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ₹{product.price}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description || "A delicious treat made with love and care."}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500 ml-2">(4.8)</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}