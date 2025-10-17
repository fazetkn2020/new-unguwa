// Grading system utilities for report cards

export const calculateGrade = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  if (score >= 40) return 'E';
  return 'F';
};

export const getGradeRemark = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Credit';
  if (score >= 50) return 'Pass';
  if (score >= 40) return 'Fair';
  return 'Fail';
};

export const getGradePoints = (grade) => {
  const gradePoints = {
    'A+': 5.0,
    'A': 5.0,
    'B': 4.0,
    'C': 3.0,
    'D': 2.0,
    'E': 1.0,
    'F': 0.0
  };
  return gradePoints[grade] || 0.0;
};

export const calculateSubjectStats = (scores) => {
  const total = scores.reduce((sum, score) => sum + score, 0);
  const average = total / scores.length;
  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);
  
  return {
    total,
    average: parseFloat(average.toFixed(2)),
    highest,
    lowest,
    grade: calculateGrade(average),
    remark: getGradeRemark(average)
  };
};

export const calculateStudentPosition = (students) => {
  // Calculate total scores for each student
  const studentsWithTotals = students.map(student => {
    const totalScore = Object.values(student.scores || {}).reduce((sum, score) => sum + score, 0);
    return { ...student, totalScore };
  });

  // Sort by total score descending
  const sortedStudents = studentsWithTotals.sort((a, b) => b.totalScore - a.totalScore);

  // Assign positions
  return sortedStudents.map((student, index) => {
    let position = index + 1;
    
    // Handle ties (same total score)
    if (index > 0 && student.totalScore === sortedStudents[index - 1].totalScore) {
      position = sortedStudents[index - 1].position;
    }
    
    return {
      ...student,
      position,
      grade: calculateGrade(student.totalScore / Object.keys(student.scores || {}).length),
      remark: getGradeRemark(student.totalScore / Object.keys(student.scores || {}).length)
    };
  });
};

export const generateRemarks = (averageScore, attendance = 95) => {
  if (averageScore >= 80 && attendance >= 90) {
    return "Excellent performance with outstanding attendance. Keep it up!";
  } else if (averageScore >= 70 && attendance >= 85) {
    return "Very good performance with good attendance. Continue to improve!";
  } else if (averageScore >= 60 && attendance >= 80) {
    return "Good performance. Put in more effort for better results.";
  } else if (averageScore >= 50 && attendance >= 75) {
    return "Fair performance. More dedication is needed in studies.";
  } else if (averageScore >= 40 && attendance >= 70) {
    return "Passed but needs significant improvement in all subjects.";
  } else {
    return "Poor performance. Requires extra lessons and parental attention.";
  }
};

export const calculateOverallAverage = (studentScores) => {
  const scores = Object.values(studentScores);
  if (scores.length === 0) return 0;
  
  const total = scores.reduce((sum, score) => sum + score, 0);
  return parseFloat((total / scores.length).toFixed(2));
};

export default {
  calculateGrade,
  getGradeRemark,
  getGradePoints,
  calculateSubjectStats,
  calculateStudentPosition,
  generateRemarks,
  calculateOverallAverage
};
