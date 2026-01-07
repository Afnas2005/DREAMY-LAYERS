import React, { useEffect, useState } from "react";
import api from "../../../tokenApi/setupAxios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Image,
  Package,
  DollarSign,
  Tag,
  FileText,
  Edit,
  Check,
  Sparkles
} from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: ""
  });

  useEffect(() => {
    async function loadProduct() {
      setError("");
      setLoading(true);

      try {
        const res = await api.get(`/api/products/${id}`);
        const data = res.data;

        setProduct({
          name: data.name || "",
          price: data.price || "",
          description: data.description || "",
          image: data.image || "",
          category: data.category || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await api.put(`/api/products/${id}`, {
        ...product
      });

      toast.success("Product updated successfully! ✨", {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      console.error("Error updating product:", err);
      const errorMessage = "Update failed. Check console for details.";
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!loading && error && !product.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex justify-center items-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Oops!</h3>
          <p className="text-red-600 mb-6 font-medium">{error}</p>
          <button
            onClick={() => navigate("/admin/products")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all transform hover:scale-[1.02]"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/products")}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
              <Edit className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Edit Product
            </h1>
            <p className="text-gray-600">Update your product details</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {success && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 flex items-center justify-center gap-2 text-white animate-pulse">
              <Check className="w-5 h-5" />
              <span className="font-semibold">Product updated successfully! Redirecting...</span>
            </div>
          )}

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-4 m-6 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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
                  required
                />
              </div>

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
                    required
                  />
                </div>
              </div>

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
                  placeholder="Cakes, Pastries, Cookies..."
                />
              </div>

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
                  placeholder="https://…"
                  required
                />
                {product.image && (
                  <div className="mt-4 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg">
                    <img
                      src={product.image}
                      alt="preview"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200.png?text=No+Image";
                      }}
                    />
                  </div>
                )}
              </div>

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
                />
              </div>
            </div>

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
                disabled={saving || success}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving Changes...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Changes Saved!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Changes
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💡 Tip: Changes will be visible immediately after saving</p>
        </div>
      </div>
    </div>
  );
}