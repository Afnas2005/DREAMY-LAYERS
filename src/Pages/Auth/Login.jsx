import React, { useState, useContext } from "react";
import { Cake, Eye, EyeOff, Sparkles, Heart, Lock, Mail } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../Context/cartContext";

export default function Login({ setIsAuthenticated }) {
  const { setCurrentUser } = useContext(CartContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setForgotMsg("");

    try {
      const res = await axios.get(
        `http://localhost:3001/users?email=${form.email}&password=${form.password}`
      );

      if (res.data.length > 0) {
        const user = res.data[0];
        setSubmitted(true);
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);

        setTimeout(() => navigate("/"), 1000);
      } else {
        setError("Invalid email or password!");
      }
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMsg("");

    try {
      const res = await axios.get(`http://localhost:3001/users?email=${forgotEmail}`);
      if (res.data.length > 0) {
        setForgotMsg("✅ Password reset link has been sent to your email (mock).");
      } else {
        setForgotMsg("❌ No account found with this email.");
      }
    } catch (err) {
      setForgotMsg("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 p-4 md:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
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
              <Sparkles className="w-5 h-5 text-yellow-400 opacity-50" />
            ) : (
              <Cake className="w-7 h-7 text-purple-300 opacity-40" />
            )}
          </div>
        ))}
      </div>

      <div className="max-w-md w-full p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-pink-200/50 border border-pink-100 relative z-10 transform transition-all duration-700 hover:shadow-2xl hover:shadow-pink-300/60">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute -inset-3 bg-pink-400/20 blur-lg rounded-full opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-full shadow-lg animate-bounce-slow">
              <Cake className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
            {forgotMode ? "Forgot Password 🔑" : "Welcome Back 🍰"}
          </h2>
          <p className="mt-2 text-sm text-gray-500 animate-fade-in-up delay-100">
            {forgotMode ? "We'll help you reset your password" : "Sign in to continue to your account"}
          </p>
        </div>

        {!forgotMode ? (
          <form onSubmit={handleSubmit} className="space-y-6 mt-8 animate-fade-in-up delay-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-pink-500" />
              </div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/80 shadow-sm focus:shadow-md focus:shadow-pink-100"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-pink-500" />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/80 shadow-sm focus:shadow-md focus:shadow-pink-100"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-600 hover:text-pink-800 transition-colors duration-200 p-1 rounded-full hover:bg-pink-100"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="animate-shake bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {submitted && (
              <div className="animate-fade-in bg-green-50 text-green-600 p-3 rounded-xl border border-green-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>✅ Login successful! Redirecting...</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl py-4 font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 group"
            >
              <span className="relative z-10 flex items-center justify-center">
                Log in
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              <div className="absolute inset-0 h-full w-full scale-x-[2.0] blur-lg transition-all duration-500 group-hover:scale-0 group-hover:opacity-0 group-hover:blur-xl bg-white/30"></div>
            </button>

            <div className="flex justify-between text-sm mt-4">
              <button
                type="button"
                onClick={() => setForgotMode(true)}
                className="text-pink-600 hover:text-pink-800 transition-colors duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Forgot password?
              </button>
              <Link to="/register" className="text-purple-600 hover:text-purple-800 transition-colors duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create account
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-6 mt-8 animate-fade-in-up delay-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-pink-500" />
              </div>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/80 shadow-sm focus:shadow-md focus:shadow-pink-100"
                placeholder="Enter your registered email"
                required
              />
            </div>
            
            {forgotMsg && (
              <div className={`animate-fade-in p-3 rounded-xl border flex items-center ${
                forgotMsg.includes("✅") 
                  ? "bg-green-50 text-green-600 border-green-200" 
                  : "bg-red-50 text-red-600 border-red-200"
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${forgotMsg.includes("✅") ? "text-green-500" : "text-red-500"}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d={forgotMsg.includes("✅") 
                    ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    : "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"} 
                    clipRule="evenodd" />
                </svg>
                <span>{forgotMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl py-4 font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 group"
            >
              <span className="relative z-10 flex items-center justify-center">
                Send Reset Link
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <div className="absolute inset-0 h-full w-full scale-x-[2.0] blur-lg transition-all duration-500 group-hover:scale-0 group-hover:opacity-0 group-hover:blur-xl bg-white/30"></div>
            </button>
            
            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="w-full text-gray-600 hover:text-gray-800 mt-2 transition-colors duration-200 flex items-center justify-center py-3 rounded-xl border border-gray-200 hover:border-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Login
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  );
}