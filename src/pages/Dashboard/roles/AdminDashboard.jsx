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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950 p-4">
        <div className="w-full max-w-md mx-4 bg-red-900/30 border border-red-500/40 text-red-300 p-5 rounded-2xl shadow-lg backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Access Denied
          </h2>
          <p className="text-center text-sm">
            Administrator privileges required to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950 p-4 sm:p-6 lg:p-8 text-gray-100">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-cyan-700 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 shadow-2xl border border-blue-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-1 text-center sm:text-left">
              Admin Control Center
            </h1>
            <p className="text-slate-200 text-sm sm:text-base text-center sm:text-left max-w-2xl">
              Manage users, roles, teacher assignments, and system settings.
            </p>
          </div>

          <div className="mt-2 sm:mt-0 inline-flex items-center gap-3 bg-white/6 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-500/20">
            <div className="text-sm text-slate-200">👋</div>
            <div className="text-sm text-slate-100">
              <span className="font-semibold text-cyan-300">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Mobile Scrollable */}
      <div className="flex overflow-x-auto gap-2 mb-6 border-b border-slate-700/40 pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 scrollbar-hide">
        {[
          { key: "users", label: "👥 Users", fullLabel: "User Management" },
          { key: "assignments", label: "📚Teacher  Assign", fullLabel: "Teacher Assignments" },
          { key: "roles", label: "🧩 Roles", fullLabel: "Role Management" },
          { key: "settings", label: "⚙️ Settings", fullLabel: "System Settings" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-4 py-2 sm:px-5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 min-h-[44px] ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md border border-blue-400/50"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
            aria-pressed={activeTab === tab.key}
          >
            <span className="sm:hidden">{tab.label}</span>
            <span className="hidden sm:inline">{tab.fullLabel}</span>
          </button>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="bg-slate-900/70 rounded-2xl border border-slate-700/30 shadow-xl p-3 sm:p-5 backdrop-blur-sm transition-all duration-300">
        <div className="w-full">
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

      {/* Mobile Helper Text */}
      <div className="lg:hidden mt-6 text-center">
        <p className="text-slate-400 text-sm">
          💡 Tip: Swipe tabs to switch sections
        </p>
      </div>

      <div className="lg:hidden mt-6 text-center">
        <p className="text-slate-400 text-sm">
          💡 Tip: Scroll horizontally to see all tabs
        </p>
      </div>
    </div>
  );
}
