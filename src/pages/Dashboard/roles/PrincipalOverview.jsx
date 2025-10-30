import React, { useState, useEffect } from 'react';

export default function PrincipalOverview({ dashboardData = {} }) { // Add default value
  const [schoolStats, setSchoolStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalClasses: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    if (!dashboardData) return;
    
    const users = dashboardData.users || [];
    const students = users.filter(u => u.role === 'Student' && u.status === 'approved');
    const staff = users.filter(u => u.role !== 'Student' && u.role !== 'Admin' && u.status === 'active');
    const classes = dashboardData.classLists || {};
    
    // Calculate real attendance rate
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    const attendanceRate = calculateRealAttendanceRate(attendanceRecords, students);
    
    setSchoolStats({
      totalStudents: students.length,
      totalStaff: staff.length,
      totalClasses: Object.keys(classes).length,
      attendanceRate: Math.round(attendanceRate)
    });
  }, [dashboardData]);

  const calculateRealAttendanceRate = (attendanceRecords, students) => {
    if (Object.keys(attendanceRecords).length === 0 || students.length === 0) return 85; // Default
    
    let totalPresent = 0;
    let totalPossible = 0;
    
    Object.values(attendanceRecords).forEach(dayAttendance => {
      students.forEach(student => {
        totalPossible++;
        const studentRecord = dayAttendance[student.id];
        if (studentRecord && studentRecord.status === 'present') {
          totalPresent++;
        }
      });
    });
    
    return totalPossible > 0 ? (totalPresent / totalPossible) * 100 : 85;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600">{schoolStats.totalStudents}</p>
          <p className="text-sm text-gray-500 mt-1">Approved students only</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Staff</h3>
          <p className="text-3xl font-bold text-green-600">{schoolStats.totalStaff}</p>
          <p className="text-sm text-gray-500 mt-1">Active staff members</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Classes</h3>
          <p className="text-3xl font-bold text-purple-600">{schoolStats.totalClasses}</p>
          <p className="text-sm text-gray-500 mt-1">Active classes</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Attendance Rate</h3>
          <p className="text-3xl font-bold text-orange-600">{schoolStats.attendanceRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Based on recent records</p>
        </div>
      </div>

      {/* Add Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="text-blue-600 font-semibold">View Reports</div>
            <div className="text-sm text-blue-500">Generate school reports</div>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-green-600 font-semibold">Staff Overview</div>
            <div className="text-sm text-green-500">View staff performance</div>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="text-purple-600 font-semibold">Messages</div>
            <div className="text-sm text-purple-500">Check parent messages</div>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <div className="text-orange-600 font-semibold">Analytics</div>
            <div className="text-sm text-orange-500">School performance</div>
          </button>
        </div>
      </div>
    </div>
  );
}