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
