
import React, { createContext, useContext, useState, useEffect } from "react";

const cartContext = createContext();

export const useCart = () => useContext(cartContext);

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
      loadUserData(storedUser);
    }
  }, []);

 
  const loadUserData = (user) => {
    const storedCart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
    const storedWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.email}`)) || [];
    const storedOrders = JSON.parse(localStorage.getItem(`orders_${user.email}`)) || [];
    setCart(storedCart);
    setWishlist(storedWishlist);
    setOrders(storedOrders);
  };

  useEffect(() => {
    if (user) localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
  }, [cart, user]);

  useEffect(() => {
    if (user) localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(wishlist));
  }, [wishlist, user]);

  useEffect(() => {
    if (user) localStorage.setItem(`orders_${user.email}`, JSON.stringify(orders));
  }, [orders, user]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((p) => p.id !== id));
  const increaseQuantity = (id) => setCart((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)));
  const decreaseQuantity = (id) => setCart((prev) => prev.map((p) => (p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p)));

  const addToWishlist = (product) => setWishlist((prev) => (prev.find((p) => p.id === product.id) ? prev : [...prev, product]));
  const removeFromWishlist = (id) => setWishlist((prev) => prev.filter((p) => p.id !== id));

  const addOrder = (orderItems) => {
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: orderItems,
      total: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
    
    setOrders(prev => [...prev, newOrder]);
    setCart([]); 
  };

  const resetCartAndWishlist = () => {
    setCart([]);
    setWishlist([]);
  };

  const setCurrentUser = (newUser) => {
    setUser(newUser);
    if (newUser) {
      loadUserData(newUser); 
    } else {
      resetCartAndWishlist();
      setOrders([]);
    }
  };

  return (
    <cartContext.Provider
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
        addOrder, 
        resetCartAndWishlist,
        setCurrentUser,
        user,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

export { cartContext };