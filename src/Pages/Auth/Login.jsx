import React, { useState, useContext } from "react";
import { Cake, Eye, EyeOff, Sparkles, Heart, Lock, Mail } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../Context/CartContext";

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setForgotMsg("");

    try {
      // 🔑 Check login against db.json (users + admins)
      const res = await axios.get(
        `http://localhost:3001/users?email=${form.email}&password=${form.password}`
      );

      if (res.data.length > 0) {
        const user = res.data[0];

        // ✅ If role = admin → admin dashboard
        if (user.role === "admin") {
          setSubmitted(true);
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify(user));
          setCurrentUser(user);

          setTimeout(() => navigate("/admin"), 1000);
          return;
        }

        // ✅ Normal user
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
      const res = await axios.get(
        `http://localhost:3001/users?email=${forgotEmail}`
      );
      if (res.data.length > 0) {
        setForgotMsg(
          "✅ Password reset link has been sent to your email (mock)."
        );
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
            {forgotMode
              ? "We'll help you reset your password"
              : "Sign in to continue to your account"}
          </p>
        </div>

        {!forgotMode ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 mt-8 animate-fade-in-up delay-200"
          >
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
                <span>{error}</span>
              </div>
            )}

            {submitted && (
              <div className="animate-fade-in bg-green-50 text-green-600 p-3 rounded-xl border border-green-200 flex items-center">
                <span>✅ Login successful! Redirecting...</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl py-4 font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 group"
            >
              <span className="relative z-10 flex items-center justify-center">
                Log in
              </span>
            </button>

            <div className="flex justify-between text-sm mt-4">
              <button
                type="button"
                onClick={() => setForgotMode(true)}
                className="text-pink-600 hover:text-pink-800 transition-colors duration-200 flex items-center"
              >
                Forgot password?
              </button>
              <Link
                to="/register"
                className="text-purple-600 hover:text-purple-800 transition-colors duration-200 flex items-center"
              >
                Create account
              </Link>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleForgotSubmit}
            className="space-y-6 mt-8 animate-fade-in-up delay-200"
          >
            <div className="relative">
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
              <div className="animate-fade-in p-3 rounded-xl border flex items-center">
                <span>{forgotMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl py-4 font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 group"
            >
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="w-full text-gray-600 hover:text-gray-800 mt-2 transition-colors duration-200 flex items-center justify-center py-3 rounded-xl border border-gray-200 hover:border-gray-300"
            >
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
