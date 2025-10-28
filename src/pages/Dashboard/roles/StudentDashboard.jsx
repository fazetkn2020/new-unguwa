import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ParentMessage from './ParentMessage';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState('attendance');
  const [scores, setScores] = useState({});
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = () => {
    // Load student scores
    const examData = JSON.parse(localStorage.getItem('examData')) || {};
    const studentScores = examData[user.id] || {};
    setScores(studentScores);

    // Load attendance
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = JSON.parse(localStorage.getItem(`attendance_${today}`)) || {};
    setAttendance(todayAttendance);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'attendance':
        return <StudentAttendance studentId={user.id} />;
      case 'scores':
        return <StudentScores studentId={user.id} scores={scores} />;
      case 'reports':
        return <StudentReports student={user} />;
      case 'message':
        return <ParentMessage />;
      default:
        return <StudentAttendance studentId={user.id} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {Object.keys(scores).length}
            </div>
            <div className="text-sm text-gray-600">Subjects with Scores</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {attendance[user.id]?.status === 'present' ? 'Present' : '--'}
            </div>
            <div className="text-sm text-gray-600">Today's Status</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {user.assignedClasses?.[0] || 'Not Assigned'}
            </div>
            <div className="text-sm text-gray-600">Class</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {new Date().getFullYear()}
            </div>
            <div className="text-sm text-gray-600">Academic Year</div>
          </div>
        </div>
      </div>

      {/* Module Navigation - UPDATED: No assignments */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'attendance', label: 'My Attendance', icon: '✅' },
            { id: 'scores', label: 'My Scores', icon: '📊' },
            { id: 'reports', label: 'Progress Reports', icon: '📋' },
            { id: 'message', label: 'Message Principal', icon: '📝' }
          ].map(module => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`flex-1 min-w-0 px-4 py-3 text-center whitespace-nowrap ${
                activeModule === module.id
                  ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="block text-lg mb-1">{module.icon}</span>
              <span className="text-sm">{module.label}</span>
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {renderModule()}
        </div>
      </div>
    </div>
  );
}

// Student sub-components (removed assignments)
const StudentAttendance = ({ studentId }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">My Attendance</h3>
    <p className="text-gray-600">Attendance records and weekly summaries.</p>
    {/* Would integrate with existing attendance system */}
  </div>
);

const StudentScores = ({ studentId, scores }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">My Scores</h3>
    {Object.keys(scores).length === 0 ? (
      <p className="text-gray-500">No scores available yet.</p>
    ) : (
      <div className="space-y-3">
        {Object.entries(scores).map(([subject, data]) => (
          <div key={subject} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="font-medium">{subject}</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              CA: {data.ca} | Exam: {data.exam} | Total: {data.total}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const StudentReports = ({ student }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Progress Reports</h3>
    <p className="text-gray-600">View and download your academic progress reports.</p>
    {/* Would integrate with existing report system */}
  </div>
);
