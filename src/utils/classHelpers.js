// src/utils/classHelpers.js - Safe utility for dynamic class management

// Get ONLY admin-created classes from localStorage
export const getAdminClasses = () => {
  const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
  const adminClasses = Object.keys(classLists);
  
  // If no admin classes exist yet, return empty array (no hardcoded classes)
  return adminClasses;
};

// Get subjects for a class (from admin-created subjects)
export const getClassSubjects = (className) => {
  const savedSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
  
  // Return saved subjects or basic defaults if none exist
  return savedSubjects.length > 0 ? savedSubjects : [
    "Mathematics",
    "English", 
    "Science",
    "Social Studies"
  ];
};

// For backward compatibility - mimics old subjects structure
export const getSubjectsByClass = () => {
  const savedSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
  const adminClasses = getAdminClasses();
  const subjectsObj = {};
  
  // Create subjects object for each admin class
  adminClasses.forEach(className => {
    subjectsObj[className] = savedSubjects.length > 0 ? savedSubjects : [
      "Mathematics", "English", "Science", "Social Studies"
    ];
  });
  
  return subjectsObj;
};

// Check if a class exists (admin-created only)
export const isValidClass = (className) => {
  const adminClasses = getAdminClasses();
  return adminClasses.includes(className);
};
