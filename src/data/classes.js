// src/data/classes.js - UPDATED
export const classes = ["SS1", "SS2", "SS3"];

// Initialize class structure for localStorage
export const initializeClassData = () => {
  if (!localStorage.getItem('classLists')) {
    const initialStructure = {};
    classes.forEach(className => {
      initialStructure[className] = [];
    });
    localStorage.setItem('classLists', JSON.stringify(initialStructure));
  }
  
  if (!localStorage.getItem('examBank')) {
    localStorage.setItem('examBank', JSON.stringify({}));
  }
};