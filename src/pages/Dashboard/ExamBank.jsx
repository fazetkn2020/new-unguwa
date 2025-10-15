import { useAuth } from "../../context/AuthContext";
import { useExam } from "../../context/ExamContext";
import { useState } from "react";
import { subjects, getStudentSubjects } from "../../data/subjects";

export default function ExamBank() {
  const { user } = useAuth() || {};
  const { examData, updateScore, canUserEditSubject } = useExam();
  const [selectedClass, setSelectedClass] = useState(user?.classes?.[0] || "");

  if (!user) return <p>Loading...</p>;

  // Get students from class lists
  const getClassStudents = (className) => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    return classLists[className] || [];
  };

  const currentSubjects = subjects[selectedClass] || [];
  const classStudents = getClassStudents(selectedClass);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Exam Bank - Score Management</h2>

      {/* Class Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Class:</label>
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          className="p-2 border rounded w-48"
        >
          {user.classes?.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {classStudents.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">
            <strong>No students found in {selectedClass}.</strong><br />
            Form Masters need to add students to the class list first.
          </p>
        </div>
      ) : (
        <>
          {/* Exam Bank Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-semibold border-b">Student Name</th>
                  {currentSubjects.map(subject => (
                    <th key={subject} className="p-3 text-center font-semibold border-b border-l" colSpan="3">
                      {subject}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="p-2 border-b"></th>
                  {currentSubjects.map(subject => (
                    <React.Fragment key={subject}>
                      <th className="p-2 text-xs font-medium border-b border-l">CA (40)</th>
                      <th className="p-2 text-xs font-medium border-b">Exam (60)</th>
                      <th className="p-2 text-xs font-medium border-b">Total</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classStudents.map(student => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium sticky left-0 bg-white">
                      {student.fullName}
                    </td>
                    {currentSubjects.map(subject => {
                      const studentSubjects = getStudentSubjects(student.id, selectedClass);
                      const isTakingSubject = studentSubjects.includes(subject);
                      const canEdit = isTakingSubject && canUserEditSubject(user, subject);
                      const scores = examData[student.id]?.[subject] || { ca: '', exam: '', total: 0 };

                      if (!isTakingSubject) {
                        return (
                          <React.Fragment key={subject}>
                            <td className="p-2 border-l text-center text-gray-400 bg-gray-50">-</td>
                            <td className="p-2 text-center text-gray-400 bg-gray-50">-</td>
                            <td className="p-2 text-center text-gray-400 bg-gray-50">-</td>
                          </React.Fragment>
                        );
                      }

                      return (
                        <React.Fragment key={subject}>
                          {/* CA Score Input */}
                          <td className="p-1 border-l">
                            <input
                              type="number"
                              min="0"
                              max="40"
                              value={scores.ca}
                              onChange={(e) => updateScore(student.id, subject, 'ca', e.target.value)}
                              disabled={!canEdit}
                              className="w-16 p-1 border rounded text-center disabled:bg-gray-100"
                              placeholder="0"
                            />
                          </td>
                          
                          {/* Exam Score Input */}
                          <td className="p-1">
                            <input
                              type="number"
                              min="0"
                              max="60"
                              value={scores.exam}
                              onChange={(e) => updateScore(student.id, subject, 'exam', e.target.value)}
                              disabled={!canEdit}
                              className="w-16 p-1 border rounded text-center disabled:bg-gray-100"
                              placeholder="0"
                            />
                          </td>
                          
                          {/* Total Score Display */}
                          <td className="p-2 text-center font-medium bg-blue-50">
                            {scores.total || 0}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Form Masters</strong> add students → automatically creates Exam Bank slots</li>
              <li>• <strong>Students</strong> take 9 out of 12 available subjects</li>
              <li>• <strong>Subject Teachers</strong> can only edit their assigned subjects</li>
              <li>• <strong>CA Score:</strong> 0-40 | <strong>Exam Score:</strong> 0-60 | <strong>Total:</strong> 0-100</li>
              <li>• <strong>Principals/VPs</strong> can view all scores but cannot edit</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
