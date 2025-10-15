import { createContext, useState, useContext, useEffect } from "react";

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

  const updateScore = (studentId, subject, field, value) => {
    setExamData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: {
          ...prev[studentId]?.[subject],
          [field]: Math.min(100, Math.max(0, parseInt(value) || 0)), // Validate 0-100
          total: field === 'ca' || field === 'exam' 
            ? calculateTotal(
                field === 'ca' ? (parseInt(value) || 0) : (prev[studentId]?.[subject]?.ca || 0),
                field === 'exam' ? (parseInt(value) || 0) : (prev[studentId]?.[subject]?.exam || 0)
              )
            : prev[studentId]?.[subject]?.total
        }
      }
    }));
  };

  const calculateTotal = (ca, exam) => {
    return Math.min(100, ca + exam); // Ensure total doesn't exceed 100
  };

  const canUserEditSubject = (user, subject) => {
    if (!user) return false;
    if (user.role === "Admin" || user.role === "Form Master") return true;
    if (user.role === "Subject Teacher" && user.subjects?.includes(subject)) return true;
    return false;
  };

  return (
    <ExamContext.Provider value={{ 
      examData, 
      updateScore, 
      canUserEditSubject,
      calculateTotal 
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext);
