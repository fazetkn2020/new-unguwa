// FIXED IMPORT PATHS
import React, { useState, useEffect } from 'react';
import { useBulkPrint } from '../context/BulkPrintContext';

const StudentSelectionTable = ({ students, className, onSelectionChange }) => {
  const { state, actions } = useBulkPrint();
  const [allSelected, setAllSelected] = useState(false);
  const [localStudents, setLocalStudents] = useState([]);

  useEffect(() => {
    // Add selection state to students
    const studentsWithSelection = students.map(student => ({
      ...student,
      isSelected: state.selectedStudents.includes(student.id)
    }));
    setLocalStudents(studentsWithSelection);
  }, [students, state.selectedStudents]);

  useEffect(() => {
    // Update allSelected state
    if (students.length > 0) {
      setAllSelected(state.selectedStudents.length === students.length);
    } else {
      setAllSelected(false);
    }
  }, [state.selectedStudents, students.length]);

  const handleSelectAll = (checked) => {
    if (checked) {
      const allStudentIds = students.map(student => student.id);
      actions.selectAllStudents(allStudentIds);
    } else {
      actions.deselectAllStudents();
    }
    setAllSelected(checked);
  };

  const handleSelectStudent = (studentId, checked) => {
    if (checked) {
      actions.selectStudent(studentId);
    } else {
      actions.deselectStudent(studentId);
    }
  };

  const calculateStudentAverage = (scores) => {
    if (!scores || Object.keys(scores).length === 0) return 0;
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return (total / Object.keys(scores).length).toFixed(1);
  };

  const getGradeColor = (average) => {
    if (average >= 80) return 'text-green-600';
    if (average >= 70) return 'text-blue-600';
    if (average >= 60) return 'text-yellow-600';
    if (average >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No students found for {className}</p>
        <p className="text-sm text-gray-400">Select a class to load students</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Select All ({state.selectedStudents.length} selected)
              </span>
            </label>
          </div>
          <div className="text-sm text-gray-500">
            {students.length} student(s) in {className}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {localStudents.map((student) => {
              const average = calculateStudentAverage(student.scores);
              return (
                <tr 
                  key={student.id} 
                  className={`hover:bg-gray-50 ${
                    student.isSelected ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={student.isSelected}
                      onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getGradeColor(average)}`}>
                      {average}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.scores && Object.keys(student.scores).length > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Has Scores
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        No Scores
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {state.selectedStudents.length} of {students.length} students selected
          </span>
          <span>
            Ready for bulk operations
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentSelectionTable;
