import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function FormMasterAttendance() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadClassStudents();
    loadAttendance();
  }, [selectedDate, user]);

  const loadClassStudents = () => {
    // Get Form Master's assigned class from user data
    const formMasterClass = user?.assignedClass || user?.formClass;
    
    if (!formMasterClass) {
      console.log("No class assigned to this Form Master");
      setStudents([]);
      return;
    }

    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const classStudents = classLists[formMasterClass] || [];
    setStudents(classStudents);
  };

  const loadAttendance = () => {
    const todayAttendance = JSON.parse(localStorage.getItem(`class_attendance_${selectedDate}`)) || {};
    setAttendance(todayAttendance);
  };

  const markAttendance = (studentId, status) => {
    const newAttendance = {
      ...attendance,
      [studentId]: {
        status,
        timestamp: new Date().toISOString(),
        markedBy: user?.name || 'Form Master'
      }
    };
    
    setAttendance(newAttendance);
    localStorage.setItem(`class_attendance_${selectedDate}`, JSON.stringify(newAttendance));
  };

  const assignedClass = user?.assignedClass || user?.formClass;

  if (!assignedClass) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">No Class Assigned</h2>
        <p className="text-gray-600">
          You have not been assigned to any class as Form Master.<br />
          Please contact VP Admin for class assignment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Class Attendance - {assignedClass}</h2>
        <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded">
          Form Master: {user?.name}
        </div>
      </div>
      
      {/* Date Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded text-center">
          <div className="text-2xl font-bold text-green-600">
            {Object.values(attendance).filter(a => a.status === 'present').length}
          </div>
          <div className="text-sm text-green-600">Present</div>
        </div>
        <div className="bg-red-50 p-4 rounded text-center">
          <div className="text-2xl font-bold text-red-600">
            {Object.values(attendance).filter(a => a.status === 'absent').length}
          </div>
          <div className="text-sm text-red-600">Absent</div>
        </div>
        <div className="bg-blue-50 p-4 rounded text-center">
          <div className="text-2xl font-bold text-blue-600">
            {students.length - Object.keys(attendance).length}
          </div>
          <div className="text-sm text-blue-600">Pending</div>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-3">
        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No students enrolled in {assignedClass} yet.</p>
            <p className="text-sm">Ask VP Admin to enroll students in this class.</p>
          </div>
        ) : (
          students.map(student => (
            <div key={student.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <span className="font-medium">{student.fullName}</span>
                <span className="text-sm text-gray-500 ml-2">({student.studentId})</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => markAttendance(student.id, 'present')}
                  className={`px-3 py-1 rounded ${
                    attendance[student.id]?.status === 'present' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => markAttendance(student.id, 'absent')}
                  className={`px-3 py-1 rounded ${
                    attendance[student.id]?.status === 'absent' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
