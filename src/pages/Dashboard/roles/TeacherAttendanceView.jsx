import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function TeacherAttendanceView() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = JSON.parse(localStorage.getItem(`attendance_${today}`)) || {};
    setAttendance(todayAttendance);
  }, []);

  const teachers = Object.entries(attendance)
    .map(([staffId, record]) => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const staffMember = users.find(u => u.id === staffId);
      return staffMember ? { ...staffMember, ...record } : null;
    })
    .filter(Boolean)
    .filter(staff => ['Subject Teacher', 'Form Master', 'Senior Master'].includes(staff.role));

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    present: teachers.filter(t => t.status === 'present').length,
    late: teachers.filter(t => t.status === 'late').length,
    absent: teachers.filter(t => t.status === 'absent').length,
    total: teachers.length
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          <div className="text-sm text-gray-600">Present</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
          <div className="text-sm text-gray-600">Late</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          <div className="text-sm text-gray-600">Absent</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Teachers</div>
        </div>
      </div>

      {/* Teacher List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Teacher Attendance Today</h2>
          <p className="text-gray-600">Real-time teacher attendance monitoring</p>
        </div>
        
        <div className="divide-y">
          {teachers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No teacher attendance recorded today.
            </div>
          ) : (
            teachers.map(teacher => (
              <div key={teacher.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{teacher.name}</h3>
                  <p className="text-sm text-gray-600">{teacher.role}</p>
                  {teacher.assignedSubjects && (
                    <p className="text-xs text-gray-500">{teacher.assignedSubjects.join(', ')}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(teacher.status)}`}>
                    {teacher.status.toUpperCase()}
                  </span>
                  {teacher.arrivalTime && (
                    <p className="text-sm text-gray-600 mt-1">Arrived: {teacher.arrivalTime}</p>
                  )}
                  <p className="text-xs text-gray-500">Marked by: {teacher.markedBy}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
