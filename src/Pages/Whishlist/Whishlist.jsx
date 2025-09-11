import React, { useContext } from "react";
import { CartContext } from "../../Context/cartContext";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useContext(CartContext);
  
 
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const handleMoveToCart = (item) => {
    if (!isAuthenticated) return;
    
    const cartItem = { ...item, quantity: 1 };
    addToCart(cartItem);
    removeFromWishlist(item.id);
  };

  const handleRemoveFromWishlist = (id) => {
    if (!isAuthenticated) return;
    removeFromWishlist(id);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-bold mb-8 text-pink-600 text-center animate-fade-in-up">
        Your Wishlist
      </h2>

      {!isAuthenticated ? (
        <div className="text-center py-10 animate-pulse">
          <p className="text-gray-600 text-lg mb-4">Please log in to view your wishlist.</p>
          <Link 
            to="/login" 
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-2 rounded-full font-medium shadow-md hover:scale-105 transform transition-all duration-300 inline-block"
          >
            Login Now
          </Link>
        </div>
      ) : wishlist && wishlist.length === 0 ? (
        <div className="text-center py-10 animate-pulse">
          <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up"
            >
              <div className="flex items-center gap-4 w-full sm:w-2/3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-md transform hover:scale-105 transition duration-300"
                />
                <div>
                  <span className="font-semibold text-lg">{item.name}</span>
                  <p className="text-pink-600 font-bold">${item.price}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-3 sm:mt-0">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-full font-medium shadow-md hover:scale-105 transform transition-all duration-300"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}