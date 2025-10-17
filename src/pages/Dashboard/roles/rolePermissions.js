export const rolePermissions = {
  "Admin": ["Exam Bank", "E-Library", "User Management"],
  "Principal": ["Exam Bank", "E-Library"],
  "Form Master": ["Exam Bank", "Class Lists"],
  "Subject Teacher": ["Exam Bank"],
  "Senior Master": ["Exam Bank", "E-Library"],
  "Exam Officer": ["Exam Bank"],
  "VP Admin": ["E-Library"],
  "VP Academic": ["Exam Bank", "E-Library"],
};

export const canEditScores = (role, userSubjects, targetSubject) => {
  if (role === "Admin" || role === "Form Master") return true;
  if (role === "Subject Teacher" && userSubjects?.includes(targetSubject)) return true;
  return false;
};
// Add "Report Cards" to Principal and Exam Officer permissions
const rolePermissions = {
  "Principal": ["Exam Bank", "Report Cards", "E-Library", /* ... other permissions */],
  "Exam Officer": ["Exam Bank", "Report Cards", "E-Library", /* ... other permissions */],
  // Other roles should NOT have "Report Cards"
};
// Add "E-Library" to all roles that should have access
const rolePermissions = {
  "Admin": ["Exam Bank", "E-Library", "User Management", /* ... */],
  "Principal": ["Exam Bank", "Report Cards", "E-Library", /* ... */],
  "Exam Officer": ["Exam Bank", "Report Cards", "E-Library", /* ... */],
  "Subject Teacher": ["Exam Bank", "E-Library", /* ... */],
  "Form Master": ["Exam Bank", "E-Library", /* ... */],
  "VP Academic": ["Exam Bank", "E-Library", /* ... */],
  "VP Admin": ["Exam Bank", "E-Library", /* ... */],
  "Senior Master": ["Exam Bank", "E-Library", /* ... */],
};
