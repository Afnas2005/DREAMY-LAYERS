import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../../Context/CartContext";
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
      .get("http://localhost:5001/api/products")
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
      <div className="min-h-screen flex items-center justify-center bg-[#fff4e4] text-center py-10 text-lg font-medium text-amber-700 animate-pulse">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff4e4] text-center py-10 text-red-500 font-medium">
        {error}
      </div>
    );
  }

  const categories = [
    "All",
    "Cake",
    "Cookies",
    "Brownies",
    "Cup Cake",
    "Drinks",
  ];

  return (
    <div >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ffe7c2,transparent_55%),radial-gradient(circle_at_bottom_right,#ffe0b3,transparent_55%)] opacity-80" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-3xl font-extrabold mb-6 text-amber-800 tracking-wide">
          Dessert Menu
        </h2>

        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search desserts..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full border border-amber-100 bg-white/95 text-sm text-amber-900 placeholder:text-amber-300 p-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute w-full bg-white border border-amber-100 rounded-3xl shadow-lg mt-2 z-10 max-h-60 overflow-y-auto">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  onClick={() => {
                    setSearchQuery(item.name);
                    setShowSuggestions(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-amber-50 text-sm"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-amber-500 text-white border-amber-500 shadow-amber-200 scale-105"
                  : "bg-white/95 text-amber-700 border-amber-100 hover:bg-amber-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-amber-600">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-[30px] shadow-md border border-amber-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="relative block overflow-hidden rounded-[30px_30px_0_0]"
                >
                  <img
                    src={product.image}
                    alt={product.name || "Product"}
                    className="w-full h-56 object-cover transform hover:scale-105 transition duration-500"
                  />
                </button>

                <div className="flex-1 px-5 pt-4 pb-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-amber-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-amber-400 leading-snug line-clamp-2 mb-3">
                      A delightful dessert made with love. Customize this text
                      later with real description.
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-semibold text-amber-900">
                      ₹{product.price}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => addToWishlist(product)}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-white border border-amber-200 text-amber-400 text-sm shadow-sm hover:bg-amber-50 hover:text-amber-500 transition-colors"
                      >
                        ♥
                      </button>

                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-white border border-amber-200 text-amber-500 text-sm shadow-sm hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      >
                        🛒
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product);
                          addToWishlist(product);
                        }}
                        className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-amber-400 text-white text-lg shadow hover:bg-amber-500 transition-colors"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Products;
