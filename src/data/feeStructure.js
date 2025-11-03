// Dynamic fee structure - Safe integration with existing system
export const initializeFeeStructure = () => {
  if (!localStorage.getItem('feeStructure')) {
    // Initialize with empty structure to avoid breaking existing data
    localStorage.setItem('feeStructure', JSON.stringify({}));
  }
};

// Get fee structure - Safe getter
export const getFeeStructure = () => {
  try {
    return JSON.parse(localStorage.getItem('feeStructure')) || {};
  } catch (error) {
    console.error('Error reading fee structure:', error);
    return {};
  }
};

// Safe fee getter for class and term
export const getClassFee = (className, term) => {
  const feeStructure = getFeeStructure();
  return feeStructure[className]?.[term] || 0;
};

// Safe fee setter
export const setClassFee = (className, term, amount) => {
  const feeStructure = getFeeStructure();
  
  if (!feeStructure[className]) {
    feeStructure[className] = {};
  }
  
  feeStructure[className][term] = parseFloat(amount) || 0;
  
  try {
    localStorage.setItem('feeStructure', JSON.stringify(feeStructure));
    return feeStructure;
  } catch (error) {
    console.error('Error saving fee structure:', error);
    return feeStructure;
  }
};
