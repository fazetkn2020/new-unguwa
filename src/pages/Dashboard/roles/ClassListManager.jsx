// src/pages/Dashboard/roles/ClassListManager.jsx - UPDATED
import React, { useState, useEffect } from "react";
import { useExam } from "../../../context/ExamContext";
import { subjects } from "../../../data/subjects";

export default function ClassListManager({ className }) {
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

  const saveClassList = (updatedStudents) => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    classLists[className] = updatedStudents;
    localStorage.setItem('classLists', JSON.stringify(classLists));
  };

  const addStudent = () => {
    if (!newStudent.studentId || !newStudent.fullName) {
      alert("Please fill in both Student ID and Full Name");
      return;
    }

    const studentExists = students.find(s => 
      s.studentId === newStudent.studentId || 
      s.fullName.toLowerCase() === newStudent.fullName.toLowerCase()
    );

    if (studentExists) {
      alert("Student with this ID or name already exists!");
      return;
    }

    const studentId = `${className}_${newStudent.studentId}`;
    const studentData = {
      ...newStudent,
      id: studentId,
      class: className
    };

    const updatedStudents = [...students, studentData];
    
    setStudents(updatedStudents);
    saveClassList(updatedStudents);
    
    // AUTOMATICALLY CREATE EXAM BANK SCORE SLOTS using Exam Context
    initializeStudentScores(studentId, className, newStudent.fullName);
    
    setNewStudent({ studentId: "", fullName: "", gender: "Male" });
    alert(`Student ${newStudent.fullName} added successfully! Exam Bank slots created.`);
  };

  const removeStudent = (index) => {
    const studentToRemove = students[index];
    if (window.confirm(`Are you sure you want to remove ${studentToRemove.fullName}?`)) {
      const updatedStudents = students.filter((_, i) => i !== index);
      setStudents(updatedStudents);
      saveClassList(updatedStudents);
      alert("Student removed from class list.");
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setNewStudent(students[index]);
  };

  const saveEdit = () => {
    const updatedStudents = [...students];
    updatedStudents[editingIndex] = newStudent;
    setStudents(updatedStudents);
    saveClassList(updatedStudents);
    setEditingIndex(null);
    setNewStudent({ studentId: "", fullName: "", gender: "Male" });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setNewStudent({ studentId: "", fullName: "", gender: "Male" });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Class List: {className}</h2>
      
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Automatic Exam Bank Integration:</strong> When you add a student, 
          empty score slots are automatically created in the Exam Bank for all {className} subjects.
          Subject Teachers can then fill in CA and Exam scores.
        </p>
      </div>
      
      {/* Add/Edit Student Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-3">
          {editingIndex !== null ? 'Edit Student' : 'Add New Student'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <input
            type="text"
            placeholder="Student ID"
            value={newStudent.studentId}
            onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Full Name"
            value={newStudent.fullName}
            onChange={(e) => setNewStudent({...newStudent, fullName: e.target.value})}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <select
            value={newStudent.gender}
            onChange={(e) => setNewStudent({...newStudent, gender: e.target.value})}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="flex gap-2">
          {editingIndex !== null ? (
            <>
              <button
                onClick={saveEdit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={addStudent}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Student
            </button>
          )}
        </div>
      </div>

      {/* Students List */}
      <div>
        <h3 className="font-medium mb-3">Class Students ({students.length})</h3>
        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No students in this class yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Student ID</th>
                  <th className="py-2 px-4 border-b text-left">Full Name</th>
                  <th className="py-2 px-4 border-b text-left">Gender</th>
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
                      <button
                        onClick={() => startEdit(index)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeStudent(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
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
