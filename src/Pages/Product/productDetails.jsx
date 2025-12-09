import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../Context/CartContext";
import { ArrowLeft } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart, addToWishlist } = useContext(CartContext);

useEffect(() => {
  axios.get(`http://localhost:5001/api/products/${id}`)
    .then(res => {
      setProduct(res.data);
    })
    .catch(() => setError("Product not found"))
    .finally(() => setLoading(false));
}, [id]);


  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-medium text-gray-600 animate-pulse">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-medium">{error}</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-pink-600 hover:underline mb-4"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow-lg animate-fade-in-up">
        <div className="md:w-1/2 flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-sm h-auto object-cover rounded-lg transform hover:scale-105 transition duration-500"
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-lg text-pink-600 font-bold mb-4">₹{product.price}</p>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              Category: {product.category || "N/A"}
            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => addToCart(product)}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 shadow-md transition transform hover:scale-105 w-full"
            >
              Add to Cart
            </button>
            <button
              onClick={() => addToWishlist(product)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 shadow-md transition transform hover:scale-105 w-full"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

