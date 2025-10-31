// ✅ Safe utility for dynamic class and subject management (Admin-controlled only)

// 🔹 Get ONLY admin-created classes from localStorage
export const getAdminClasses = () => {
  const stored = JSON.parse(localStorage.getItem('schoolClasses')) || [];
  
  // If admin saves classes as an array of objects, extract their names
  // e.g. [{ name: "JSS1" }, { name: "JSS2" }]
  const adminClasses = stored.map(cls => cls.name || cls.className || cls); 

  // Filter out any empty or invalid entries
  return adminClasses.filter(Boolean);
};

// 🔹 Get subjects for a class (ONLY admin-created subjects)
export const getClassSubjects = (className) => {
  const savedSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
  
  // Return ONLY subjects created by the admin
  return savedSubjects.length > 0 ? savedSubjects : [];
};

// 🔹 Build subjects mapping per class (Admin-created only)
export const getSubjectsByClass = () => {
  const savedSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
  const adminClasses = getAdminClasses();
  const subjectsObj = {};

  // Create subject mapping for each admin-created class
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
