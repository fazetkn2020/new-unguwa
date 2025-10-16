import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

export default function PrincipalDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    classesComplete: 0,
    pendingScores: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load students count
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    let totalStudents = 0;
    Object.values(classLists).forEach(students => {
      totalStudents += students.length;
    });

    // Load teachers count
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const teachers = users.filter(u => 
      u.role === 'Subject Teacher' || u.role === 'Form Master' || u.role === 'Principal' || u.role === 'VP'
    );

    setStats({
      totalStudents,
      totalTeachers: teachers.length,
      classesComplete: Object.keys(classLists).length,
      pendingScores: 0 // Simplified for now
    });
  };

  if (!user) {
    return <div className="p-4 text-large">Loading...</div>;
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Header - Large and Clear */}
      <div className="bg-blue-600 text-white p-6 mb-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">PRINCIPAL DASHBOARD</h1>
        <p className="text-xl">Welcome, {user.name}</p>
      </div>

      {/* Quick Stats - Simple Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">School Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-100 border-2 border-green-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-800">{stats.totalStudents}</div>
            <div className="text-lg text-green-700">Total Students</div>
          </div>
          <div className="bg-blue-100 border-2 border-blue-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-800">{stats.totalTeachers}</div>
            <div className="text-lg text-blue-700">Total Teachers</div>
          </div>
          <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-800">{stats.classesComplete}</div>
            <div className="text-lg text-yellow-700">Active Classes</div>
          </div>
          <div className="bg-red-100 border-2 border-red-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-800">{stats.pendingScores}</div>
            <div className="text-lg text-red-700">Pending Actions</div>
          </div>
        </div>
      </div>

      {/* Main Actions - Big Buttons */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Quick Actions</h2>
        <div className="space-y-4">
          <Link 
            to="/dashboard/exambank"
            className="block bg-white border-2 border-gray-300 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center"
          >
            VIEW EXAM SCORES
          </Link>
          
          <button className="block w-full bg-white border-2 border-gray-300 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            VIEW TEACHERS LIST
          </button>
          
          <button className="block w-full bg-white border-2 border-gray-300 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            VIEW FORM MASTERS
          </button>
          
          <button className="block w-full bg-white border-2 border-gray-300 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            E-LIBRARY BOOKS
          </button>
          
          <button className="block w-full bg-white border-2 border-gray-300 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            STAFF PERFORMANCE
          </button>
          
          <button className="block w-full bg-white border-2 border-gray-300 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            SYSTEM REPORTS
          </button>
        </div>
      </div>

      {/* Recent Activity - Simple List */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Activity</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-lg text-gray-700 mb-2">• Mathematics scores entered for SS1</div>
          <div className="text-lg text-gray-700 mb-2">• New student registered in SS2</div>
          <div className="text-lg text-gray-700">• Teacher assignments updated</div>
        </div>
      </div>
    </div>
  );
}
