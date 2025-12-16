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

  const linkBase =
    "px-3 text-sm font-semibold text-gray-900 hover:text-black transition-colors";

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-4 mb-3 hidden md:flex items-center justify-between">
            <div className="flex-1 flex justify-center">
              <div className="flex items-center bg-white rounded-full shadow-[0_6px_0_rgba(0,0,0,0.25)] px-4 py-2 space-x-6">
                <Link
                  to="/"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white mr-2"
                >
                  <Cake className="h-6 w-6" />
                </Link>

                <div className="flex items-center space-x-4">
                  <Link
                    to="/"
                    className={`${linkBase} ${
                      isActive("/") ? "underline underline-offset-4" : ""
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/products"
                    className={`${linkBase} ${
                      isActive("/products")
                        ? "underline underline-offset-4"
                        : ""
                    }`}
                  >
                    Products
                  </Link>
                  <Link
                    to="/cart"
                    className={`${linkBase} flex items-center gap-1`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Cart</span>
                    {cart?.length > 0 && (
                      <span className="ml-1 bg-black text-white text-[10px] rounded-full px-1.5 py-0.5">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/wishlist"
                    className={`${linkBase} flex items-center gap-1`}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Wishlist</span>
                    {wishlist?.length > 0 && (
                      <span className="ml-1 bg-black text-white text-[10px] rounded-full px-1.5 py-0.5">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/order"
                    className={`${linkBase} ${
                      isActive("/order") ? "underline underline-offset-4" : ""
                    }`}
                  >
                    Orders
                  </Link>
                </div>

                <div className="flex items-center space-x-3 ml-4">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <Search className="h-4 w-4 text-gray-700" />
                  </button>

                  {isAuthenticated ? (
                    <div className="relative user-dropdown">
                      <button
                        onClick={() =>
                          setIsUserDropdownOpen(!isUserDropdownOpen)
                        }
                        className="flex items-center space-x-2 bg-black text-white px-3 py-1.5 rounded-full text-xs font-semibold"
                      >
                        <User className="h-4 w-4" />
                        <span>{userData.name || "User"}</span>
                        <ChevronDown
                          className={`h-3 w-3 transition-transform ${
                            isUserDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isUserDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl py-2 border border-gray-100">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">
                              {userData.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {userData.email || ""}
                            </p>
                          </div>

                          {userData.role === "admin" && (
                            <Link
                              to="/admin"
                              className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              🛠 Admin Dashboard
                            </Link>
                          )}

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-full text-xs font-semibold"
                    >
                      <User className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isSearchOpen && (
            <div className="hidden md:block max-w-md mx-auto mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              />
            </div>
          )}

          <div className="md:hidden flex items-center justify-between py-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <Cake className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">DREAMY LAYERS</span>
            </Link>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full bg-white/80 text-gray-700"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full bg-white/80 text-gray-700"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {isSearchOpen && (
            <div className="md:hidden mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              />
            </div>
          )}

          {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="bg-white/95 rounded-2xl shadow-xl p-4 space-y-2">
                <Link
                  to="/"
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                    isActive("/") ? "bg-gray-100" : "text-gray-700"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                    isActive("/products") ? "bg-gray-100" : "text-gray-700"
                  }`}
                >
                  Products
                </Link>
                <Link
                  to="/cart"
                  className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm font-semibold ${
                    isActive("/cart") ? "bg-gray-100" : "text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                  </span>
                  <span className="bg-black text-white text-[10px] rounded-full px-2 py-0.5">
                    {cart?.length || 0}
                  </span>
                </Link>
                <Link
                  to="/wishlist"
                  className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm font-semibold ${
                    isActive("/wishlist") ? "bg-gray-100" : "text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </span>
                  <span className="bg-black text-white text-[10px] rounded-full px-2 py-0.5">
                    {wishlist?.length || 0}
                  </span>
                </Link>
                <Link
                  to="/order"
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                    isActive("/order") ? "bg-gray-100" : "text-gray-700"
                  }`}
                >
                  Orders
                </Link>

                <div className="pt-2 border-t border-gray-100 mt-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-2 py-2">
                        <p className="text-xs font-medium text-gray-900">
                          {userData.name || "User"}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                          {userData.email || ""}
                        </p>
                      </div>
                      {userData.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block w-full text-center text-xs font-semibold text-gray-700 px-3 py-2 rounded-lg bg-gray-100 mt-1"
                        >
                          🛠 Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-black text-white text-xs font-semibold px-3 py-2 rounded-lg"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="mt-2 w-full flex items-center justify-center gap-2 bg-black text-white text-xs font-semibold px-3 py-2 rounded-lg"
                    >
                      <User className="h-4 w-4" />
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="h-24" />
    </>
  );
}
