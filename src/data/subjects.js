export const subjects = {
  "SS1": [
    "Mathematics", "English Language", "Biology", "Chemistry", "Physics",
    "Civic Education", "Economics", "Geography", "Further Mathematics",
    "Agricultural Science", "Literature in English", "Government"
  ],
  "SS2": [
    "Mathematics", "English Language", "Biology", "Chemistry", "Physics",
    "Civic Education", "Economics", "Geography", "Further Mathematics", 
    "Agricultural Science", "Literature in English", "Government"
  ],
  "SS3": [
    "Mathematics", "English Language", "Biology", "Chemistry", "Physics",
    "Civic Education", "Economics", "Geography", "Further Mathematics",
    "Agricultural Science", "Literature in English", "Government"
  ]
};

// Each student selects 9 subjects from the 12 available
export const getStudentSubjects = (studentId, classLevel) => {
  // In real app, this would come from student data
  // For now, return first 9 subjects
  return subjects[classLevel]?.slice(0, 9) || [];
};
