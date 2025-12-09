import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Image,
  Package,
  DollarSign,
  Tag,
  FileText,
  Edit
} from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
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

    try {
      await axios.put(`http://localhost:5001/api/products/${id}`, {
        ...product
      });

      navigate("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Update failed. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-20">
        <p className="text-red-600 mb-4 text-center font-semibold">
          {error}
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/admin/products")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center text-pink-600 hover:text-pink-700 mr-4 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Edit className="h-6 w-6 mr-2 text-pink-500" />
          Edit Product
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Package className="h-4 w-4 mr-2 text-pink-500" />
              Product Name
            </label>
            <input
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-pink-500" />
              Price
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Tag className="h-4 w-4 mr-2 text-pink-500" />
              Category
            </label>
            <input
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
              placeholder="Cakes, Pastries, Cookies..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Image className="h-4 w-4 mr-2 text-pink-500" />
              Image URL
            </label>
            <input
              name="image"
              value={product.image}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
              placeholder="https://…"
              required
            />
            {product.image && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <img
                  src={product.image}
                  alt="preview"
                  className="h-48 w-full object-cover rounded-xl border border-gray-200"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200.png?text=No+Image";
                  }}
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-pink-500" />
              Description
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
