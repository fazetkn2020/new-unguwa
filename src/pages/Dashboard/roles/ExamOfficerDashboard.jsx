import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

export default function ExamOfficerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    submissionsReceived: 0,
    pendingSubmissions: 0,
    examsProcessed: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load teachers count
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const teachers = users.filter(u => u.role === 'Subject Teacher');
    
    // Mock data for submissions (will be replaced with actual file system)
    const submissionsReceived = Math.floor(Math.random() * teachers.length);
    const pendingSubmissions = teachers.length - submissionsReceived;

    setStats({
      totalTeachers: teachers.length,
      submissionsReceived,
      pendingSubmissions,
      examsProcessed: 0 // Will track processed exams later
    });
  };

  if (!user) {
    return <div className="p-4 text-large">Loading...</div>;
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Header - Large and Clear */}
      <div className="bg-purple-600 text-white p-6 mb-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">EXAM OFFICER DASHBOARD</h1>
        <p className="text-xl">Welcome, {user.name}</p>
      </div>

      {/* Quick Stats - Simple Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Exam Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 border-2 border-blue-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-800">{stats.totalTeachers}</div>
            <div className="text-lg text-blue-700">Total Teachers</div>
          </div>
          <div className="bg-green-100 border-2 border-green-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-800">{stats.submissionsReceived}</div>
            <div className="text-lg text-green-700">Submissions Received</div>
          </div>
          <div className="bg-red-100 border-2 border-red-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-800">{stats.pendingSubmissions}</div>
            <div className="text-lg text-red-700">Pending Submissions</div>
          </div>
          <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-800">{stats.examsProcessed}</div>
            <div className="text-lg text-yellow-700">Exams Processed</div>
          </div>
        </div>
      </div>

      {/* Main Actions - Big Buttons */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Exam Management</h2>
        <div className="space-y-4">
          {/* Internal Exam Submissions - Placeholder */}
          <button className="block w-full bg-white border-2 border-purple-500 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-purple-50 text-center">
            📋 INTERNAL EXAM SUBMISSIONS
            <div className="text-sm text-gray-600 mt-1">
              View teacher test submissions (Placeholder)
            </div>
          </button>
          
          {/* Exam Bank - View Only */}
          <Link 
            to="/dashboard/exambank"
            className="block bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center"
          >
            📊 EXAM BANK (VIEW ONLY)
          </Link>
          
          {/* Report Sheet Generation - Placeholder */}
          <button className="block w-full bg-white border-2 border-green-500 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-green-50 text-center">
            🖨️ GENERATE REPORT SHEETS
            <div className="text-sm text-gray-600 mt-1">
              Print student report cards (Placeholder)
            </div>
          </button>
          
          {/* Teacher Activity - Placeholder */}
          <button className="block w-full bg-white border-2 border-blue-500 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-blue-50 text-center">
            👨‍🏫 TEACHER SUBMISSION ACTIVITY
            <div className="text-sm text-gray-600 mt-1">
              View submission status by teacher (Placeholder)
            </div>
          </button>
          
          {/* Exam Analytics - Placeholder */}
          <button className="block w-full bg-white border-2 border-orange-500 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-orange-50 text-center">
            📈 EXAM PERFORMANCE ANALYTICS
            <div className="text-sm text-gray-600 mt-1">
              View class/subject performance (Placeholder)
            </div>
          </button>
          
          {/* External Exams - Placeholder */}
          <button className="block w-full bg-white border-2 border-red-500 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-red-50 text-center">
            🎓 EXTERNAL EXAM COORDINATION
            <div className="text-sm text-gray-600 mt-1">
              WAEC/NECO coordination (Placeholder)
            </div>
          </button>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="bg-purple-50 border-2 border-purple-400 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-purple-800 mb-2">Exam Officer Responsibilities</h3>
        <ul className="text-lg text-purple-700 space-y-1">
          <li>• Collect test questions from teachers</li>
          <li>• Manage internal examination process</li>
          <li>• Generate student report sheets</li>
          <li>• Monitor teacher submission activity</li>
          <li>• Coordinate external examinations</li>
        </ul>
      </div>
    </div>
  );
}
