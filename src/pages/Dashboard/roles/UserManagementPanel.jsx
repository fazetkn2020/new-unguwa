// src/pages/Dashboard/roles/UserManagementPanel.jsx - COMPLETE FIXED VERSION
import React, { useState } from "react";

// ✅ Make sure this is a function declaration or const with proper export
function UserManagementPanel({ users, onUsersUpdate }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingUsers = users.filter(user => user.role === "pending" || user.status === "pending");
  const activeUsers = users.filter(user => user.role !== "pending" && user.status !== "pending");

  const deleteUser = (userEmail) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter(user => user.email !== userEmail);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      onUsersUpdate();
      alert("User deleted successfully");
    }
  };

  const toggleUserStatus = (userEmail) => {
    const updatedUsers = users.map(user =>
      user.email === userEmail
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    onUsersUpdate();
  };

  const approveUser = (userEmail) => {
    const updatedUsers = users.map(user =>
      user.email === userEmail 
        ? { ...user, role: "Subject Teacher", status: "active" } // Default role for new users
        : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    onUsersUpdate();
    alert("User approved and assigned default role!");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">User Management</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Pending Users Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4 text-orange-600">
          Pending Approval ({pendingUsers.length})
        </h4>
        {pendingUsers.length > 0 ? (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <table className="min-w-full">
              <thead className="bg-orange-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="border-b border-orange-100">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => approveUser(user.email)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => deleteUser(user.email)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No pending registrations</p>
        )}
      </div>

      {/* Active Users Section */}
      <div className="overflow-x-auto">
        <h4 className="text-lg font-semibold mb-4 text-green-600">
          Active Users ({activeUsers.length})
        </h4>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === "admin" 
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {user.status || "active"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => toggleUserStatus(user.email)}
                    className={`mr-3 ${
                      user.status === "active" 
                        ? "text-orange-600 hover:text-orange-900" 
                        : "text-green-600 hover:text-green-900"
                    }`}
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteUser(user.email)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {activeUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No active users found
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ CRITICAL: This default export must be present
export default UserManagementPanel;