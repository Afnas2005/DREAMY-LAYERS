import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const isAuth = localStorage.getItem("isAuthenticated") === "true";

    if (storedUser && isAuth) {
      setUser(storedUser);
      loadFromDatabase(storedUser._id);
    }
  }, []);

  const loadFromDatabase = async (userId) => {
    try {
      const cartRes = await axios.get(
        `http://localhost:5001/api/cart/${userId}`
      );
      const wishlistRes = await axios.get(
        `http://localhost:5001/api/wishlist/${userId}`
      );

      setCart(cartRes.data.items || []);
      setWishlist(wishlistRes.data.items || []);
    } catch (err) {
      console.error("Failed loading data", err);
    }
  };

  const addToCart = async (product) => {
    if (!user) return;
    const res = await axios.post(
      `http://localhost:5001/api/cart/${user._id}`,
      { product }
    );
    setCart(res.data);
  };

  const removeFromCart = async (id) => {
    if (!user) return;
    const res = await axios.delete(
      `http://localhost:5001/api/cart/${user._id}/${id}`
    );
    setCart(res.data);
  };

  const increaseQuantity = async (id) => {
    if (!user) return;
    const res = await axios.post(
      `http://localhost:5001/api/cart/${user._id}`,
      { product: { _id: id } }
    );
    setCart(res.data);
  };

  const decreaseQuantity = async (id) => {
    if (!user) return;
    const res = await axios.put(
      `http://localhost:5001/api/cart/${user._id}/decrease`,
      { productId: id }
    );
    setCart(res.data);
  };

  const clearCart = async () => {
    if (!user) return;
    setCart([]);
    await axios.delete(`http://localhost:5001/api/cart/${user._id}/all`);
  };

  const addToWishlist = async (product) => {
    if (!user) return;
    const res = await axios.post(
      `http://localhost:5001/api/wishlist/${user._id}`,
      { product }
    );
    setWishlist(res.data);
  };

  const removeFromWishlist = async (id) => {
    if (!user) return;
    const res = await axios.delete(
      `http://localhost:5001/api/wishlist/${user._id}/${id}`
    );
    setWishlist(res.data);
  };

  const addOrder = (items) => {
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "Pending",
    };
    setOrders((prev) => [...prev, newOrder]);
    setCart([]);
  };

  const resetCartAndWishlist = () => {
    setCart([]);
    setWishlist([]);
  };

  const setCurrentUser = async (newUser) => {
    setUser(newUser);
    if (newUser) {
      loadFromDatabase(newUser._id);
    } else {
      resetCartAndWishlist();
      setOrders([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        searchQuery,
        setSearchQuery,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        addToWishlist,
        removeFromWishlist,
        clearCart,
        addOrder,
        resetCartAndWishlist,
        setCurrentUser,
        user,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
