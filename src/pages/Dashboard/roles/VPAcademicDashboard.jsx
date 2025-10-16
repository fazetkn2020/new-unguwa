import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

export default function VPAcademicDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    classesWithScores: 0,
    subjectsCovered: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const examData = JSON.parse(localStorage.getItem('examData')) || {};
    
    const teachers = users.filter(u => u.role === 'Subject Teacher');
    
    // Calculate classes with some scores entered
    let classesWithScores = 0;
    Object.keys(classLists).forEach(className => {
      const classStudents = classLists[className];
      const hasScores = classStudents.some(student => {
        const studentId = `${className}_${student.fullName.replace(/\s+/g, '_')}`;
        return examData[studentId] && Object.keys(examData[studentId]).length > 0;
      });
      if (hasScores) classesWithScores++;
    });

    setStats({
      totalStudents: Object.values(classLists).reduce((sum, students) => sum + students.length, 0),
      totalTeachers: teachers.length,
      classesWithScores,
      subjectsCovered: 0 // Simplified for now
    });
  };

  if (!user) {
    return <div className="p-4 text-large">Loading...</div>;
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Header - Large and Clear */}
      <div className="bg-indigo-600 text-white p-6 mb-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">VP ACADEMIC DASHBOARD</h1>
        <p className="text-xl">Welcome, {user.name}</p>
      </div>

      {/* Quick Stats - Academic Focus */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Academic Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 border-2 border-blue-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-800">{stats.totalStudents}</div>
            <div className="text-lg text-blue-700">Total Students</div>
          </div>
          <div className="bg-green-100 border-2 border-green-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-800">{stats.totalTeachers}</div>
            <div className="text-lg text-green-700">Academic Staff</div>
          </div>
          <div className="bg-purple-100 border-2 border-purple-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-800">{stats.classesWithScores}</div>
            <div className="text-lg text-purple-700">Active Classes</div>
          </div>
          <div className="bg-teal-100 border-2 border-teal-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-teal-800">{stats.subjectsCovered}</div>
            <div className="text-lg text-teal-700">Subjects Active</div>
          </div>
        </div>
      </div>

      {/* Academic Actions - View Only */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Academic Monitoring</h2>
        <div className="space-y-4">
          <Link 
            to="/dashboard/exambank"
            className="block bg-white border-2 border-indigo-500 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-indigo-50 text-center"
          >
            📊 EXAM RESULTS OVERVIEW
          </Link>
          
          <button className="block w-full bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            👨‍🏫 TEACHER SUBJECT ASSIGNMENTS
          </button>
          
          <button className="block w-full bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            📚 SUBJECT PERFORMANCE TRACKING
          </button>
          
          <button className="block w-full bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            🎓 CLASS ACADEMIC PROGRESS
          </button>
          
          <button className="block w-full bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            📈 PERFORMANCE ANALYTICS
          </button>
          
          <button className="block w-full bg-white border-2 border-gray-400 p-4 rounded-lg text-xl font-semibold text-gray-800 hover:bg-gray-50 text-center">
            📋 CURRICULUM COVERAGE
          </button>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="bg-indigo-50 border-2 border-indigo-400 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-indigo-800 mb-2">VP Academic Responsibilities</h3>
        <ul className="text-lg text-indigo-700 space-y-1">
          <li>• Monitor academic performance across all classes</li>
          <li>• Oversee teacher subject assignments</li>
          <li>• Track curriculum coverage and completion</li>
          <li>• Analyze subject and class performance trends</li>
          <li>• Ensure academic standards are maintained</li>
        </ul>
      </div>
    </div>
  );
}
