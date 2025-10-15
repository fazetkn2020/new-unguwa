// src/pages/Dashboard/roles/RoleManagementPanel.jsx - NEW FILE
import React, { useState } from "react";

export default function RoleManagementPanel({ users, onUsersUpdate }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [newRole, setNewRole] = useState("");

  const availableRoles = [
    "Principal",
    "VP Admin", 
    "VP Academic",
    "Form Master",
    "Subject Teacher",
    "Senior Master",
    "Exam Officer",
    "admin" // Only assignable through admin panel
  ];

  const handleAssignRole = () => {
    if (!selectedUser || !newRole) {
      alert("Please select both a user and a role");
      return;
    }

    const updatedUsers = users.map(user =>
      user.email === selectedUser ? { ...user, role: newRole } : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    onUsersUpdate();
    
    const userName = users.find(u => u.email === selectedUser)?.name;
    alert(`Successfully assigned ${newRole} role to ${userName}`);
    
    // Reset form
    setSelectedUser("");
    setNewRole("");
  };

  const selectedUserData = users.find(user => user.email === selectedUser);

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6">Role Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* User Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select User
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a user...</option>
            {users.map((user) => (
              <option key={user.email} value={user.email}>
                {user.name} ({user.email}) - Current: {user.role}
              </option>
            ))}
          </select>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Role
          </label>
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a role...</option>
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* User Preview */}
      {selectedUserData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-800 mb-2">User Preview</h4>
          <p><strong>Name:</strong> {selectedUserData.name}</p>
          <p><strong>Email:</strong> {selectedUserData.email}</p>
          <p><strong>Current Role:</strong> {selectedUserData.role}</p>
          <p><strong>Status:</strong> {selectedUserData.status || "active"}</p>
        </div>
      )}

      <button
        onClick={handleAssignRole}
        disabled={!selectedUser || !newRole}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Assign Role
      </button>

      {/* Role Statistics */}
      <div className="mt-8">
        <h4 className="font-semibold mb-4">Role Distribution</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableRoles.map(role => {
            const count = users.filter(user => user.role === role).length;
            return (
              <div key={role} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{role}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}