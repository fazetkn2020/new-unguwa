import React, { useState } from "react";

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
        ? { ...user, role: "Subject Teacher", status: "active" }
        : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    onUsersUpdate();
    alert("User approved and assigned default role!");
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h3 className="text-xl sm:text-2xl font-semibold text-blue-400">User Management</h3>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4 text-yellow-400">
          Pending Approval ({pendingUsers.length})
        </h4>
        {pendingUsers.length > 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => approveUser(user.email)}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => deleteUser(user.email)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-700"
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

      <div className="overflow-x-auto">
        <h4 className="text-lg font-semibold mb-4 text-green-400">
          Active Users ({activeUsers.length})
        </h4>
        <table className="min-w-full divide-y divide-gray-700 text-sm">
          <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {activeUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-semibold">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === "admin"
                      ? "bg-purple-700 text-purple-100"
                      : "bg-green-700 text-green-100"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.status === "active"
                      ? "bg-green-700 text-green-100"
                      : "bg-red-700 text-red-100"
                  }`}>
                    {user.status || "active"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs font-medium flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleUserStatus(user.email)}
                    className={`${
                      user.status === "active"
                        ? "text-yellow-400 hover:text-yellow-300"
                        : "text-green-400 hover:text-green-300"
                    }`}
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteUser(user.email)}
                    className="text-red-400 hover:text-red-300"
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

export default UserManagementPanel;
