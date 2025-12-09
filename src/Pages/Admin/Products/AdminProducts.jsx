import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Edit3, Trash2, Plus, Package, RefreshCw } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5001/api/products");
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
      await axios.delete(`http://localhost:5001/api/products/${id}`);
      await fetchProducts();
    } catch (e) {
      console.error("Delete failed", e);
      alert("Delete failed. See console for details.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <Package className="h-8 w-8 mr-3 text-pink-500" />
            Manage Products
          </h2>
          <p className="text-gray-600 mt-2">
            {products.length} product{products.length !== 1 ? "s" : ""} in your store
          </p>
        </div>
        <Link
          to="/admin/products/add"
          className="mt-4 md:mt-0 group flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Add New Product
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 flex items-center">
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

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-pink-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first product.
          </p>
          <Link
            to="/admin/products/add"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={
                    p.image ||
                    "https://via.placeholder.com/300x200.png?text=No+Image"

                  }
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-semibold text-gray-800 shadow-sm">
                  {p.category || "Uncategorized"}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-pink-600">
                    ₹{p.price}
                  </span>
                  {p.stock !== undefined && (
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        p.stock > 10
                          ? "bg-green-100 text-green-800"
                          : p.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                 <Link to={`/admin/products/edit/${p._id}`} 


                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 group/edit"
                  >
                    <Edit3 className="h-4 w-4 group-hover/edit:scale-110 transition-transform duration-200" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 group/delete"
                  >
                    <Trash2 className="h-4 w-4 group-hover/delete:scale-110 transition-transform duration-200" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}