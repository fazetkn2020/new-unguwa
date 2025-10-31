// src/data/classes.js
export const classes = []; // ✅ No hardcoded classes

export const initializeClassData = () => {
  if (!localStorage.getItem('classLists')) {
    localStorage.setItem('classLists', JSON.stringify({}));
  }
  if (!localStorage.getItem('examBank')) {
    localStorage.setItem('examBank', JSON.stringify({}));
  }
};

export const getAdminClasses = () => {
  const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
  return Object.keys(classLists); // ✅ Only admin-created classes
};

export const getClasses = () => getAdminClasses();
