import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Pages/Home/Home";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Products from "./Pages/Product/products"; 
import ProductDetails from "./Pages/Product/productDetails";
import Cart from "./Pages/Cart/Cart"; 
import Order from "./Pages/Order/Order";
import Wishlist from "./Pages/Whishlist/Whishlist";
import Payment from "./Pages/Payment/Payment";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";


import Navbar from "./Components/Navbar";

import { CartProvider } from "./Context/cartContext";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem("isAuthenticated")) || false
  );

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <CartProvider>
      <div className="bg-[#fff8f6] font-sans min-h-screen">
        <Navbar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />

        <div className="pt-20">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />

            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route
              path="/payment"
              element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Payment />
             </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />

            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Register setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />

            <Route path="*" element={<Navigate to="/" />} />

            
          </Routes>
        </div>
      </div>
      <><Toaster position="top-center" reverseOrder={false} /></>
    </CartProvider>
  );
}
