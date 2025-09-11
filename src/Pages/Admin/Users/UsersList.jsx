import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Users, 
  Eye, 
  Ban, 
  Unlock, 
  Trash2, 
  RefreshCw, 
  Search,
  User,
  Mail,
  Shield,
  UserCheck,
  UserX
} from "lucide-react";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (id, blocked) => {
    try {
      await axios.patch(`http://localhost:3001/users/${id}`, {
        blocked: !blocked,
      });
      fetchUsers();
    } catch (err) {
      console.error("Error blocking/unblocking user:", err);
    }
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;
    
    try {
      await axios.patch(`http://localhost:3001/users/${id}`, {
        active: false,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error soft deleting user:", error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" ||
                         (filterStatus === "active" && user.active && !user.blocked) ||
                         (filterStatus === "blocked" && user.blocked) ||
                         (filterStatus === "inactive" && !user.active);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-pink-100 p-3 rounded-xl mr-4">
            <Users className="h-8 w-8 text-pink-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Manage Users</h2>
            <p className="text-gray-600 mt-2">
              {users.length} user{users.length !== 1 ? 's' : ''} in the system
            </p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent appearance-none bg-white transition-all duration-300"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No users found
          </h3>
          <p className="text-gray-600">
            {searchQuery || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "No users in the system yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${
                user.blocked 
                  ? "border-l-4 border-red-500" 
                  : user.active === false 
                  ? "border-l-4 border-gray-400"
                  : "border-l-4 border-green-500"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className={`p-3 rounded-xl mr-4 ${
                    user.blocked 
                      ? "bg-red-100 text-red-600" 
                      : user.active === false 
                      ? "bg-gray-100 text-gray-600"
                      : "bg-green-100 text-green-600"
                  }`}>
                    {user.blocked ? (
                      <Ban className="h-6 w-6" />
                    ) : user.active === false ? (
                      <UserX className="h-6 w-6" />
                    ) : (
                      <UserCheck className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                      {user.name}
                      {!user.active && (
                        <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                          Inactive
                        </span>
                      )}
                      {user.blocked && (
                        <span className="ml-2 bg-red-200 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                          Blocked
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </p>
                    {user.phone && (
                      <p className="text-gray-500 text-sm mt-1">
                        Phone: {user.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/admin/users/${user.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 group/view"
                  >
                    <Eye className="h-4 w-4 group-hover/view:scale-110 transition-transform duration-200" />
                    View Details
                  </Link>
                  <button
                    onClick={() => toggleBlock(user.id, user.blocked)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-colors duration-200 group/block ${
                      user.blocked 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }`}
                  >
                    {user.blocked ? (
                      <>
                        <Unlock className="h-4 w-4 group-hover/block:scale-110 transition-transform duration-200" />
                        Unblock
                      </>
                    ) : (
                      <>
                        <Ban className="h-4 w-4 group-hover/block:scale-110 transition-transform duration-200" />
                        Block
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleSoftDelete(user.id)}
                    disabled={user.active === false}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 group/delete"
                  >
                    <Trash2 className="h-4 w-4 group-hover/delete:scale-110 transition-transform duration-200" />
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}