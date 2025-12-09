import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e) =>
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: (product.name || "").trim(),
        price: Number(product.price) || 0,
        description: product.description || "",
        image: product.image || "",
        category: product.category || "",
      };

      await axios.post("http://localhost:5001/api/products", payload);

      navigate("/admin/products");
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Chocolate Cake"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="500"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            name="image"
            value={product.image}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="https://example.com/cake.jpg"
          />
          {product.image ? (
            <img
              src={product.image}
              alt="preview"
              className="mt-3 h-40 w-full object-cover rounded"
            />
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="cakes, pastries, ..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={4}
            placeholder="Delicious chocolate cake with creamy frosting..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
        >
          {loading ? "Adding…" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
