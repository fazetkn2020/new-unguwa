// src/context/ExamContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ExamContext = createContext();

export const useExam = () => useContext(ExamContext);

// Helper to calculate total score
const calculateTotal = (ca, exam) => {
  const caScore = ca === '' ? 0 : parseInt(ca);
  const examScore = exam === '' ? 0 : parseInt(exam);
  return Math.min(100, caScore + examScore);
};

export const ExamProvider = ({ children }) => {
  const [examData, setExamData] = useState({});

  // Load exam data from localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('examData')) || {};
    setExamData(storedData);
  }, []);

  // Persist exam data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('examData', JSON.stringify(examData));
  }, [examData]);

  // Update score for a student & subject
  const updateScore = (studentId, subject, field, value) => {
    setExamData(prev => {
      const currentSubject = prev[studentId]?.[subject] || { ca: '', exam: '', total: 0 };
      const newFieldValue = value === '' ? '' : parseInt(value) || 0;

      const updatedSubject = {
        ...currentSubject,
        [field]: newFieldValue,
      };

      // Update total if CA or Exam changed
      if (field === 'ca' || field === 'exam') {
        updatedSubject.total = calculateTotal(
          field === 'ca' ? newFieldValue : currentSubject.ca,
          field === 'exam' ? newFieldValue : currentSubject.exam
        );
      }

      const updatedData = {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [subject]: updatedSubject,
        },
      };

      // Save to localStorage
      localStorage.setItem('examData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  // Check if user can edit a subject - FIXED to match actual roles
  const canUserEditSubject = (user, subject) => {
    if (!user) return false;
    
    // Admin and VP Academic can edit all subjects
    if (['Admin', 'VP Academic'].includes(user.role)) return true;
    
    // Principal can view but not edit
    if (user.role === 'Principal') return false;
    
    // Form Master can edit all subjects in their class
    if (user.role === 'Form Master') return true;
    
    // Teacher can only edit their assigned subjects
    if (user.role === 'Teacher' && user.subjects) {
      return user.subjects.includes(subject);
    }
    
    return false;
  };

  // Get student by name from classLists
  const getStudentByName = (studentName, className) => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const classStudents = classLists[className] || [];
    return classStudents.find(student => student.fullName === studentName);
  };

  return (
    <ExamContext.Provider value={{
      examData,
      updateScore,
      canUserEditSubject,
      getStudentByName,
    }}>
      {children}
    </ExamContext.Provider>
  );
};
