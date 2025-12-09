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
import ProtectedRoute from "./Components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Navbar from "./Components/Navbar";
import { CartProvider } from "./Context/CartContext";

// Admin pages
import AdminDashboard from "./Pages/Admin/Dashboard";
import AdminProducts from "./Pages/Admin/Products/AdminProducts";
import AddProduct from "./Pages/Admin/Products/AddProduct";
import EditProduct from "./Pages/Admin/Products/EditProduct";
import DeleteProduct from "./Pages/Admin/Products/DeleteProduct";
import UsersList from "./Pages/Admin/Users/UsersList";
import UserDetails from "./Pages/Admin/Users/UserDetails";
import AdminOrders from "./Pages/Admin/OrderStatus/AdminOrders";
import OrderDetails from "./Pages/Admin/OrderStatus/OrderDetails";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem("isAuthenticated")) || false
  );

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = isAuthenticated && user?.role === "admin";

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <CartProvider>
      <div className="bg-[#fff8f6] font-sans min-h-screen">
        {!isAdmin && (
          <Navbar
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
          />
        )}

        <div className={isAdmin ? "" : "pt-20"}>
          <Routes>
            {!isAdmin ? (
              <>
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

                {/* FIX HERE */}
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
                      <Navigate to={isAdmin ? "/admin" : "/"} />
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
              </>
            ) : (
              <Route path="*" element={<Navigate to="/admin" />} />
            )}

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
            />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<OrderDetails />} />


            {/* Add real edit route */}
            <Route
              path="/admin/products/edit/:id"
              element={isAdmin ? <EditProduct /> : <Navigate to="/login" />}
            />

            {/* fallback */}
            <Route path="*" element={<Navigate to={isAdmin ? "/admin" : "/"} />} />
          </Routes>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </CartProvider>
  );
}
