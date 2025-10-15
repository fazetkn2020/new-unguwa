// src/pages/Dashboard/roles/AdminDashboard.jsx - UPDATED
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import UserManagementPanel from "./UserManagementPanel";
import RoleManagementPanel from "./RoleManagementPanel"; // Now this exists!
import SystemSettings from "./SystemSettings";

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(savedUsers);
  };

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p>Administrator privileges required to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, roles, and system settings</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {["users", "roles", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === "users" && (
          <UserManagementPanel users={users} onUsersUpdate={loadUsers} />
        )}
        {activeTab === "roles" && (
          <RoleManagementPanel users={users} onUsersUpdate={loadUsers} />
        )}
        {activeTab === "settings" && <SystemSettings />}
      </div>
    </div>
  );
}