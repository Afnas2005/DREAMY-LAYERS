import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  Heart,
  ShoppingCart,
  Cake,
  ChevronDown,
} from "lucide-react";

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const {
    cart = [],
    wishlist = [],
    searchQuery = "",
    setSearchQuery = () => {},
    resetCartAndWishlist,
  } = useContext(CartContext) || {};

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserDropdownOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserDropdownOpen && !event.target.closest(".user-dropdown")) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserDropdownOpen]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    resetCartAndWishlist();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsUserDropdownOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-xl py-2"
            : "bg-gradient-to-r from-pink-400 via-pink-300 to-pink-200 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-white/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-full shadow-lg">
                  <Cake className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1
                className={`text-2xl font-extrabold drop-shadow-lg transition-all duration-300 ${
                  isScrolled ? "text-pink-600" : "text-white"
                }`}
              >
                DREAMY LAYERS
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`relative group px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:text-pink-600"
                    : "text-white hover:text-pink-100"
                }`}
              >
                Home
                <span
                  className={`absolute left-1/2 -bottom-1 w-0 h-0.5 bg-pink-500 group-hover:w-4/5 transition-all duration-300 group-hover:left-1/10 ${
                    location.pathname === "/" ? "w-4/5 left-1/10" : ""
                  }`}
                ></span>
              </Link>

              <Link
                to="/products"
                className={`relative group px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:text-pink-600"
                    : "text-white hover:text-pink-100"
                }`}
              >
                Products
                <span
                  className={`absolute left-1/2 -bottom-1 w-0 h-0.5 bg-pink-500 group-hover:w-4/5 transition-all duration-300 group-hover:left-1/10 ${
                    location.pathname === "/products" ? "w-4/5 left-1/10" : ""
                  }`}
                ></span>
              </Link>

              <Link
                to="/cart"
                className={`relative group px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-1 ${
                  isScrolled
                    ? "text-gray-700 hover:text-pink-600"
                    : "text-white hover:text-pink-100"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({cart?.length || 0})</span>
                {cart?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {cart.length}
                  </span>
                )}
              </Link>

              <Link
                to="/wishlist"
                className={`relative group px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-1 ${
                  isScrolled
                    ? "text-gray-700 hover:text-pink-600"
                    : "text-white hover:text-pink-100"
                }`}
              >
                <Heart className="h-5 w-5" />
                <span>Wishlist ({wishlist?.length || 0})</span>
                {wishlist?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/order"
                className={`relative group px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:text-pink-600"
                    : "text-white hover:text-pink-100"
                }`}
              >
                Orders
                <span
                  className={`absolute left-1/2 -bottom-1 w-0 h-0.5 bg-pink-500 group-hover:w-4/5 transition-all duration-300 group-hover:left-1/10 ${
                    location.pathname === "/order" ? "w-4/5 left-1/10" : ""
                  }`}
                ></span>
              </Link>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                {isSearchOpen && (
                  <div className="absolute right-0 top-12 bg-white rounded-xl shadow-2xl p-2 w-64 animate-fade-in">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* User */}
              {isAuthenticated ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <User className="h-5 w-5" />
                    <span>{userData.name || "User"}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isUserDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 animate-fade-in border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {userData.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {userData.email || ""}
                        </p>
                      </div>

                      {/* Show Admin Dashboard only for admin */}
                      {userData.role === "admin" && (
                        <Link
                          to="/admin"
                          className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-200"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <span>🛠 Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="group flex items-center space-x-2 bg-white text-pink-600 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-pink-200"
                  >
                    <User className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Login</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Buttons */}
            <div className="md:hidden flex items-center space-x-3">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isScrolled
                    ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {isSearchOpen && (
            <div className="md:hidden mt-4 animate-fade-in">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-sm"
              />
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-6 pb-4 animate-fade-in-up">
              <div className="grid grid-cols-1 gap-2">
                <Link
                  to="/"
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                    isScrolled
                      ? "bg-pink-50 text-pink-600"
                      : "bg-white/20 text-white"
                  } ${location.pathname === "/" ? "bg-pink-500 text-white" : ""}`}
                >
                  <span>Home</span>
                </Link>

                <Link
                  to="/products"
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                    isScrolled
                      ? "bg-pink-50 text-pink-600"
                      : "bg-white/20 text-white"
                  } ${
                    location.pathname === "/products"
                      ? "bg-pink-500 text-white"
                      : ""
                  }`}
                >
                  <span>Products</span>
                </Link>

                <Link
                  to="/cart"
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-between ${
                    isScrolled
                      ? "bg-pink-50 text-pink-600"
                      : "bg-white/20 text-white"
                  } ${location.pathname === "/cart" ? "bg-pink-500 text-white" : ""}`}
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart</span>
                  </div>
                  <span className="bg-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {cart?.length || 0}
                  </span>
                </Link>

                <Link
                  to="/wishlist"
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-between ${
                    isScrolled
                      ? "bg-pink-50 text-pink-600"
                      : "bg-white/20 text-white"
                  } ${
                    location.pathname === "/wishlist"
                      ? "bg-pink-500 text-white"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </div>
                  <span className="bg-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {wishlist?.length || 0}
                  </span>
                </Link>

                <Link
                  to="/order"
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                    isScrolled
                      ? "bg-pink-50 text-pink-600"
                      : "bg-white/20 text-white"
                  } ${location.pathname === "/order" ? "bg-pink-500 text-white" : ""}`}
                >
                  <span>Orders</span>
                </Link>

                <div className="border-t border-white/20 pt-4 mt-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 bg-white/10 rounded-xl mb-3">
                        <p className="text-sm font-medium text-white">
                          {userData.name || "User"}
                        </p>
                        <p className="text-xs text-white/80 truncate">
                          {userData.email || ""}
                        </p>
                      </div>

                      {/* Mobile Admin Dashboard */}
                      {userData.role === "admin" && (
                        <Link
                          to="/admin"
                          className="w-full flex items-center justify-center space-x-2 bg-pink-600 text-white px-4 py-3 rounded-xl shadow-lg transition-all duration-300 mb-3"
                        >
                          <span>🛠 Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 bg-pink-500 text-white px-4 py-3 rounded-xl shadow-lg transition-all duration-300"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/login"
                        className="flex items-center justify-center space-x-2 bg-white text-pink-600 px-4 py-3 rounded-xl shadow-lg transition-all duration-300"
                      >
                        <User className="h-5 w-5" />
                        <span>Login</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-20 md:h-24"></div>

      <style >{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
