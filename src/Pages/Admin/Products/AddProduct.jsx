import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Package, DollarSign, Image, Tag, FileText, Sparkles, Check } from "lucide-react";

export default function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      const payload = {
        name: (product.name || "").trim(),
        price: Number(product.price) || 0,
        description: product.description || "",
        image: product.image || "",
        category: product.category || "",
      };

      await axios.post("http://localhost:5001/api/products", payload);

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600">Create something amazing for your customers</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Success Banner */}
          {success && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 flex items-center justify-center gap-2 text-white animate-pulse">
              <Check className="w-5 h-5" />
              <span className="font-semibold">Product added successfully! Redirecting...</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-4 m-6 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Package className="w-4 h-4 text-purple-500" />
                  Product Name
                </label>
                <input
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  placeholder="Chocolate Cake"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 pl-8 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                    placeholder="500"
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="w-4 h-4 text-blue-500" />
                  Category
                </label>
                <input
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  placeholder="cakes, pastries, ..."
                />
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Image className="w-4 h-4 text-pink-500" />
                  Image URL
                </label>
                <input
                  name="image"
                  value={product.image}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all outline-none"
                  placeholder="https://example.com/cake.jpg"
                />
                {product.image && (
                  <div className="mt-4 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg">
                    <img
                      src={product.image}
                      alt="preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none"
                  rows={4}
                  placeholder="Delicious chocolate cake with creamy frosting..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding Product...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Product Added!
                  </span>
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Tip */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💡 Tip: Use high-quality images for better customer engagement</p>
        </div>
      </div>
    </div>
  );
}