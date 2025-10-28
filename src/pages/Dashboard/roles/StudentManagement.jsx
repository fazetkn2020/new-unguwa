import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function StudentManagement({ className }) {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', admissionNumber: '' });

  useEffect(() => {
    loadStudents();
  }, [className]);

  const loadStudents = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const classStudents = users.filter(u => 
      u.role === 'Student' && u.assignedClasses?.includes(className)
    );
    setStudents(classStudents);
  };

  const addStudent = () => {
    if (!newStudent.name.trim() || !newStudent.admissionNumber.trim()) return;

    const student = {
      id: Date.now().toString(),
      name: newStudent.name,
      admissionNumber: newStudent.admissionNumber,
      role: 'Student',
      assignedClasses: [className],
      createdAt: new Date().toISOString()
    };

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(student);
    localStorage.setItem('users', JSON.stringify(users));
    
    setNewStudent({ name: '', admissionNumber: '' });
    loadStudents();
  };

  const removeStudent = (studentId) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.filter(u => u.id !== studentId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadStudents();
  };

  return (
    <div className="space-y-6">
      {/* Add Student Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Add Student to {className}</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Student Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Admission Number"
            value={newStudent.admissionNumber}
            onChange={(e) => setNewStudent({...newStudent, admissionNumber: e.target.value})}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addStudent}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Student
          </button>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold">Students in {className}</h3>
          <p className="text-gray-600">{students.length} students</p>
        </div>
        
        <div className="divide-y">
          {students.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No students in this class yet.
            </div>
          ) : (
            students.map(student => (
              <div key={student.id} className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{student.name}</h4>
                  <p className="text-sm text-gray-600">Admission: {student.admissionNumber}</p>
                </div>
                <button
                  onClick={() => removeStudent(student.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
