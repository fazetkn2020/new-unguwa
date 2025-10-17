import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  selectedStudents: [],
  isBulkPrinting: false,
  isBulkSaving: false,
  progress: 0,
  currentOperation: '',
  errors: [],
  batchId: null,
  selectedClass: '',
  printSettings: {
    includeComments: true,
    includeSignatures: true,
    doubleSided: false,
    term: 'First Term',
    session: '2024/2025'
  }
};

// Action types
const ACTION_TYPES = {
  SELECT_STUDENT: 'SELECT_STUDENT',
  DESELECT_STUDENT: 'DESELECT_STUDENT',
  SELECT_ALL: 'SELECT_ALL',
  DESELECT_ALL: 'DESELECT_ALL',
  SET_SELECTED_CLASS: 'SET_SELECTED_CLASS',
  START_BULK_OPERATION: 'START_BULK_OPERATION',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  FINISH_BULK_OPERATION: 'FINISH_BULK_OPERATION',
  SET_ERRORS: 'SET_ERRORS',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  UPDATE_PRINT_SETTINGS: 'UPDATE_PRINT_SETTINGS',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const bulkPrintReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SELECT_STUDENT:
      return {
        ...state,
        selectedStudents: [...state.selectedStudents, action.payload.studentId]
      };

    case ACTION_TYPES.DESELECT_STUDENT:
      return {
        ...state,
        selectedStudents: state.selectedStudents.filter(id => id !== action.payload.studentId)
      };

    case ACTION_TYPES.SELECT_ALL:
      return {
        ...state,
        selectedStudents: action.payload.studentIds
      };

    case ACTION_TYPES.DESELECT_ALL:
      return {
        ...state,
        selectedStudents: []
      };

    case ACTION_TYPES.SET_SELECTED_CLASS:
      return {
        ...state,
        selectedClass: action.payload.className,
        selectedStudents: [] // Clear selections when class changes
      };

    case ACTION_TYPES.START_BULK_OPERATION:
      return {
        ...state,
        isBulkPrinting: action.payload.operationType === 'print',
        isBulkSaving: action.payload.operationType === 'save',
        progress: 0,
        currentOperation: action.payload.operationName,
        batchId: action.payload.batchId,
        errors: []
      };

    case ACTION_TYPES.UPDATE_PROGRESS:
      return {
        ...state,
        progress: action.payload.progress
      };

    case ACTION_TYPES.FINISH_BULK_OPERATION:
      return {
        ...state,
        isBulkPrinting: false,
        isBulkSaving: false,
        progress: 100,
        currentOperation: '',
        errors: action.payload.errors || []
      };

    case ACTION_TYPES.SET_ERRORS:
      return {
        ...state,
        errors: action.payload.errors
      };

    case ACTION_TYPES.CLEAR_ERRORS:
      return {
        ...state,
        errors: []
      };

    case ACTION_TYPES.UPDATE_PRINT_SETTINGS:
      return {
        ...state,
        printSettings: {
          ...state.printSettings,
          ...action.payload.settings
        }
      };

    case ACTION_TYPES.RESET_STATE:
      return {
        ...initialState,
        selectedClass: state.selectedClass // Keep class selection
      };

    default:
      return state;
  }
};

// Create context
const BulkPrintContext = createContext();

// Provider component
export const BulkPrintProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bulkPrintReducer, initialState);

  const actions = {
    selectStudent: (studentId) => {
      dispatch({ type: ACTION_TYPES.SELECT_STUDENT, payload: { studentId } });
    },

    deselectStudent: (studentId) => {
      dispatch({ type: ACTION_TYPES.DESELECT_STUDENT, payload: { studentId } });
    },

    selectAllStudents: (studentIds) => {
      dispatch({ type: ACTION_TYPES.SELECT_ALL, payload: { studentIds } });
    },

    deselectAllStudents: () => {
      dispatch({ type: ACTION_TYPES.DESELECT_ALL });
    },

    setSelectedClass: (className) => {
      dispatch({ type: ACTION_TYPES.SET_SELECTED_CLASS, payload: { className } });
    },

    startBulkOperation: (operationType, operationName, batchId) => {
      dispatch({ 
        type: ACTION_TYPES.START_BULK_OPERATION, 
        payload: { operationType, operationName, batchId } 
      });
    },

    updateProgress: (progress) => {
      dispatch({ type: ACTION_TYPES.UPDATE_PROGRESS, payload: { progress } });
    },

    finishBulkOperation: (errors = []) => {
      dispatch({ type: ACTION_TYPES.FINISH_BULK_OPERATION, payload: { errors } });
    },

    setErrors: (errors) => {
      dispatch({ type: ACTION_TYPES.SET_ERRORS, payload: { errors } });
    },

    clearErrors: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_ERRORS });
    },

    updatePrintSettings: (settings) => {
      dispatch({ type: ACTION_TYPES.UPDATE_PRINT_SETTINGS, payload: { settings } });
    },

    resetState: () => {
      dispatch({ type: ACTION_TYPES.RESET_STATE });
    }
  };

  return (
    <BulkPrintContext.Provider value={{ state, actions }}>
      {children}
    </BulkPrintContext.Provider>
  );
};

// Custom hook to use the context
export const useBulkPrint = () => {
  const context = useContext(BulkPrintContext);
  if (!context) {
    throw new Error('useBulkPrint must be used within a BulkPrintProvider');
  }
  return context;
};

export default BulkPrintContext;
