import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import UserManagementPanel from "./UserManagementPanel";
import RoleManagementPanel from "./RoleManagementPanel";
import SystemSettings from "./SystemSettings";
import TeacherAssignmentPanel from "./TeacherAssignmentPanel";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950 p-6">
        <div className="bg-red-900/30 border border-red-500/40 text-red-300 px-6 py-4 rounded-xl shadow-lg backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p>Administrator privileges required to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950 p-8 text-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-cyan-700 rounded-2xl p-8 mb-10 shadow-2xl border border-blue-500/40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-wide text-white mb-2">
              Admin Control Center
            </h1>
            <p className="text-slate-200 text-base">
              Manage users, roles, assignments, and system settings with full control.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-slate-100 text-sm border border-slate-500/30">
            👋 Welcome, <span className="font-semibold text-cyan-300">{user?.name}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-4 mb-8 border-b border-slate-700/50 pb-3">
        {[
          { key: "users", label: "👥 User Management" },
          { key: "assignments", label: "📚 Teacher Assignments" },
          { key: "roles", label: "🧩 Role Management" },
          { key: "settings", label: "⚙️ System Settings" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg border border-blue-400/50"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-700/40 shadow-xl p-6 backdrop-blur-md transition-all duration-300">
        {activeTab === "users" && (
          <UserManagementPanel users={users} onUsersUpdate={loadUsers} />
        )}
        {activeTab === "assignments" && (
          <TeacherAssignmentPanel users={users} onUsersUpdate={loadUsers} />
        )}
        {activeTab === "roles" && (
          <RoleManagementPanel users={users} onUsersUpdate={loadUsers} />
        )}
        {activeTab === "settings" && <SystemSettings />}
      </div>
    </div>
  );
}
