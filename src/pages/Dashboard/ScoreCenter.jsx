import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExam } from '../../context/ExamContext';

export default function ScoreCenter() {
  const { user } = useAuth();
  const { examData, updateScore } = useExam();
  const [students, setStudents] = useState([]);
  
  // Get assigned classes and subjects from user data
  const assignedClasses = user?.assignedClasses || [];
  const assignedSubjects = user?.assignedSubjects || [];

  // Auto-select first assignment
  const currentClass = assignedClasses[0] || '';
  const currentSubject = assignedSubjects[0] || '';

  useEffect(() => {
    if (currentClass) {
      const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
      const classStudents = classLists[currentClass] || [];
      setStudents(classStudents);
    }
  }, [currentClass]);

  const getStudentScore = (studentIdentifier) => {
    return examData[studentIdentifier]?.[currentSubject] || { ca: "", exam: "", total: "" };
  };

  const calculateTotal = (ca, exam) => {
    const caScore = ca === "" ? 0 : parseInt(ca);
    const examScore = exam === "" ? 0 : parseInt(exam);
    return Math.min(100, caScore + examScore);
  };

  // Check if user has teaching assignments
  if (assignedClasses.length === 0 || assignedSubjects.length === 0) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">No Teaching Assignment</h1>
            <p className="text-gray-600 text-lg mb-6">
              Contact <strong>VP Academic</strong> to get assigned to classes and subjects.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="w-full max-w-full">
        {/* Simple Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 mb-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Score Entry</h1>
              <p className="text-gray-600 text-sm">
                {currentClass} - {currentSubject}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
              <p className="text-green-800 text-sm">
                <strong>Subjects:</strong> {assignedSubjects.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Score Entry Table */}
        {students.length > 0 ? (
          <div className="bg-white shadow border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-gray-800">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold">#</th>
                    <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold">Student Name</th>
                    <th className="py-3 px-4 border-b border-gray-300 text-center font-semibold">CA (0-40)</th>
                    <th className="py-3 px-4 border-b border-gray-300 text-center font-semibold">Exam (0-60)</th>
                    <th className="py-3 px-4 border-b border-gray-300 text-center font-semibold">Total</th>
                    <th className="py-3 px-4 border-b border-gray-300 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => {
                    const studentIdentifier = `${student.id}-${currentClass}`;
                    const scores = getStudentScore(studentIdentifier);
                    const isComplete = scores.ca !== "" && scores.exam !== "";
                    const total = calculateTotal(scores.ca, scores.exam);

                    const handleScoreChange = (scoreType, value) => {
                      let numericValue = value === "" ? "" : parseInt(value);
                      if (numericValue !== "" && isNaN(numericValue)) numericValue = 0;

                      if (numericValue !== "") {
                        if (scoreType === "ca") numericValue = Math.max(0, Math.min(40, numericValue));
                        if (scoreType === "exam") numericValue = Math.max(0, Math.min(60, numericValue));
                      }

                      updateScore(studentIdentifier, currentSubject, scoreType, numericValue);
                    };

                    return (
                      <tr key={studentIdentifier} className="hover:bg-gray-50 border-b border-gray-200">
                        <td className="py-3 px-4 font-medium">{index + 1}</td>
                        <td className="py-3 px-4 font-medium text-blue-700">{student.fullName}</td>

                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            max="40"
                            value={scores.ca === "" ? "" : scores.ca}
                            onChange={(e) => handleScoreChange("ca", e.target.value)}
                            className="w-20 p-2 border border-gray-300 rounded text-center block focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 mx-auto"
                            placeholder="0"
                          />
                        </td>

                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            max="60"
                            value={scores.exam === "" ? "" : scores.exam}
                            onChange={(e) => handleScoreChange("exam", e.target.value)}
                            className="w-20 p-2 border border-gray-300 rounded text-center block focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 mx-auto"
                            placeholder="0"
                          />
                        </td>

                        <td className="py-3 px-4 text-center font-semibold">
                          <span
                            className={`px-3 py-1 rounded text-sm ${
                              total >= 70
                                ? "bg-green-100 text-green-800"
                                : total >= 50
                                ? "bg-blue-100 text-blue-800"
                                : total >= 40
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {total}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              isComplete
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {isComplete ? "Complete" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Completion summary */}
            <div className="p-3 bg-gray-100 border-t border-gray-300">
              <div className="text-sm text-gray-700 text-center">
                <strong>{students.filter(s => {
                  const studentIdentifier = `${s.id}-${currentClass}`;
                  const scores = getStudentScore(studentIdentifier);
                  return scores.ca !== "" && scores.exam !== "";
                }).length}</strong> of <strong>{students.length}</strong> students completed
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-yellow-50 border border-yellow-300 rounded-xl">
            <div className="text-yellow-500 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Students Found</h3>
            <p className="text-gray-600">
              No students in <strong>{currentClass}</strong>.<br />
              Ask <strong>VP Admin</strong> to enroll students.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
