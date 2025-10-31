import React, { useState, useEffect } from 'react';

export default function SubjectAssignments() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [assignments, setAssignments] = useState({
    subjects: [],
    classes: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load teachers
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const staff = users.filter(u => 
      ['Subject Teacher', 'Form Master', 'VP Academic', 'VP Admin'].includes(u.role)
    );
    setTeachers(staff);

    // Load subjects
    const schoolSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
    setSubjects(schoolSubjects);

    // Load classes
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setClasses(Object.keys(classLists));
  };

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeacher(teacherId);
    const teacher = teachers.find(t => t.id === teacherId);
    setAssignments({
      subjects: teacher?.assignedSubjects || [],
      classes: teacher?.assignedClasses || []
    });
  };

  const updateAssignments = () => {
    if (!selectedTeacher) {
      alert('Please select a teacher first');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(user => 
      user.id === selectedTeacher 
        ? { 
            ...user, 
            assignedSubjects: assignments.subjects,
            assignedClasses: assignments.classes
          }
        : user
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert('Assignments updated successfully!');
    loadData();
  };

  const toggleSubject = (subject) => {
    setAssignments(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const toggleClass = (className) => {
    setAssignments(prev => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Teacher Subject & Class Assignments</h2>

      {/* Teacher Selection */}
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-3">Select Teacher</h3>
        <select
          value={selectedTeacher}
          onChange={(e) => handleTeacherSelect(e.target.value)}
          className="w-full p-3 border rounded"
        >
          <option value="">Choose a teacher</option>
          {teachers.map(teacher => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name} - {teacher.role}
            </option>
          ))}
        </select>
      </div>

      {selectedTeacher && (
        <>
          {/* Subject Assignments */}
          <div className="mb-6 p-4 bg-green-50 rounded">
            <h3 className="font-semibold mb-3">Assign Subjects</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {subjects.map(subject => (
                <label key={subject} className="flex items-center space-x-2 p-2 bg-white rounded border">
                  <input
                    type="checkbox"
                    checked={assignments.subjects.includes(subject)}
                    onChange={() => toggleSubject(subject)}
                    className="rounded"
                  />
                  <span>{subject}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Class Assignments */}
          <div className="mb-6 p-4 bg-yellow-50 rounded">
            <h3 className="font-semibold mb-3">Assign Classes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {classes.map(className => (
                <label key={className} className="flex items-center space-x-2 p-2 bg-white rounded border">
                  <input
                    type="checkbox"
                    checked={assignments.classes.includes(className)}
                    onChange={() => toggleClass(className)}
                    className="rounded"
                  />
                  <span>{className}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Current Assignments Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Current Assignments</h3>
            <p><strong>Subjects:</strong> {assignments.subjects.join(', ') || 'None'}</p>
            <p><strong>Classes:</strong> {assignments.classes.join(', ') || 'None'}</p>
          </div>

          <button
            onClick={updateAssignments}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            💾 Save Assignments
          </button>
        </>
      )}
    </div>
  );
}
