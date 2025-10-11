import { createContext, useState, useContext } from "react";

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [examData, setExamData] = useState([]);

  const addResult = (newResult) => setExamData((prev) => [...prev, newResult]);
  const clearResults = () => setExamData([]);

  return (
    <ExamContext.Provider value={{ examData, addResult, clearResults }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext);
