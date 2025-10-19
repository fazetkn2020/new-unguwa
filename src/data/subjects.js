// Master list of common subjects
const masterSubjects = [
  "Mathematics", "English", "Physics", "Chemistry", "Biology", 
  "Geography", "Economics", "Agricultural Science", "Civic Education",
  "Government", "History", "CRS", "IRS", "Literature", "Commerce",
  "Accounting", "Further Mathematics", "Basic Science", "Basic Technology",
  "Social Studies", "Computer Science", "French"
];

// Always returns exactly 9 subjects
export const getStudentSubjects = (studentId, classLevel) => {
  return masterSubjects.slice(0, 9);
};

// Simple export for compatibility
export const subjects = {
  "SS1": masterSubjects.slice(0, 9),
  "SS2": masterSubjects.slice(0, 9), 
  "SS3": masterSubjects.slice(0, 9),
  "JS1": masterSubjects.slice(0, 9),
  "JS2": masterSubjects.slice(0, 9),
  "JS3": masterSubjects.slice(0, 9)
};