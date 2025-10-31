// src/data/students.js - UPDATED: No hardcoded students
export const students = []; // Empty array - students come from admin-created classes

// Function to get students by class (from admin-created classes)
export const getStudentsByClass = (className) => {
  const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
  return classLists[className] || [];
};
