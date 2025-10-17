// Bulk printing utilities for multiple report cards

export const prepareStudentsForBulkPrint = (students, selectedStudentIds) => {
  return students.filter(student => selectedStudentIds.includes(student.id));
};

export const groupStudentsByClass = (students) => {
  return students.reduce((groups, student) => {
    const className = student.class || 'Unknown';
    if (!groups[className]) {
      groups[className] = [];
    }
    groups[className].push(student);
    return groups;
  }, {});
};

export const calculateBulkPrintStats = (students) => {
  const totalStudents = students.length;
  const classes = Object.keys(groupStudentsByClass(students));
  
  return {
    totalStudents,
    totalClasses: classes.length,
    classes,
    timestamp: new Date().toLocaleString()
  };
};

export const validateStudentsForPrint = (students) => {
  const errors = [];
  const validStudents = [];

  students.forEach(student => {
    if (!student.id) {
      errors.push(`Student missing ID: ${student.name}`);
      return;
    }

    if (!student.name) {
      errors.push(`Student missing name: ID ${student.id}`);
      return;
    }

    if (!student.scores || Object.keys(student.scores).length === 0) {
      errors.push(`No scores found for: ${student.name}`);
      return;
    }

    // Check if all subjects have valid scores
    const invalidScores = Object.entries(student.scores).filter(([subject, score]) => {
      return typeof score !== 'number' || score < 0 || score > 100;
    });

    if (invalidScores.length > 0) {
      errors.push(`Invalid scores for ${student.name}: ${invalidScores.map(([sub]) => sub).join(', ')}`);
      return;
    }

    validStudents.push(student);
  });

  return {
    validStudents,
    errors,
    hasErrors: errors.length > 0
  };
};

export const generatePrintBatchId = () => {
  return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const chunkStudentsForPrinting = (students, chunkSize = 10) => {
  const chunks = [];
  for (let i = 0; i < students.length; i += chunkSize) {
    chunks.push(students.slice(i, i + chunkSize));
  }
  return chunks;
};

export default {
  prepareStudentsForBulkPrint,
  groupStudentsByClass,
  calculateBulkPrintStats,
  validateStudentsForPrint,
  generatePrintBatchId,
  chunkStudentsForPrinting
};
