import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { ScoringQuickAccess, useTeachingAssignments } from "../../../components/scoring";

export default function VPAdminDashboard() {
  const { user } = useAuth();
  const teaching = useTeachingAssignments(user);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeClasses: 0,
    systemAdmins: 0,
    formMasters: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};

    const admins = users.filter((u) => u.role === "Admin");
    const formMasters = users.filter((u) => u.role === "Form Master");

    setStats({
      totalUsers: users.length,
      activeClasses: Object.keys(classLists).length,
      systemAdmins: admins.length,
      formMasters: formMasters.length,
    });
  };

  if (!user) {
    return <div className="p-4 text-lg">Loading...</div>;
  }

  return (
    <div className="p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 min-h-screen text-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 mb-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2 tracking-wide">
          VP ADMIN DASHBOARD
        </h1>
        <p className="text-xl font-medium text-yellow-300">
          Welcome, {user.name}
        </p>
      </div>

      {/* 🆕 TEACHING ASSIGNMENTS - Conditionally shown */}
      {teaching.hasTeachingAssignments && (
        <div className="mb-8">
          <ScoringQuickAccess 
            teaching={teaching}
            onExpand={() => {/* Optional: could expand in-place */}}
          />
        </div>
      )}

      {/* Stats Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-yellow-300">
          System Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-800/40 border border-blue-500 p-4 rounded-lg text-center shadow hover:bg-blue-700/40 transition">
            <div className="text-3xl font-bold text-yellow-300">
              {stats.totalUsers}
            </div>
            <div className="text-lg text-gray-200">System Users</div>
          </div>
          <div className="bg-emerald-800/40 border border-emerald-500 p-4 rounded-lg text-center shadow hover:bg-emerald-700/40 transition">
            <div className="text-3xl font-bold text-yellow-300">
              {stats.activeClasses}
            </div>
            <div className="text-lg text-gray-200">Active Classes</div>
          </div>
          <div className="bg-rose-800/40 border border-rose-500 p-4 rounded-lg text-center shadow hover:bg-rose-700/40 transition">
            <div className="text-3xl font-bold text-yellow-300">
              {stats.systemAdmins}
            </div>
            <div className="text-lg text-gray-200">Admin Users</div>
          </div>
          <div className="bg-indigo-800/40 border border-indigo-500 p-4 rounded-lg text-center shadow hover:bg-indigo-700/40 transition">
            <div className="text-3xl font-bold text-yellow-300">
              {stats.formMasters}
            </div>
            <div className="text-lg text-gray-200">Form Masters</div>
          </div>
        </div>
      </div>

      {/* Oversight Actions */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-yellow-300">
          Administrative Oversight
        </h2>
        <div className="space-y-4">
          {[
            "👥 USER MANAGEMENT OVERVIEW",
            "🏫 CLASS STRUCTURE OVERVIEW",
            "📊 SYSTEM USAGE STATISTICS",
            "👨‍🏫 STAFF ROLE ASSIGNMENTS",
            "📋 SYSTEM REPORTS",
          ].map((title, i) => (
            <button
              key={i}
              className="block w-full bg-blue-800/40 border border-blue-600 p-4 rounded-lg text-lg font-semibold text-gray-100 hover:bg-blue-700/40 transition shadow"
            >
              {title}
            </button>
          ))}

          <Link
            to="/dashboard/exambank"
            className="block bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 border border-yellow-300 p-4 rounded-lg text-lg font-semibold text-center hover:from-yellow-500 hover:to-yellow-400 transition shadow"
          >
            📈 ACADEMIC PROGRESS MONITORING
          </Link>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-800/40 border border-blue-600 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-yellow-300 mb-3">
          VP Admin Responsibilities
        </h3>
        <ul className="text-lg text-gray-200 space-y-2">
          <li>• Oversee system user management and roles</li>
          <li>• Monitor class structure and student enrollment</li>
          <li>• Track system usage and performance</li>
          <li>• Review staff role assignments and coverage</li>
          <li>• Ensure administrative systems are functional</li>
        </ul>
      </div>
    </div>
  );
}