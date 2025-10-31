// src/pages/Dashboard/ExamBank.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useExam } from "../../context/ExamContext";

export default function ExamBank() {
  const { user } = useAuth() || {};
  const { examData, updateScore, canUserEditSubject } = useExam();

  const [selectedClass, setSelectedClass] = useState(user?.classes?.[0] || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Load class list, subjects, and users from localStorage
  useEffect(() => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setAllClasses(Object.keys(classLists));

    const schoolSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
    setAllSubjects(schoolSubjects);

    // Load all users to find teacher assignments
    const users = JSON.parse(localStorage.getItem('users')) || [];
    setAllUsers(users);
  }, []);

  if (!user) return <p>Loading...</p>;

  const getClassStudents = (className) => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    return classLists[className] || [];
  };

  const classStudents = getClassStudents(selectedClass);

  const filteredClasses = allClasses.filter(cls =>
    cls.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Use the same student identifier format as ScoreCenter
  const getStudentIdentifier = (student, className) => {
    if (!student) return "";
    return `${student.id}-${className}`;
  };

  // Get teacher name who is assigned to teach this subject IN THIS SPECIFIC CLASS
  const getSubjectTeacherName = (subject) => {
    // Find teachers assigned to this subject AND this specific class
    const subjectTeachers = allUsers.filter(teacherUser => {
      const teacherSubjects = teacherUser.assignedSubjects || [];
      const teacherClasses = teacherUser.assignedClasses || [];
      
      // Teacher must be assigned to BOTH this subject AND this class
      return teacherSubjects.includes(subject) && teacherClasses.includes(selectedClass);
    });

    if (subjectTeachers.length > 0) {
      // Return the first teacher's name
      const teacher = subjectTeachers[0];
      return teacher.name || teacher.fullName || 'Assigned Teacher';
    }

    // If no teacher assigned to this subject+class combo, check if any teacher is assigned to just the subject
    const subjectOnlyTeachers = allUsers.filter(teacherUser => {
      const teacherSubjects = teacherUser.assignedSubjects || [];
      return teacherSubjects.includes(subject);
    });

    if (subjectOnlyTeachers.length > 0) {
      const teacher = subjectOnlyTeachers[0];
      return `${teacher.name || teacher.fullName} (Not assigned to ${selectedClass})`;
    }

    return 'No Teacher Assigned';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Exam Bank - Score Management</h2>

      {/* User Info */}
      <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-800">
          <strong>Welcome, {user.fullName || user.name}!</strong>
          {user.role === 'Teacher' && user.assignedSubjects && (
            <span> - Teaching: {user.assignedSubjects.join(', ')}</span>
          )}
        </p>
      </div>

      {/* Class Search and Selection */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search Classes:</label>
            <input
              type="text"
              placeholder="Type to search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Select Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">Choose a class</option>
              {filteredClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {searchTerm === "" && allClasses.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {allClasses.slice(0, 6).map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedClass === cls
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {!selectedClass ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-800 text-lg">
            👆 Select a class above to view scores
          </p>
        </div>
      ) : classStudents.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">
            <strong>No students found in {selectedClass}.</strong><br />
            VP Admin needs to enroll students in this class first.
          </p>
        </div>
      ) : (
        <>
          {/* Class Header */}
          <div className="bg-white rounded-lg shadow border p-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              📊 {selectedClass} - Score Overview
            </h3>
            <p className="text-gray-600">
              {classStudents.length} students • {allSubjects.length} subjects
            </p>
          </div>

          {/* Exam Bank Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow border">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-semibold border-b sticky left-0 bg-gray-50 z-10">
                    Student Name
                  </th>
                  {allSubjects.map(subject => (
                    <th key={subject} className="p-3 text-center font-semibold border-b border-l" colSpan="3">
                      <div>
                        {subject}
                        <div className="text-xs font-normal text-gray-600 mt-1">
                          Teacher: {getSubjectTeacherName(subject)}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="p-2 border-b sticky left-0 bg-gray-50 z-10"></th>
                  {allSubjects.map(subject => (
                    <React.Fragment key={subject}>
                      <th className="p-2 text-xs font-medium border-b border-l">CA (40)</th>
                      <th className="p-2 text-xs font-medium border-b">Exam (60)</th>
                      <th className="p-2 text-xs font-medium border-b">Total</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classStudents.map(student => {
                  const studentIdentifier = getStudentIdentifier(student, selectedClass);
                  const scores = examData[studentIdentifier] || {};

                  return (
                    <tr key={studentIdentifier} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium sticky left-0 bg-white border-r">
                        {student.fullName}
                      </td>

                      {allSubjects.map(subject => {
                        const sid = studentIdentifier;
                        const subjectScores = examData[sid]?.[subject] || { ca: '', exam: '', total: 0 };
                        const editable = canUserEditSubject(user, subject);

                        return (
                          <React.Fragment key={`${sid}_${subject}`}>
                            <td className="p-1 border-l">
                              <input
                                type="number"
                                min="0"
                                max="40"
                                value={subjectScores.ca === '' ? '' : subjectScores.ca}
                                onChange={(e) => updateScore(sid, subject, 'ca', e.target.value)}
                                disabled={!editable}
                                className="w-16 p-1 border rounded text-center disabled:bg-gray-100 focus:ring-2 focus:ring-blue-300"
                                placeholder="0"
                              />
                            </td>
                            <td className="p-1">
                              <input
                                type="number"
                                min="0"
                                max="60"
                                value={subjectScores.exam === '' ? '' : subjectScores.exam}
                                onChange={(e) => updateScore(sid, subject, 'exam', e.target.value)}
                                disabled={!editable}
                                className="w-16 p-1 border rounded text-center disabled:bg-gray-100 focus:ring-2 focus:ring-blue-300"
                                placeholder="0"
                              />
                            </td>
                            <td className="p-2 text-center font-medium bg-blue-50">
                              <span className={`px-2 py-1 rounded text-sm ${
                                subjectScores.total >= 70 ? 'bg-green-100 text-green-800' :
                                subjectScores.total >= 50 ? 'bg-blue-100 text-blue-800' :
                                subjectScores.total >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {subjectScores.total || 0}
                              </span>
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Tip */}
          <div className="mt-4 md:hidden bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-orange-700 text-sm">
              💡 <strong>Mobile Tip:</strong> Scroll horizontally to view all subjects
            </p>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>VP Academic</strong> creates subjects and assigns teachers</li>
              <li>• <strong>VP Admin</strong> enrolls students → creates score slots</li>
              <li>• <strong>Subject Teachers</strong> enter scores → visible here immediately</li>
              <li>• <strong>Teacher names</strong> shown above each subject column</li>
              <li>• <strong>CA Score:</strong> 0-40 | <strong>Exam Score:</strong> 0-60 | <strong>Total:</strong> 0-100</li>
              <li>• <strong>Colors:</strong> 🟢 70+ | 🔵 50-69 | 🟡 40-49 | 🔴 Below 40</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
