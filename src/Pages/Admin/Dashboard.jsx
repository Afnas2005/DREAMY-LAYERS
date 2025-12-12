import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AdminProducts from "./Products/AdminProducts";
import AddProduct from "./Products/AddProduct";
import EditProduct from "./Products/EditProduct";
import DeleteProduct from "./Products/DeleteProduct";
import UsersList from "./Users/UsersList";
import UserDetails from "./Users/UserDetails";
import OrderDetails from "./OrderStatus/OrderDetails";
import AdminOrders from "./OrderStatus/AdminOrders";
import { 
  Layout, 
  Package, 
  Users, 
  Plus, 
  Settings, 
  LogOut, 
  ChevronRight,
  Home,
  BarChart3,
  ShoppingBag,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  ShoppingCart
} from "lucide-react";
import axios from "axios";

const BarChart = ({ data, color, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-sm font-semibold text-gray-600 mb-4">{title}</h3>
      <div className="flex items-end justify-between h-40">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-1">{item.value}</div>
            <div
              className="w-8 rounded-t-md transition-all duration-1000"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                background: `linear-gradient(to top, ${color}80, ${color})`
              }}
            ></div>
            <div className="text-xs text-gray-600 mt-2">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ value, max, color, title, icon }) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
      <h3 className="text-sm font-semibold text-gray-600 mb-4">{title}</h3>
      <div className="relative">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center text-gray-400 mb-1">{icon}</div>
            <div className="text-xl font-bold" style={{ color }}>{value}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LineChart = ({ data, color, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (item.value / maxValue) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-sm font-semibold text-gray-600 mb-4">{title}</h3>
      <div className="h-40 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
            className="transition-all duration-1000"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                className="transition-all duration-1000"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    ordersToday: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  const salesData = [
    { label: "Mon", value: 12 },
    { label: "Tue", value: 19 },
    { label: "Wed", value: 8 },
    { label: "Thu", value: 24 },
    { label: "Fri", value: 16 },
    { label: "Sat", value: 31 },
    { label: "Sun", value: 23 }
  ];

  const userGrowthData = [
    { label: "Jan", value: 2 },
    { label: "Feb", value: 3 },
    { label: "Mar", value: 4 },
    { label: "Apr", value: 5 },
    { label: "May", value: 6 },
    { label: "Jun", value: 9 }
  ];

  const productCategories = [
    { label: "Cakes", value: 8, color: "#EC4899" },
    { label: "Cookies", value: 5, color: "#8B5CF6" },
    { label: "Drinks", value: 3, color: "#3B82F6" },
    { label: "Other", value: 3, color: "#10B981" }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const productsResponse = await axios.get("http://localhost:5001/api/products");
        const totalProducts = productsResponse.data.length;
        
        const usersResponse = await axios.get("http://localhost:5001/api/users");
        const activeUsers = usersResponse.data.filter(user => user.active !== false);
        const totalUsers = activeUsers.length;
        
        const ordersToday = 23;
        const revenue = 1418;
        
        setStats({
          totalProducts,
          totalUsers,
          ordersToday,
          revenue
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <Layout className="h-5 w-5" /> },
    { path: "/admin/products", label: "Manage Products", icon: <Package className="h-5 w-5" /> },
    { path: "/admin/users", label: "Manage Users", icon: <Users className="h-5 w-5" /> },
    { path: "/admin/orders", label: "Manage Orders", icon: <ShoppingCart className="h-5 w-5" /> },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col">
      <div className="h-16 md:h-0"></div>
      
      <div className="flex flex-1 relative">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <aside className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gradient-to-b from-pink-600 to-purple-700 text-white 
          p-6 z-40 transform transition-all duration-300 ease-in-out overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'}
          md:sticky md:top-0 md:translate-x-0 md:w-64 md:flex-shrink-0 md:h-screen
        `}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Layout className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                Admin Panel
              </h2>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 mb-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 p-3 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'text-pink-100 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <div className={isActive ? "text-white" : "text-pink-200"}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mb-8">
            <h3 className="text-pink-200 text-sm font-semibold uppercase tracking-wider mb-3 pl-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/admin/products/add"
                onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-xl bg-white/10 text-pink-100 hover:bg-white/20 hover:text-white transition-all duration-300 group"
              >
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium">Add New Product</span>
              </Link>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-pink-500/30">
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-xl text-pink-100 hover:bg-white/10 hover:text-white transition-all duration-300 group"
              >
                <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">Back to Site</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 rounded-xl text-pink-100 hover:bg-white/10 hover:text-white transition-all duration-300 group w-full"
              >
                <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-lg sticky top-0 z-30">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-pink-100 text-pink-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
              A
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Routes>
              <Route index element={
                <div>
                  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                          Welcome back, Admin! 👋
                        </h1>
                        <p className="text-gray-600">
                          Manage your products and users with ease.
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <div className="bg-pink-100 p-3 rounded-xl">
                          <ShoppingBag className="h-6 w-6 text-pink-600" />
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl">
                          <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <Settings className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { 
                        title: "Total Products", 
                        value: loading ? "..." : stats.totalProducts.toString(), 
                        color: "#EC4899", 
                        icon: <Package className="h-6 w-6" /> 
                      },
                      { 
                        title: "Total Users", 
                        value: loading ? "..." : stats.totalUsers.toString(), 
                        color: "#8B5CF6", 
                        icon: <Users className="h-6 w-6" /> 
                      },
                      { 
                        title: "Orders Today", 
                        value: loading ? "..." : stats.ordersToday.toString(), 
                        color: "#3B82F6", 
                        icon: <ShoppingCart className="h-6 w-6" /> 
                      },
                      { 
                        title: "Revenue", 
                        value: loading ? "..." : `$${stats.revenue.toLocaleString()}`, 
                        color: "#10B981", 
                        icon: <DollarSign className="h-6 w-6" /> 
                      }
                    ].map((stat, index) => (
                      <div 
                        key={index}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-xl text-white`} style={{ backgroundColor: stat.color }}>
                            {stat.icon}
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-1000"
                              style={{ 
                                width: `${Math.random() * 70 + 30}%`,
                                backgroundColor: stat.color
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <BarChart 
                      data={salesData} 
                      color="#EC4899" 
                      title="Weekly Sales Performance" 
                    />
                    
                    <LineChart 
                      data={userGrowthData} 
                      color="#8B5CF6" 
                      title="User Growth (Last 6 Months)" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <DonutChart 
                      value={8}
                      max={19}
                      color="#EC4899"
                      title="Cakes"
                      icon={<Package className="h-4 w-4" />}
                    />
                    
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Avg. Order Value</h3>
                      <div className="text-2xl font-bold text-blue-600">$61.65</div>
                      <div className="flex items-center mt-2 text-green-500">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">+12.5%</span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Conversion Rate</h3>
                      <div className="text-2xl font-bold text-purple-600">4.2%</div>
                      <div className="flex items-center mt-2 text-green-500">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">+2.1%</span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Satisfaction</h3>
                      <div className="text-2xl font-bold text-green-600">94%</div>
                      <div className="text-sm text-gray-500 mt-2">Based on 42 reviews</div>
                    </div>
                  </div>
                </div>
              } />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:_id" element={<EditProduct />} />
              <Route path="products/delete/:_id" element={<DeleteProduct />} />
              <Route path="users" element={<UsersList />} />
              <Route path="users/:_id" element={<UserDetails />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:_id" element={<OrderDetails />} />

            </Routes>
          </main>
        </div>
      </div>

      <style >{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}