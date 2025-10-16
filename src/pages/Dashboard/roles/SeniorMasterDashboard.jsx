import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

export default function SeniorMasterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    pendingDuties: 0
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
      u.role === 'Subject Teacher' || u.role === 'Form Master'
    );

    setStats({
      totalStudents,
      totalTeachers: teachers.length,
      totalClasses: Object.keys(classLists).length,
      pendingDuties: 0 // Can be calculated from duty roster later
    });
  };

  if (!user) {
    return <div className="p-4 text-large">Loading...</div>;
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Header - Large and Clear */}
      <div className="bg-green-600 text-white p-6 mb-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">SENIOR MASTER DASHBOARD</h1>
        <p className="text-xl">Welcome, {user.name}</p>
      </div>

      {/* Quick Stats - Simple Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">School Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 border-2 border-blue-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-800">{stats.totalStudents}</div>
            <div className="text-lg text-blue-700">Total Students</div>
          </div>
          <div className="bg-purple-100 border-2 border-purple-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-800">{stats.totalTeachers}</div>
            <div className="text-lg text-purple-700">Total Teachers</div>
          </div>
          <div className="bg-orange-100 border-2 border-orange-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-orange-800">{stats.totalClasses}</div>
            <div className="text-lg text-orange-700">Active Classes</div>
          </div>
          <div className="bg-red-100 border-2 border-red-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-800">{stats.pendingDuties}</div>
            <div className="text-lg text-red-700">Pending Duties</div>
          </div>
        </div>
      </div>

      {/* Main Actions - Big Buttons */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Management Actions</h2>
        <div className="space-y-4">
          {/* Duty Roster - Create/Edit */}
          <Link 
            to="/dashboard/duty-roster"
            className="block bg-white border-2 border-green-500 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-green-50 text-center"
          >
            🕐 DUTY ROSTER MANAGEMENT
          </Link>
          
          {/* Timetable - Create/Edit */}
          <Link 
            to="/dashboard/timetable"
            className="block bg-white border-2 border-blue-500 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-blue-50 text-center"
          >
            📅 SCHOOL TIMETABLE
          </Link>
          
          {/* Exam Bank - View Only */}
          <Link 
            to="/dashboard/exambank"
            className="block bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center"
          >
            📊 EXAM BANK (VIEW ONLY)
          </Link>
          
          {/* Students List - View Only */}
          <button className="block w-full bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            👨‍🎓 STUDENTS LIST (VIEW)
          </button>
          
          {/* Teachers List - View Only */}
          <button className="block w-full bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            👨‍🏫 TEACHERS LIST (VIEW)
          </button>
          
          {/* E-Library - Add/Remove PDFs */}
          <Link 
            to="/dashboard/elibrary"
            className="block bg-white border-2 border-purple-500 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-purple-50 text-center"
          >
            📚 E-LIBRARY (MANAGE PDFs)
          </Link>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-yellow-800 mb-2">Senior Master Responsibilities</h3>
        <ul className="text-lg text-yellow-700 space-y-1">
          <li>• Create and manage duty roster</li>
          <li>• Maintain school timetable</li>
          <li>• Monitor exam records (view only)</li>
          <li>• Manage e-library books</li>
          <li>• Oversee student and teacher lists</li>
        </ul>
      </div>
    </div>
  );
}
