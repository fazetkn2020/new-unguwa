import React, { useState, useEffect } from 'react';

export default function PrincipalOverview({ dashboardData }) {
  const [schoolStats, setSchoolStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalClasses: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    const users = dashboardData.users || [];
    const students = users.filter(u => u.role === 'Student');
    const staff = users.filter(u => u.role !== 'Student' && u.role !== 'Admin');
    const classes = dashboardData.classLists || {};
    
    setSchoolStats({
      totalStudents: students.length,
      totalStaff: staff.length,
      totalClasses: Object.keys(classes).length,
      attendanceRate: 85
    });
  }, [dashboardData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600">{schoolStats.totalStudents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Staff</h3>
          <p className="text-3xl font-bold text-green-600">{schoolStats.totalStaff}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Classes</h3>
          <p className="text-3xl font-bold text-purple-600">{schoolStats.totalClasses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Attendance Rate</h3>
          <p className="text-3xl font-bold text-orange-600">{schoolStats.attendanceRate}%</p>
        </div>
      </div>
    </div>
  );
}
