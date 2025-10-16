import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

export default function VPAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeClasses: 0,
    systemAdmins: 0,
    formMasters: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    
    const admins = users.filter(u => u.role === 'Admin');
    const formMasters = users.filter(u => u.role === 'Form Master');

    setStats({
      totalUsers: users.length,
      activeClasses: Object.keys(classLists).length,
      systemAdmins: admins.length,
      formMasters: formMasters.length
    });
  };

  if (!user) {
    return <div className="p-4 text-large">Loading...</div>;
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Header - Large and Clear */}
      <div className="bg-orange-600 text-white p-6 mb-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">VP ADMIN DASHBOARD</h1>
        <p className="text-xl">Welcome, {user.name}</p>
      </div>

      {/* Quick Stats - Admin Focus */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">System Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-100 border-2 border-orange-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-orange-800">{stats.totalUsers}</div>
            <div className="text-lg text-orange-700">System Users</div>
          </div>
          <div className="bg-green-100 border-2 border-green-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-800">{stats.activeClasses}</div>
            <div className="text-lg text-green-700">Active Classes</div>
          </div>
          <div className="bg-red-100 border-2 border-red-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-800">{stats.systemAdmins}</div>
            <div className="text-lg text-red-700">Admin Users</div>
          </div>
          <div className="bg-blue-100 border-2 border-blue-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-800">{stats.formMasters}</div>
            <div className="text-lg text-blue-700">Form Masters</div>
          </div>
        </div>
      </div>

      {/* Admin Actions - View Only */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Administrative Oversight</h2>
        <div className="space-y-4">
          <button className="block w-full bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            👥 USER MANAGEMENT OVERVIEW
          </button>
          
          <button className="block w-full bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            🏫 CLASS STRUCTURE OVERVIEW
          </button>
          
          <button className="block w-full bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            📊 SYSTEM USAGE STATISTICS
          </button>
          
          <button className="block w-full bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            👨‍🏫 STAFF ROLE ASSIGNMENTS
          </button>
          
          <Link 
            to="/dashboard/exambank"
            className="block bg-white border-2 border-orange-500 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-orange-50 text-center"
          >
            📈 ACADEMIC PROGRESS MONITORING
          </Link>
          
          <button className="block w-full bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            📋 SYSTEM REPORTS
          </button>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="bg-orange-50 border-2 border-orange-400 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-orange-800 mb-2">VP Admin Responsibilities</h3>
        <ul className="text-lg text-orange-700 space-y-1">
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
