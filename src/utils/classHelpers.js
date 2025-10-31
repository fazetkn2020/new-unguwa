// ✅ Unified classHelpers.js
// Works with admin-created classes stored in `schoolClasses`

export const getAdminClasses = () => {
  // Try to get admin-created classes from localStorage
  const schoolClasses = JSON.parse(localStorage.getItem('schoolClasses')) || [];
  
  // If it's an array, map out the names
  const adminClasses = Array.isArray(schoolClasses)
    ? schoolClasses.map(cls => cls.name || cls.className || "")
    : Object.keys(schoolClasses);

  // Filter out empty entries
  return adminClasses.filter(Boolean);
};

// 🔹 Get subjects for a class (from admin-created subjects)
export const getClassSubjects = (className) => {
  const savedSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
  return savedSubjects.length > 0 ? savedSubjects : [];
};

// 🔹 Build subjects mapping per class (Admin-created only)
export const getSubjectsByClass = () => {
  const savedSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
  const adminClasses = getAdminClasses();
  const subjectsObj = {};

  adminClasses.forEach(className => {
    subjectsObj[className] = savedSubjects.length > 0 ? savedSubjects : [];
  });

  return subjectsObj;
};

// 🔹 Check if a class exists (admin-created only)
export const isValidClass = (className) => {
  const adminClasses = getAdminClasses();
  return adminClasses.includes(className);
};
