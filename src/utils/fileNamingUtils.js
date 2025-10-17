// File naming utilities for bulk PDF export

export const generateReportFileName = (student, className, term = 'First Term', session = '2024/2025') => {
  const cleanName = student.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
  const cleanClass = className.replace(/\s+/g, '_');
  const cleanTerm = term.replace(/\s+/g, '_');
  const cleanSession = session.replace(/\//g, '-');
  
  return `${cleanClass}_${cleanName}_${cleanTerm}_${cleanSession}_Report.pdf`;
};

export const generateBulkZipFileName = (className, term = 'First Term', session = '2024/2025') => {
  const cleanClass = className.replace(/\s+/g, '_');
  const cleanTerm = term.replace(/\s+/g, '_');
  const cleanSession = session.replace(/\//g, '-');
  
  return `${cleanClass}_Report_Cards_${cleanTerm}_${cleanSession}.zip`;
};

export const getFileSafeString = (str) => {
  return str.replace(/[^a-zA-Z0-9\s.-]/g, '').replace(/\s+/g, '_');
};

export const validateFileName = (fileName) => {
  // Check for invalid characters and length
  const invalidChars = /[<>:"/\\|?*]/g;
  const maxLength = 255;
  
  if (invalidChars.test(fileName)) {
    return false;
  }
  
  if (fileName.length > maxLength) {
    return false;
  }
  
  if (fileName.trim() === '') {
    return false;
  }
  
  return true;
};

export default {
  generateReportFileName,
  generateBulkZipFileName,
  getFileSafeString,
  validateFileName
};
