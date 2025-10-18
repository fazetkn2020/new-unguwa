import { useState, useEffect } from 'react';

// Custom hook to manage teaching assignments and scoring context
export const useTeachingAssignments = (user) => {
  const [teachingContext, setTeachingContext] = useState({
    subjects: [],
    classes: [],
    currentSubjectIndex: 0,
    currentClassIndex: 0,
    hasTeachingAssignments: false
  });

  // Update teaching context when user changes
  useEffect(() => {
    if (user) {
      const subjects = user.assignedSubjects || [];
      const classes = user.assignedClasses || [];
      
      setTeachingContext({
        subjects,
        classes,
        currentSubjectIndex: 0,
        currentClassIndex: 0,
        hasTeachingAssignments: subjects.length > 0 && classes.length > 0
      });
    }
  }, [user]);

  // Navigate to next subject
  const nextSubject = () => {
    setTeachingContext(prev => ({
      ...prev,
      currentSubjectIndex: prev.subjects.length > 0 
        ? (prev.currentSubjectIndex + 1) % prev.subjects.length 
        : 0
    }));
  };

  // Navigate to previous subject
  const prevSubject = () => {
    setTeachingContext(prev => ({
      ...prev,
      currentSubjectIndex: prev.subjects.length > 0
        ? (prev.currentSubjectIndex - 1 + prev.subjects.length) % prev.subjects.length
        : 0
    }));
  };

  // Navigate to next class
  const nextClass = () => {
    setTeachingContext(prev => ({
      ...prev,
      currentClassIndex: prev.classes.length > 0
        ? (prev.currentClassIndex + 1) % prev.classes.length
        : 0
    }));
  };

  // Navigate to previous class
  const prevClass = () => {
    setTeachingContext(prev => ({
      ...prev,
      currentClassIndex: prev.classes.length > 0
        ? (prev.currentClassIndex - 1 + prev.classes.length) % prev.classes.length
        : 0
    }));
  };

  // Set specific subject
  const setSubject = (subjectIndex) => {
    setTeachingContext(prev => ({
      ...prev,
      currentSubjectIndex: subjectIndex
    }));
  };

  // Set specific class
  const setClass = (classIndex) => {
    setTeachingContext(prev => ({
      ...prev,
      currentClassIndex: classIndex
    }));
  };

  // Get current subject and class
  const currentSubject = teachingContext.subjects[teachingContext.currentSubjectIndex] || '';
  const currentClass = teachingContext.classes[teachingContext.currentClassIndex] || '';

  // Get students for current class
  const getCurrentClassStudents = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    return classLists[currentClass] || [];
  };

  return {
    // State
    ...teachingContext,
    currentSubject,
    currentClass,
    
    // Navigation methods
    nextSubject,
    prevSubject,
    nextClass,
    prevClass,
    setSubject,
    setClass,
    
    // Data methods
    getCurrentClassStudents
  };
};

export default useTeachingAssignments;
