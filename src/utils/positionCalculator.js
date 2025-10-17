// Utility to calculate student positions based on total scores
export const calculateClassPositions = (students, examData, className) => {
  if (!students || !examData) return [];

  // Calculate total scores for each student
  const studentsWithTotals = students.map(student => {
    const studentIdentifier = `${className}_${student.fullName.replace(/\s+/g, '_')}`;
    const studentScores = examData[studentIdentifier] || {};
    
    // Calculate total score across all subjects
    const totalScore = Object.values(studentScores).reduce((sum, subject) => {
      return sum + (subject.total || 0);
    }, 0);

    return {
      ...student,
      totalScore,
      average: Object.keys(studentScores).length > 0 ? (totalScore / Object.keys(studentScores).length).toFixed(1) : 0
    };
  });

  // Sort by total score descending
  const sortedStudents = studentsWithTotals.sort((a, b) => b.totalScore - a.totalScore);

  // Assign positions (handle ties)
  let currentPosition = 1;
  let previousScore = null;
  let skipCount = 0;

  return sortedStudents.map((student, index) => {
    if (previousScore !== null && student.totalScore === previousScore) {
      skipCount++;
    } else {
      currentPosition = index + 1;
      skipCount = 0;
    }

    previousScore = student.totalScore;

    return {
      ...student,
      position: currentPosition,
      displayPosition: skipCount > 0 ? `${currentPosition} (tie)` : `${currentPosition}`
    };
  });
};

export const getStudentPosition = (students, examData, className, studentName) => {
  const positionedStudents = calculateClassPositions(students, examData, className);
  const student = positionedStudents.find(s => 
    s.fullName === studentName || s.name === studentName
  );
  
  return student ? {
    position: student.position,
    displayPosition: student.displayPosition,
    totalStudents: positionedStudents.length,
    average: student.average
  } : null;
};

// Make sure we have default export too
export default {
  calculateClassPositions,
  getStudentPosition
};
