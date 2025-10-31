// src/data/subjects.js - UPDATED: Dynamic subjects
import { getClassSubjects, getSubjectsByClass } from '../utils/classHelpers';

// Master list of common subjects (for reference, not hardcoded usage)
const masterSubjects = [
  "Mathematics", "English", "Physics", "Chemistry", "Biology",
  "Geography", "Economics", "Agricultural Science", "Civic Education",
  "Government", "History", "CRS", "IRS", "Literature", "Commerce",
  "Accounting", "Further Mathematics", "Basic Science", "Basic Technology",
  "Social Studies", "Computer Science", "French"
];

// Returns subjects for a student (uses admin-created subjects)
export const getStudentSubjects = (studentId, classLevel) => {
  return getClassSubjects(classLevel);
};

// For backward compatibility - returns dynamic subjects object
export const subjects = getSubjectsByClass();
