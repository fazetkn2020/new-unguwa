import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function ExamOfficerReports() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setClasses(Object.keys(classLists));

    if (Object.keys(classLists).length > 0) {
      const firstClass = Object.keys(classLists)[0];
      setSelectedClass(firstClass);
      loadStudents(firstClass);
    }
  };

  const loadStudents = (className) => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const classStudents = classLists[className] || [];
    setStudents(classStudents);
  };

  const handleClassChange = (className) => {
    setSelectedClass(className);
    loadStudents(className);
  };

  const getStudentIdentifier = (student, className) => {
    if (!student) return "";
    return `${student.id}-${className}`;
  };

  const handleBulkAction = async (action) => {
    if (!selectedClass || students.length === 0) {
      alert('Please select a class with students first');
      return;
    }

    setBulkAction(action);
    
    // Simulate bulk processing
    setTimeout(() => {
      alert(`Bulk ${action} completed for ${students.length} students in ${selectedClass}`);
      setBulkAction('');
    }, 2000);
  };

  const studentsWithScores = students.filter(s => {
    const examData = JSON.parse(localStorage.getItem('examData')) || {};
    const studentId = getStudentIdentifier(s, selectedClass);
    return examData[studentId] && Object.keys(examData[studentId]).length > 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk Report Operations</h2>
        <p className="text-gray-600">
          Generate and manage reports for entire classes at once
        </p>
      </div>

      {/* Class Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Select Class</h3>
          <div className="text-sm text-gray-500">
            {students.length} students in {selectedClass}
          </div>
        </div>

        <div className="flex space-x-4">
          <select
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a class...</option>
            {classes.map(className => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedClass && students.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Bulk Operations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleBulkAction('print')}
              disabled={bulkAction || studentsWithScores.length === 0}
              className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">🖨️</div>
              <div className="font-semibold">Bulk Print Reports</div>
              <div className="text-sm text-gray-600 mt-1">
                {studentsWithScores.length} students ready
              </div>
            </button>

            <button
              onClick={() => handleBulkAction('pdf')}
              disabled={bulkAction || studentsWithScores.length === 0}
              className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">💾</div>
              <div className="font-semibold">Bulk Save as PDF</div>
              <div className="text-sm text-gray-600 mt-1">
                {studentsWithScores.length} students ready
              </div>
            </button>
          </div>

          {bulkAction && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
              <p className="text-blue-700">
                Processing bulk {bulkAction} for {students.length} students...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{classes.length}</div>
          <div className="text-sm text-gray-600">Total Classes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{students.length}</div>
          <div className="text-sm text-gray-600">Students</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{studentsWithScores.length}</div>
          <div className="text-sm text-gray-600">With Scores</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {students.length > 0 ? Math.round((studentsWithScores.length / students.length) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Completion</div>
        </div>
      </div>

      {/* Individual Reports Link */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700 text-center">
          For individual student reports, use the <strong>Report Card Generator</strong> in the main dashboard
        </p>
      </div>
    </div>
  );
}
