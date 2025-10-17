// src/pages/Dashboard/roles/rolePermissions.js
export const rolePermissions = {
  "Admin": ["Exam Bank", "E-Library", "User Management", "System Settings"],
  "Principal": ["Exam Bank", "Report Cards", "Bulk Reports", "E-Library", "Top Students"],
  "Form Master": ["Exam Bank", "Class Lists", "Bulk Reports", "E-Library"],
  "Subject Teacher": ["Exam Bank", "E-Library"],
  "Senior Master": ["Exam Bank", "Bulk Reports", "E-Library"],
  "Exam Officer": ["Exam Bank", "Report Cards", "Bulk Reports", "E-Library"],
  "VP Admin": ["Exam Bank", "E-Library"],
  "VP Academic": ["Exam Bank", "Bulk Reports", "E-Library"],
};

export const canEditScores = (role, userSubjects, targetSubject) => {
  if (role === "Admin" || role === "Form Master") return true;
  if (role === "Subject Teacher" && userSubjects?.includes(targetSubject)) return true;
  return false;
};

export const canAccessBulkReports = (role) => {
  return ["Principal", "Exam Officer", "Form Master", "Senior Master", "VP Academic"].includes(role);
};

export const canAccessSingleReports = (role) => {
  return ["Principal", "Exam Officer"].includes(role);
};
