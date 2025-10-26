// src/utils/studentUtils.js
export const getStudentIdentifier = (student, className = "") => {
    if (!student) return "";
    // prefer an explicit id if present
    if (student.id) return String(student.id);
    // otherwise build a stable key from class + trimmed name
    return `${className}_${String(student.fullName || student.name || "")
      .trim()
      .replace(/\s+/g, "_")}`;
  };
  