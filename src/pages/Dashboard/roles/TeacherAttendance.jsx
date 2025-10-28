import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function TeacherAttendance() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const teachers = users.filter(u => 
      ['Subject Teacher', 'Form Master', 'Senior Master'].includes(u.role)
    );
    setTeachers(teachers);
    
    // Load today's attendance
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = JSON.parse(localStorage.getItem(`teacherAttendance_${today}`)) || {};
    setAttendance(todayAttendance);
  }, []);

  const markAttendance = (teacherId, status) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedAttendance = {
      ...attendance,
      [teacherId]: { status, markedBy: user.name, timestamp: new Date().toISOString() }
    };
    
    setAttendance(updatedAttendance);
    localStorage.setItem(`teacherAttendance_${today}`, JSON.stringify(updatedAttendance));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Teacher Attendance - {new Date().toLocaleDateString()}</h2>
      </div>
      <div className="divide-y">
        {teachers.map(teacher => (
          <div key={teacher.id} className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{teacher.name}</h3>
              <p className="text-sm text-gray-600">{teacher.role} • {teacher.assignedSubjects?.join(', ')}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => markAttendance(teacher.id, 'present')}
                className={`px-4 py-2 rounded ${
                  attendance[teacher.id]?.status === 'present' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-100 text-green-800'
                }`}
              >
                Present
              </button>
              <button
                onClick={() => markAttendance(teacher.id, 'absent')}
                className={`px-4 py-2 rounded ${
                  attendance[teacher.id]?.status === 'absent' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
