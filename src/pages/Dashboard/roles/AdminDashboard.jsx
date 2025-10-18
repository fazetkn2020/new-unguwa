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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950 p-4 sm:p-6">
        <div className="bg-red-900/30 border border-red-500/40 text-red-300 p-4 sm:p-6 rounded-xl shadow-lg backdrop-blur-md max-w-md w-full mx-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">Access Denied</h2>
          <p className="text-center">Administrator privileges required to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950 p-4 sm:p-6 lg:p-8 text-gray-100">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-cyan-700 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10 shadow-2xl border border-blue-500/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-white mb-2 text-center sm:text-left">
              Admin Control Center
            </h1>
            <p className="text-slate-200 text-sm sm:text-base text-center sm:text-left">
              Manage users, roles, assignments, and system settings with full control.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg text-slate-100 text-sm border border-slate-500/30 text-center sm:text-left">
            👋 Welcome, <span className="font-semibold text-cyan-300 block sm:inline">{user?.name}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Mobile Scrollable */}
      <div className="flex overflow-x-auto gap-2 mb-6 sm:mb-8 border-b border-slate-700/50 pb-3 scrollbar-hide">
        {[
          { key: "users", label: "👥 Users", fullLabel: "👥 User Management" },
          { key: "assignments", label: "📚 Assign", fullLabel: "📚 Teacher Assignments" },
          { key: "roles", label: "🧩 Roles", fullLabel: "🧩 Role Management" },
          { key: "settings", label: "⚙️ Settings", fullLabel: "⚙️ System Settings" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-3 sm:px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 min-h-[44px] touch-target ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg border border-blue-400/50"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            <span className="sm:hidden">{tab.label}</span>
            <span className="hidden sm:inline">{tab.fullLabel}</span>
          </button>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-700/40 shadow-xl p-4 sm:p-6 backdrop-blur-md transition-all duration-300">
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

      {/* Mobile Helper Text */}
      <div className="lg:hidden mt-6 text-center">
        <p className="text-slate-400 text-sm">
          💡 Tip: Scroll horizontally to see all tabs
        </p>
      </div>
    </div>
  );
}