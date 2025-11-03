import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FinanceContext = createContext();

// Initial state matching Nigerian school reality
const initialState = {
  // Fee payments data
  feePayments: [],
  feeStructure: {},

  // Budget data
  staffSalaries: [],
  expenses: [],
  deductionSettings: {
    lateComing: 500,    // ₦500 per late coming
    absence: 2000       // ₦2000 per absence day
  },

  // Security
  financeAccess: false,
  financePassword: 'school123', // Default password - proprietor can change

  // UI state
  currentView: 'school-fees'
};

function financeReducer(state, action) {
  switch (action.type) {
    // Fee Payments
    case 'ADD_FEE_PAYMENT':
      const newPayment = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        receiptNumber: `REC${Date.now()}`,
        status: 'completed'
      };
      return {
        ...state,
        feePayments: [...state.feePayments, newPayment]
      };

    // Fee Structure
    case 'SET_FEE_STRUCTURE':
      return {
        ...state,
        feeStructure: action.payload
      };

    // Staff Salaries
    case 'ADD_STAFF_SALARY':
      const newStaff = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString()
      };
      return {
        ...state,
        staffSalaries: [...state.staffSalaries, newStaff]
      };

    // Expenses
    case 'ADD_EXPENSE':
      const newExpense = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString()
      };
      return {
        ...state,
        expenses: [...state.expenses, newExpense]
      };

    // Security
    case 'SET_FINANCE_ACCESS':
      return {
        ...state,
        financeAccess: action.payload
      };

    case 'CHANGE_FINANCE_PASSWORD':
      return {
        ...state,
        financePassword: action.payload
      };

    // Deduction Settings
    case 'UPDATE_DEDUCTION_SETTINGS':
      return {
        ...state,
        deductionSettings: { ...state.deductionSettings, ...action.payload }
      };

    // Set multiple states at once
    case 'SET_FEE_PAYMENTS':
      return { ...state, feePayments: action.payload };
    case 'SET_STAFF_SALARIES':
      return { ...state, staffSalaries: action.payload };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };

    default:
      return state;
  }
}

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Load data from localStorage on startup
  useEffect(() => {
    console.log('🔄 FinanceContext: Loading data...');
    try {
      const savedData = localStorage.getItem('schoolFinanceData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData && typeof parsedData === 'object') {
          console.log('✅ FinanceContext: Data loaded successfully');
          if (parsedData.feePayments) dispatch({ type: 'SET_FEE_PAYMENTS', payload: parsedData.feePayments });
          if (parsedData.feeStructure) dispatch({ type: 'SET_FEE_STRUCTURE', payload: parsedData.feeStructure });
          if (parsedData.staffSalaries) dispatch({ type: 'SET_STAFF_SALARIES', payload: parsedData.staffSalaries });
          if (parsedData.expenses) dispatch({ type: 'SET_EXPENSES', payload: parsedData.expenses });
          if (parsedData.deductionSettings) dispatch({ type: 'UPDATE_DEDUCTION_SETTINGS', payload: parsedData.deductionSettings });
          if (parsedData.financePassword) dispatch({ type: 'CHANGE_FINANCE_PASSWORD', payload: parsedData.financePassword });
          if (parsedData.financeAccess) dispatch({ type: 'SET_FINANCE_ACCESS', payload: parsedData.financeAccess });
        }
      } else {
        console.log('ℹ️ FinanceContext: No saved data found, using defaults');
      }
    } catch (error) {
      console.error('❌ FinanceContext: Error loading data:', error);
    }
  }, []); // Only run once on mount

  // Save to localStorage - FIXED: Only save specific state changes, not all state
  useEffect(() => {
    const dataToSave = {
      feePayments: state.feePayments,
      feeStructure: state.feeStructure,
      staffSalaries: state.staffSalaries,
      expenses: state.expenses,
      deductionSettings: state.deductionSettings,
      financePassword: state.financePassword,
      financeAccess: state.financeAccess
    };
    
    localStorage.setItem('schoolFinanceData', JSON.stringify(dataToSave));
    console.log('💾 FinanceContext: Data saved to localStorage');
  }, [
    state.feePayments, 
    state.feeStructure, 
    state.staffSalaries, 
    state.expenses, 
    state.deductionSettings,
    state.financePassword,
    state.financeAccess
  ]); // Only save when these specific properties change

  // Verify finance password
  const verifyFinancePassword = (password) => {
    return password === state.financePassword;
  };

  const value = {
    ...state,
    dispatch,
    verifyFinancePassword
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export default FinanceContext;
