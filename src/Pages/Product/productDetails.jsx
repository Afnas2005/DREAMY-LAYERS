import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../Context/CartContext";
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield, RefreshCw } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  const { addToCart, addToWishlist } = useContext(CartContext);

  useEffect(() => {
    axios.get(`http://localhost:5001/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
      })
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleAddToWishlist = async () => {
    await addToWishlist(product);
    setAddedToWishlist(true);
    setTimeout(() => setAddedToWishlist(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600 animate-pulse">Loading delicious details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🍰</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition duration-300 shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6 transition duration-300"
        >
          <ArrowLeft size={20} /> Back to Products
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Product Image Section */}
            <div className="md:w-1/2 p-8 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-w-md h-auto object-cover rounded-2xl shadow-lg transform hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  ★ 4.8
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="md:w-1/2 p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(128 reviews)</span>
                </div>
                <p className="text-3xl font-bold text-pink-600 mb-4">₹{product.price}</p>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">{product.description}</p>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Product Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Category:</span>
                      <span className="ml-2 text-gray-800">{product.category || "Dessert"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Freshness:</span>
                      <span className="ml-2 text-green-600">Guaranteed</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Delivery:</span>
                      <span className="ml-2 text-gray-800">Free</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Stock:</span>
                      <span className="ml-2 text-green-600">In Stock</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center gap-3 ${
                    addedToCart
                      ? "bg-green-500 text-white"
                      : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                  }`}
                >
                  <ShoppingCart size={20} />
                  {addedToCart ? "Added to Cart! ✓" : "Add to Cart"}
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center gap-3 ${
                    addedToWishlist
                      ? "bg-red-500 text-white"
                      : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
                  }`}
                >
                  <Heart size={20} className={addedToWishlist ? "fill-current" : ""} />
                  {addedToWishlist ? "Added to Wishlist! ♥" : "Add to Wishlist"}
                </button>
              </div>

              {/* Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Truck className="text-blue-500" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-800">Free Delivery</h4>
                    <p className="text-sm text-gray-600">On orders over ₹500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <Shield className="text-green-500" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-800">Quality Assured</h4>
                    <p className="text-sm text-gray-600">100% fresh ingredients</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                  <RefreshCw className="text-purple-500" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-800">Easy Returns</h4>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Our {product.name}?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Premium Ingredients</h3>
              <p className="text-gray-600">Made with the finest quality ingredients, ensuring every bite is a delightful experience.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Handcrafted with Love</h3>
              <p className="text-gray-600">Each item is carefully prepared by our expert bakers with attention to detail and passion.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Fresh & Hygienic</h3>
              <p className="text-gray-600">Prepared fresh daily in a hygienic environment, maintaining the highest standards.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Perfect for Any Occasion</h3>
              <p className="text-gray-600">Whether it's a birthday, anniversary, or just a sweet craving, we've got you covered.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

