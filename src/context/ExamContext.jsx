import { createContext, useState, useContext, useEffect } from "react";
// Assuming 'subjects' structure is correct: { 'SS1': ['Mathematics', 'English', ...], ... }
import { subjects } from "../data/subjects"; 

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [examData, setExamData] = useState({});

  // Load exam data from localStorage on startup
  useEffect(() => {
    const savedData = localStorage.getItem("examData");
    if (savedData) setExamData(JSON.parse(savedData));
  }, []);

  // Auto-save to localStorage when examData changes
  useEffect(() => {
    localStorage.setItem("examData", JSON.stringify(examData));
  }, [examData]);

  const calculateTotal = (ca, exam) => {
    // Ensure both are treated as numbers, default to 0 if NaN
    const numCa = parseInt(ca) || 0;
    const numExam = parseInt(exam) || 0;
    return Math.min(100, numCa + numExam);
  };
  
  // NOTE: This function is primarily for initialization when loading class data, 
  // but we'll make updateScore handle on-the-fly initialization too.
  const initializeStudentScores = (studentId, classLevel) => {
    const classSubjects = subjects[classLevel] || [];

    // This initialization seems mostly unused if scores are entered directly.
    // We will rely on the logic in `updateScore` for on-demand initialization.
    console.log(`Attempted to initialize scores for ${studentId} in ${classLevel}`);
    
    // You might want to remove this function if it's never explicitly called
    // before scores are entered, or make sure your ScoreEntryTable calls it.
  };

  const updateScore = (studentId, subject, field, value) => {
    // 1. Sanitize the input value
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));

    setExamData(prev => {
      // 2. Safely get existing student data or initialize an empty object
      const studentScores = prev[studentId] || {};
      
      // 3. Safely get existing subject data or initialize an empty object
      const subjectScores = studentScores[subject] || { ca: '', exam: '', total: 0 };
      
      // 4. Determine the new CA and Exam values
      const newCa = field === 'ca' ? numValue : (subjectScores.ca || 0);
      const newExam = field === 'exam' ? numValue : (subjectScores.exam || 0);
      
      // 5. Calculate the new total
      const newTotal = calculateTotal(newCa, newExam);

      return {
        ...prev,
        [studentId]: {
          ...studentScores,
          [subject]: {
            ca: newCa,
            exam: newExam,
            total: newTotal
          }
        }
      };
    });
  };

  const canUserEditSubject = (user, subject) => {
    if (!user) return false;
    if (user.role === "Admin" || user.role === "Form Master") return true;
    // Check if user.subjects is an array and includes the subject
    if (user.role === "Subject Teacher" && Array.isArray(user.subjects) && user.subjects.includes(subject)) return true;
    return false;
  };

  return (
    <ExamContext.Provider value={{ 
      examData, 
      updateScore, 
      canUserEditSubject,
      calculateTotal,
      initializeStudentScores
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext);
