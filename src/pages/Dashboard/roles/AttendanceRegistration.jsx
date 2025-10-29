// src/pages/Dashboard/roles/AttendanceRegistration.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function AttendanceRegistration({ class: className }) {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadApprovedStudents();
    loadTodayAttendance();
  }, [className, date]);

  const loadApprovedStudents = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const approvedStudents = users.filter(u => 
      u.role === 'Student' && 
      u.status === 'approved' && 
      u.class === className
    );
    setStudents(approvedStudents);
  };

  const loadTodayAttendance = () => {
    const todayAttendance = JSON.parse(localStorage.getItem(`attendance_${date}`)) || {};
    setAttendance(todayAttendance);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        status,
        markedBy: user.id,
        markedAt: new Date().toISOString(),
        date: date,
        class: className
      }
    }));
  };

  const saveAttendance = () => {
    localStorage.setItem(`attendance_${date}`, JSON.stringify(attendance));
    
    // Update attendance records
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    if (!attendanceRecords[className]) attendanceRecords[className] = {};
    attendanceRecords[className][date] = attendance;
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    
    alert('✅ Attendance saved successfully!');
  };

  const presentCount = Object.values(attendance).filter(a => a.status === 'present').length;
  const absentCount = Object.values(attendance).filter(a => a.status === 'absent').length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Take Attendance - {className}</h2>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <div className="text-sm">
            <span className="text-green-600">Present: {presentCount}</span>
            <span className="text-red-600 ml-4">Absent: {absentCount}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {students.map(student => (
          <div key={student.id} className="flex items-center justify-between p-3 border rounded">
            <div>
              <span className="font-medium">{student.fullName}</span>
              <span className="text-gray-500 ml-2">({student.studentId})</span>
            </div>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`attendance-${student.id}`}
                  value="present"
                  checked={attendance[student.id]?.status === 'present'}
                  onChange={() => handleAttendanceChange(student.id, 'present')}
                  className="w-4 h-4 text-green-600"
                />
                <span className="ml-2">Present</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`attendance-${student.id}`}
                  value="absent"
                  checked={attendance[student.id]?.status === 'absent'}
                  onChange={() => handleAttendanceChange(student.id, 'absent')}
                  className="w-4 h-4 text-red-600"
                />
                <span className="ml-2">Absent</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={saveAttendance}
        disabled={students.length === 0}
        className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        💾 Save Attendance ({students.length} students)
      </button>
    </div>
  );
}
