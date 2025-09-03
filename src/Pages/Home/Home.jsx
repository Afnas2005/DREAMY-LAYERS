import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Cake, IceCream2, Truck, Heart, ShoppingCart, Star, ArrowRight, Plus, ChevronRight, Clock, Shield, Award, Users, Smile } from "lucide-react";
import Footer from "../../Components/Footer";
import { CartContext } from "../../Context/cartContext";

const Home = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [cakes, setCakes] = useState([]);
  const [products, setProducts] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const { cart, addToCart, clearCart } = useContext(CartContext);

  useEffect(() => {
    axios.get("http://localhost:3001/cakes").then((res) => setCakes(res.data));
    axios.get("http://localhost:3001/products").then((res) => setProducts(res.data));
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBuy = () => {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.top = '0';
    confetti.style.left = '0';
    confetti.style.width = '100%';
    confetti.style.height = '100%';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    document.body.appendChild(confetti);
    
    for (let i = 0; i < 150; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '10px';
      particle.style.height = '10px';
      particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
      particle.style.borderRadius = '50%';
      particle.style.top = '50%';
      particle.style.left = '50%';
      particle.style.opacity = '0';
      confetti.appendChild(particle);
      
      const animation = particle.animate([
        { 
          opacity: 1, 
          transform: 'translate(-50%, -50%) scale(1)',
          top: '50%',
          left: `${50 + Math.random() * 10 - 5}%`
        },
        { 
          opacity: 0, 
          transform: `translate(${Math.random() * 100 - 50}vw, ${Math.random() * 100 + 50}vh) scale(0)`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`
        }
      ], {
        duration: 2000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
      });
      
      animation.onfinish = () => {
        particle.remove();
      };
    }
    
    setTimeout(() => {
      confetti.remove();
    }, 3000);
    
    alert("🎉 Order placed successfully!");
    clearCart();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };

  const features = [
    {
      icon: <Award className="h-10 w-10 text-pink-500" />,
      title: "Premium Quality",
      description: "We use only the finest ingredients to create our delicious cakes and pastries."
    },
    {
      icon: <Clock className="h-10 w-10 text-pink-500" />,
      title: "Fresh Daily",
      description: "All our products are baked fresh daily to ensure maximum flavor and quality."
    },
    {
      icon: <Truck className="h-10 w-10 text-pink-500" />,
      title: "Fast Delivery",
      description: "Free delivery on all orders with quick and reliable service to your doorstep."
    },
    {
      icon: <Shield className="h-10 w-10 text-pink-500" />,
      title: "100% Satisfaction",
      description: "We guarantee your satisfaction with our quality products and services."
    }
  ];

  const stats = [
    { number: "5000+", label: "Happy Customers", icon: <Users className="h-6 w-6" /> },
    { number: "1000+", label: "Cakes Sold", icon: <Cake className="h-6 w-6" /> },
    { number: "50+", label: "Varieties", icon: <Star className="h-6 w-6" /> },
    { number: "24/7", label: "Support", icon: <Smile className="h-6 w-6" /> }
  ];

  return (
    <div className="bg-gradient-to-b from-pink-50 to-amber-50 font-sans overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          >
            {i % 3 === 0 ? (
              <Heart className="w-6 h-6 text-pink-300 opacity-60" />
            ) : i % 3 === 1 ? (
              <Star className="w-5 h-5 text-yellow-400 opacity-50" />
            ) : (
              <Cake className="w-7 h-7 text-purple-300 opacity-40" />
            )}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-center justify-between relative z-10">
        <div className="md:w-1/2 text-center md:text-left relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-pink-600 shadow-lg mb-6 animate-pulse border border-pink-200">
            <span className="h-2 w-2 rounded-full bg-pink-500 mr-2 animate-ping"></span>
            <span className="text-sm font-medium">Freshly Baked With Love</span>
          </div>
          
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-pink-900 drop-shadow-xl animate-slide-in-left mb-6"
            style={{ fontFamily: '"Fredoka One", cursive', lineHeight: "1.1" }}
          >
            Delicious <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Cakes</span>, <br /> 
            Delivered to You.
          </h1>
          
          <p className="text-gray-600 text-lg mt-6 mb-8 max-w-md mx-auto md:mx-0 animate-fade-in leading-relaxed">
            Celebrate every occasion with our mouth-watering cakes, baked fresh daily with the finest ingredients and a whole lot of love.
          </p>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
            >
              <span className="relative z-10 flex items-center">
                Logout
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </span>
              <div className="absolute inset-0 h-full w-full scale-x-[2.0] blur-lg transition-all duration-500 group-hover:scale-0 group-hover:opacity-0 group-hover:blur-xl bg-white/30"></div>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up delay-300">
              <Link
                to="/register"
                className="group relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg text-center"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Create Account
                  <Plus className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:rotate-90" />
                </span>
                <div className="absolute inset-0 h-full w-full scale-x-[2.0] blur-lg transition-all duration-500 group-hover:scale-0 group-hover:opacity-0 group-hover:blur-xl bg-white/30"></div>
              </Link>
              
              <Link
                to="/login"
                className="group border-2 border-pink-400 bg-white/80 text-pink-600 px-8 py-4 rounded-full hover:bg-pink-50 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg text-center"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Sign In
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          )}
        </div>

        <div className="md:w-1/2 relative mt-20 md:mt-0 animate-fade-in-right">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <div className="w-[380px] h-[380px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-tr from-pink-200 to-pink-300 animate-pulse" />
          </div>
          <div className="relative z-10 mx-auto w-[320px] md:w-[420px] transform transition-all duration-700 hover:rotate-2 hover:scale-105">
            <img
              src="https://i.pinimg.com/736x/3a/27/5f/3a275f4d77ceb12019ef5d7058fa8dd8.jpg"
              alt="Hero Cake"
              className="rounded-full shadow-2xl animate-float-slow border-8 border-white"
            />
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl p-3 animate-bounce-slow">
              <div className="flex items-center">
                <div className="bg-pink-100 p-2 rounded-full mr-2">
                  <Truck className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Free Delivery</p>
                  <p className="text-xs text-gray-500">On all orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 px-6 md:px-12 bg-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-pink-200 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-purple-200 opacity-20 blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">About Dreamy Layers</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Welcome to Dreamy Layers, where we transform simple ingredients into extraordinary experiences. 
              Since 2015, we've been crafting beautiful, delicious cakes that make every celebration special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <img
                src="https://i.pinimg.com/1200x/b9/33/72/b93372e16f8c31b088155f09cd01d4c3.jpg"
                alt="Bakery Shop"
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition duration-700"
              />
            </div>
            
            <div className="animate-fade-in-right">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Story</h3>
              <p className="text-gray-600 mb-6">
                Founded by master pastry chef Emma Richardson, Dreamy Layers started as a small home bakery 
                and has grown into a beloved local institution. Our passion for creating beautiful, 
                flavorful cakes has remained unchanged throughout our journey.
              </p>
              <p className="text-gray-600 mb-8">
                We believe that every cake tells a story, and we're honored to be part of your special moments - 
                from birthdays and weddings to simple Tuesday celebrations.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-pink-50 rounded-xl animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex justify-center mb-2 text-pink-500">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-pink-600">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-pink-50 to-amber-50 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-amber-200 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-pink-200 opacity-20 blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Dreamy Layers?</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We're committed to excellence in every aspect of our service. Here's what sets us apart from the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 text-center mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Promise to You</h2>
            <p className="text-gray-600 text-lg mb-8">
              At Dreamy Layers, we're not just selling cakes - we're creating memories. 
              We promise to deliver exceptional quality, outstanding service, and unforgettable flavors 
              that will make your celebrations truly special.
            </p>
            
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition duration-700">
              <h3 className="text-2xl font-bold mb-4">Visit Our Bakery</h3>
              <p className="mb-6">Come experience the magic in person at our cozy bakery location:</p>
              <p className="font-semibold">Malappuram , kakkanchery , kinfra</p>
              <p className="mb-4">Open: Monday-Saturday, 8AM-8PM</p>
              <p className="text-pink-200">Phone: +91 6235004189</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;