import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../tokenApi/setupAxios";
import toast from "react-hot-toast";

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
      const cartRes = await api.get(
        `/api/cart/${userId}`
      );
      const wishlistRes = await api.get(
        `/api/wishlist/${userId}`
      );

      setCart(cartRes.data.items || []);
      setWishlist(wishlistRes.data.items || []);
    } catch (err) {
      console.error("Failed loading data", err);
      if (err.response && err.response.status === 401) {
        // Token invalid, logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.setItem("isAuthenticated", "false");
        setUser(null);
        setCart([]);
        setWishlist([]);
        toast.error("Session expired. Please login again.", {
          duration: 3000,
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        });
      }
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      toast.error("Please login to add items to cart", {
        duration: 3000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
      return;
    }
    try {
      const res = await api.post(
        `/api/cart/${user._id}`,
        { product }
      );
      setCart(res.data);
      toast.success(`${product.name} added to cart! 🛒`, {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error("Failed to add item to cart", {
        duration: 3000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    }
  };

const removeFromCart = async (id) => {
  if (!user) return;
  try {
    const res = await api.delete(
      `/api/cart/${user._id}/${id}`
    );

    if (Array.isArray(res.data)) {
      setCart(res.data);
    } else if (res.data.products) { 
      setCart(res.data.products);
    } else {
      setCart((prev) => prev.filter((item) => item._id !== id));
    }

    toast.success("Item removed from cart! 🗑️");
  } catch (error) {
    console.error("Removal failed:", error);
    toast.error("Failed to remove item.");
  }
};

  const increaseQuantity = async (id) => {
    if (!user) return;
    const res = await api.post(
      `/api/cart/${user._id}`,
      { product: { _id: id } }
    );
    setCart(res.data);
  };

  const decreaseQuantity = async (id) => {
    if (!user) return;
    const res = await api.put(
      `/api/cart/${user._id}/decrease`,
      { productId: id }
    );
    setCart(res.data);
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      setCart([]);
      await api.delete(`/api/cart/${user._id}/all`);
      toast.success("Cart cleared successfully! 🗑️", {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
    } catch (error) {
     
      toast.error("Failed to clear cart. Please try again.", {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    }
  };

  const addToWishlist = async (product) => {
    if (!user) {
      toast.error("Please login to add items to wishlist", {
        duration: 3000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
      return;
    }

    const isAlreadyInWishlist = wishlist.some(
      (item) => item.productId === product._id || item._id === product._id
    );

    if (isAlreadyInWishlist) {
      toast.info(`${product.name} is already in your wishlist! ❤️`, {
        duration: 3000,
        style: {
          background: '#F59E0B',
          color: '#fff',
        },
      });
      return;
    }

    try {
      const res = await api.post(
        `/api/wishlist/${user._id}`,
        { product }
      );
      setWishlist(res.data);
      toast.success(`${product.name} added to wishlist! ❤️`, {
        duration: 3000,
        style: {
          background: '#EC4899',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error("Failed to add item to wishlist", {
        duration: 3000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    }
  };

  const removeFromWishlist = async (id) => {
    if (!user) return;
    const res = await api.delete(
      `/api/wishlist/${user._id}/${id}`
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
