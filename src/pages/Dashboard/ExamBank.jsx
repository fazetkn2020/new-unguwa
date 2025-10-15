import { useAuth } from "../../context/AuthContext";
import { useExam } from "../../context/ExamContext";
import { useState } from "react";
import { students } from "../../data/students";
import { subjects, getStudentSubjects } from "../../data/subjects";

export default function ExamBank() {
  const { user } = useAuth() || {};
  const { examData, updateScore, canUserEditSubject } = useExam();
  const [selectedClass, setSelectedClass] = useState(user?.classes?.[0] || "");

  if (!user) return <p>Loading...</p>;

  const currentSubjects = subjects[selectedClass] || [];
  const classStudents = students[selectedClass] || [];

  return (
    <div className="p-4">
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

      {/* Exam Bank Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-semibold">Student Name</th>
              {currentSubjects.map(subject => (
                <th key={subject} className="p-3 text-center font-semibold border-l" colSpan="3">
                  {subject}
                </th>
              ))}
            </tr>
            <tr>
              <th className="p-2"></th>
              {currentSubjects.map(subject => (
                <React.Fragment key={subject}>
                  <th className="p-2 text-xs font-medium border-l">CA (40)</th>
                  <th className="p-2 text-xs font-medium">Exam (60)</th>
                  <th className="p-2 text-xs font-medium">Total</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {classStudents.map(student => (
              <tr key={student.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{student.name}</td>
                {currentSubjects.map(subject => {
                  const studentSubjects = getStudentSubjects(student.id, selectedClass);
                  const isTakingSubject = studentSubjects.includes(subject);
                  const canEdit = isTakingSubject && canUserEditSubject(user, subject);
                  const scores = examData[student.id]?.[subject] || { ca: '', exam: '', total: '' };

                  if (!isTakingSubject) {
                    return (
                      <React.Fragment key={subject}>
                        <td className="p-2 border-l text-center text-gray-400">-</td>
                        <td className="p-2 text-center text-gray-400">-</td>
                        <td className="p-2 text-center text-gray-400">-</td>
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
                      <td className="p-2 text-center font-medium">
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
      <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
        <p><strong>Permissions:</strong> Subject Teachers can only edit their assigned subjects</p>
        <p><strong>Scoring:</strong> CA (0-40) + Exam (0-60) = Total (0-100)</p>
      </div>
    </div>
  );
}
