import { useState, useEffect } from "react";
import { useExam } from "../../context/ExamContext";

const useTeachingAssignments = (user) => {
  const { staffAssignments, students } = useExam(); 
  // staffAssignments = admin-assigned class & subject for teachers
  // students = all students from form masters

  const [currentClass, setCurrentClass] = useState("");
  const [currentSubject, setCurrentSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [hasTeachingAssignments, setHasTeachingAssignments] = useState(false);

  useEffect(() => {
    if (!user || !staffAssignments) return;

    // find what class and subject admin assigned to this user
    const assigned = staffAssignments.find(
      (a) => a.teacherName?.toLowerCase() === user.fullName?.toLowerCase()
    );

    if (assigned) {
      setCurrentClass(assigned.className);
      setCurrentSubject(assigned.subjectName);
      setSubjects([assigned.subjectName]);
      setHasTeachingAssignments(true);
    } else {
      setHasTeachingAssignments(false);
    }
  }, [user, staffAssignments]);

  const getCurrentClassStudents = () => {
    if (!students || !currentClass) return [];
    return students.filter(
      (s) => s.className?.toLowerCase() === currentClass?.toLowerCase()
    );
  };

  return {
    currentClass,
    currentSubject,
    subjects,
    hasTeachingAssignments,
    getCurrentClassStudents,
  };
};

export default useTeachingAssignments;
