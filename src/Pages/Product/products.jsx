import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../../Context/cartContext";
import { useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart, addToWishlist, searchQuery, setSearchQuery } =
    useContext(CartContext);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((res) => {
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product?.name
      ?.toLowerCase()
      .includes((searchQuery || "").toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      (product?.category &&
        product.category.toLowerCase() === selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const suggestions =
    searchQuery.length > 0
      ? products.filter((p) =>
          p?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-medium text-gray-600 animate-pulse">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-medium">{error}</div>
    );
  }

  const categories = ["All", "Cake", "Cookies", "Brownies", "Cup Cake", "Drinks"];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 animate-fade-in-up">
        Products
      </h2>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute w-full bg-white border rounded-lg shadow-md mt-1 z-10 max-h-60 overflow-y-auto animate-fade-in-up">
            {suggestions.map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  setSearchQuery(item.name);
                  setShowSuggestions(false);
                }}
                className="p-2 cursor-pointer hover:bg-pink-100 transition-colors duration-200"
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white transform scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-600 animate-fade-in">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-xl shadow-lg group hover:shadow-2xl hover:scale-105 transition-transform duration-300 animate-fade-in-up"
            >
              <img
                src={product.image}
                alt={product.name || "Product"}
                onClick={() => navigate(`/products/${product.id}`)}
                className="w-full h-52 object-cover rounded-lg mb-4 cursor-pointer transform group-hover:rotate-2 transition duration-500"
              />
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-lg font-bold text-pink-600 mb-2">₹{product.price}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 shadow-md transition transform hover:scale-105"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => addToWishlist(product)}
                  className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 shadow-md transition transform hover:scale-105"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default Products;

