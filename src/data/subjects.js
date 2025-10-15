export const subjects = {
  "SS1": [
    "Animal Husbandry",
    "Biology", 
    "Mathematics",
    "English",
    "Hausa",
    "Islamic Studies",
    "Civic Education",
    "Geography",
    "Government",
    "Physics",
    "Chemistry",
    "Economics"
  ],
  "SS2": [
    "Animal Husbandry",
    "Biology",
    "Mathematics", 
    "English",
    "Hausa",
    "Islamic Studies",
    "Civic Education",
    "Geography",
    "Government",
    "Physics",
    "Chemistry",
    "Economics"
  ],
  "SS3": [
    "Animal Husbandry", 
    "Biology",
    "Mathematics",
    "English",
    "Hausa",
    "Islamic Studies",
    "Civic Education",
    "Geography",
    "Government",
    "Physics",
    "Chemistry",
    "Economics"
  ]
};

// Simple function to get 9 subjects for a student
export const getStudentSubjects = (studentId, classLevel) => {
  // For now, return first 9 subjects
  // Later you can implement actual subject selection
  return subjects[classLevel]?.slice(0, 9) || [];
};
