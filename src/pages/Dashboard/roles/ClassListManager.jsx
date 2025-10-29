import React, { useState, useEffect } from "react";
import { useExam } from "../../../context/ExamContext";
import { useAuth } from "../../../context/AuthContext";
import StatusHelper from "../../../components/StatusHelper";

export default function ClassListManager({ className }) {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    studentId: "",
    fullName: "", 
    gender: "Male"
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const { initializeStudentScores } = useExam();

  useEffect(() => {
    loadClassList();
  }, [className]);

  const loadClassList = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setStudents(classLists[className] || []);
  };

  const addStudent = () => {
    if (!newStudent.studentId || !newStudent.fullName) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if student ID already exists
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const existingStudent = allUsers.find(u => 
      u.studentId === newStudent.studentId && u.role === 'Student'
    );

    if (existingStudent) {
      alert("Student ID already exists!");
      return;
    }

    const studentData = {
      id: `student-${Date.now()}`,
      studentId: newStudent.studentId,
      fullName: newStudent.fullName,
      gender: newStudent.gender,
      class: className,
      status: 'pending',
      role: 'Student',
      registeredBy: user.id,
      registeredAt: new Date().toISOString()
    };

    // Add to global users for admin approval
    const updatedUsers = [...allUsers, studentData];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Add to class list
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    if (!classLists[className]) classLists[className] = [];
    classLists[className].push(studentData);
    localStorage.setItem('classLists', JSON.stringify(classLists));

    // Update local state
    setStudents(classLists[className]);

    // Reset form
    setNewStudent({ studentId: "", fullName: "", gender: "Male" });

    alert("✅ Student added for admin approval!");
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setNewStudent({ ...students[index] });
  };

  const saveEdit = () => {
    if (editingIndex === null) return;

    const updatedStudents = [...students];
    updatedStudents[editingIndex] = { ...updatedStudents[editingIndex], ...newStudent };

    // Update localStorage
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    classLists[className] = updatedStudents;
    localStorage.setItem('classLists', JSON.stringify(classLists));

    // Update global users
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const studentToUpdate = allUsers.find(u => u.id === updatedStudents[editingIndex].id);
    if (studentToUpdate) {
      const updatedUsers = allUsers.map(u => 
        u.id === studentToUpdate.id ? { ...u, ...newStudent } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    setStudents(updatedStudents);
    setEditingIndex(null);
    setNewStudent({ studentId: "", fullName: "", gender: "Male" });
    alert("✅ Student updated successfully!");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setNewStudent({ studentId: "", fullName: "", gender: "Male" });
  };

  const removeStudent = (index) => {
    if (!window.confirm("Are you sure you want to remove this student?")) return;

    const studentToRemove = students[index];

    // Remove from class list
    const updatedStudents = students.filter((_, i) => i !== index);
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    classLists[className] = updatedStudents;
    localStorage.setItem('classLists', JSON.stringify(classLists));

    // Remove from global users if still pending
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = allUsers.filter(u => 
      !(u.id === studentToRemove.id && u.status === 'pending')
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setStudents(updatedStudents);
    alert("✅ Student removed successfully!");
  };

  // COMPLETE RETURN JSX
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Manage Class: {className}</h2>
      
      {/* Add Student Form */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="font-semibold mb-3">
          {editingIndex !== null ? 'Edit Student' : 'Add New Student'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <input
            type="text"
            placeholder="Student ID"
            value={newStudent.studentId}
            onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Full Name"
            value={newStudent.fullName}
            onChange={(e) => setNewStudent({...newStudent, fullName: e.target.value})}
            className="border p-2 rounded"
          />
          <select
            value={newStudent.gender}
            onChange={(e) => setNewStudent({...newStudent, gender: e.target.value})}
            className="border p-2 rounded"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="flex space-x-2">
          {editingIndex !== null ? (
            <>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={addStudent}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Student
            </button>
          )}
        </div>
      </div>

      {/* Students List */}
      <div>
        <h3 className="font-semibold mb-3">Class Students ({students.length})</h3>
        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No students in this class yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Student ID</th>
                  <th className="py-2 px-4 border-b text-left">Full Name</th>
                  <th className="py-2 px-4 border-b text-left">Gender</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{student.studentId}</td>
                    <td className="py-2 px-4 border-b">{student.fullName}</td>
                    <td className="py-2 px-4 border-b">{student.gender}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded text-xs ${
                        student.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeStudent(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
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
