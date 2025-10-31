import React, { useState, useEffect } from 'react';

export default function StudentEnrollment() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [newStudent, setNewStudent] = useState({
    studentId: '',
    fullName: '',
    class: '',
    gender: '',
    dateOfBirth: '',
    parentPhone: ''
  });

  useEffect(() => {
    loadClasses();
    loadStudents();
  }, []);

  const loadClasses = () => {
    // FIXED: Get classes from classLists (created by VP Academic)
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setClasses(Object.keys(classLists));
  };

  const loadStudents = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const allStudents = Object.values(classLists).flat();
    setStudents(allStudents);
  };

  const enrollStudent = () => {
    if (!newStudent.studentId || !newStudent.fullName || !newStudent.class) {
      alert('Please fill in Student ID, Full Name, and Class');
      return;
    }

    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    
    // Check if student ID already exists
    const allStudents = Object.values(classLists).flat();
    const existingStudent = allStudents.find(s => s.studentId === newStudent.studentId);
    if (existingStudent) {
      alert(`Student ID ${newStudent.studentId} already exists!`);
      return;
    }

    // Check if class exists (created by VP Academic)
    if (!classLists[newStudent.class]) {
      alert(`Class ${newStudent.class} does not exist! Please ask VP Academic to create it first.`);
      return;
    }

    // Create student object
    const student = {
      id: Date.now().toString(),
      studentId: newStudent.studentId,
      fullName: newStudent.fullName,
      class: newStudent.class,
      gender: newStudent.gender,
      dateOfBirth: newStudent.dateOfBirth,
      parentPhone: newStudent.parentPhone,
      status: 'approved',
      enrolledBy: 'VP Admin',
      enrolledAt: new Date().toISOString()
    };

    // Add to class list (shared with VP Academic)
    classLists[newStudent.class].push(student);
    localStorage.setItem('classLists', JSON.stringify(classLists));
    
    // Also add to users for system-wide access
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({
      ...student,
      role: 'Student',
      email: `${newStudent.studentId}@school.edu`,
      password: 'student123'
    });
    localStorage.setItem('users', JSON.stringify(users));

    alert(`✅ Student ${newStudent.fullName} enrolled in ${newStudent.class}`);
    setNewStudent({ studentId: '', fullName: '', class: '', gender: '', dateOfBirth: '', parentPhone: '' });
    loadStudents();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Student Enrollment - VP Admin</h2>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Enrollment Process</h3>
        <p className="text-blue-700 text-sm">
          • <strong>VP Academic</strong> creates classes first<br/>
          • <strong>VP Admin</strong> enrolls students in existing classes<br/>
          • Available classes: <strong>{classes.length}</strong>
        </p>
      </div>

      {/* Enrollment Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student ID *
          </label>
          <input
            type="text"
            value={newStudent.studentId}
            onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="STU001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={newStudent.fullName}
            onChange={(e) => setNewStudent({...newStudent, fullName: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class *
          </label>
          <select
            value={newStudent.class}
            onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          {classes.length === 0 && (
            <p className="text-red-600 text-xs mt-1">
              ❌ No classes available. Ask <strong>VP Academic</strong> to create classes first.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={newStudent.gender}
            onChange={(e) => setNewStudent({...newStudent, gender: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={newStudent.dateOfBirth}
            onChange={(e) => setNewStudent({...newStudent, dateOfBirth: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent's Phone
          </label>
          <input
            type="tel"
            value={newStudent.parentPhone}
            onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="080XXXXXXXX"
          />
        </div>

        <div className="md:col-span-2">
          <button
            onClick={enrollStudent}
            disabled={classes.length === 0}
            className={`w-full px-4 py-2 text-white rounded ${
              classes.length === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {classes.length === 0 ? '⏳ No Classes Available' : '🎓 Enroll Student'}
          </button>
        </div>
      </div>

      {/* Students List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Enrolled Students ({students.length})
        </h3>
        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No students enrolled yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 border">Student ID</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Class</th>
                  <th className="py-2 px-4 border">Gender</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="py-2 px-4 border">{student.studentId}</td>
                    <td className="py-2 px-4 border">{student.fullName}</td>
                    <td className="py-2 px-4 border">{student.class}</td>
                    <td className="py-2 px-4 border">{student.gender}</td>
                    <td className="py-2 px-4 border">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
