// src/data/classes.js - ONLY ADMIN CREATED CLASSES
export const classes = []; // Empty array - only admin-created classes

// Initialize class structure for localStorage
export const initializeClassData = () => {
  if (!localStorage.getItem('classLists')) {
    // Start with empty structure - admin will create classes
    localStorage.setItem('classLists', JSON.stringify({}));
  }

  if (!localStorage.getItem('examBank')) {
    localStorage.setItem('examBank', JSON.stringify({}));
  }
};

// Get ONLY admin-created classes from localStorage
export const getAdminClasses = () => {
  const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
  return Object.keys(classLists);
};

// For backward compatibility - returns dynamic classes
export const getClasses = () => {
  return getAdminClasses();
};
