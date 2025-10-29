import React, { useState, useEffect } from "react";
import { useExam } from "../../../context/ExamContext";
import { useAuth } from "../../../context/AuthContext"; // ADD THIS
import StatusHelper from "../../../components/StatusHelper";

export default function ClassListManager({ className }) {
  const { user } = useAuth(); // ADD THIS
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

  // ADD MISSING FUNCTIONS:
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

  // ... rest of your return JSX remains the same