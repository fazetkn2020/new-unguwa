import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import BulkPrintManager from '../BulkReportCenter'; // ← Try BulkReportCenter instead

export default function ExamOfficerReports() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    setClasses(Object.keys(classLists));
    
    // Load students for the first class by default
    if (Object.keys(classLists).length > 0) {
      const firstClass = Object.keys(classLists)[0];
      setSelectedClass(firstClass);
      loadStudents(firstClass);
    }
  };

  const loadStudents = (className) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const classStudents = users.filter(u => 
      u.role === 'Student' && u.assignedClasses?.includes(className)
    );
    setStudents(classStudents);
  };

  const handleClassChange = (className) => {
    setSelectedClass(className);
    loadStudents(className);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Printing Center</h2>
        <p className="text-gray-600">
          Generate individual and bulk report sheets for students
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

      {/* Bulk Report Center */}
      {selectedClass && students.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <BulkPrintManager 
            students={students}
            className={selectedClass}
          />
        </div>
      )}

      {/* If BulkPrintManager doesn't exist, show fallback */}
      {selectedClass && students.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Report Generation</h3>
          <p className="text-gray-600 mb-4">
            Ready to generate reports for {students.length} students in {selectedClass}
          </p>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Generate Bulk Reports
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Print All
            </button>
          </div>
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
          <div className="text-2xl font-bold text-purple-600">
            {students.filter(s => {
              const examData = JSON.parse(localStorage.getItem('examData')) || {};
              const studentId = `${selectedClass}_${s.name?.replace(/\s+/g, '_')}`;
              return examData[studentId];
            }).length}
          </div>
          <div className="text-sm text-gray-600">With Scores</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {students.filter(s => {
              const examData = JSON.parse(localStorage.getItem('examData')) || {};
              const studentId = `${selectedClass}_${s.name?.replace(/\s+/g, '_')}`;
              const scores = examData[studentId];
              return scores && Object.keys(scores).length > 0;
            }).length}
          </div>
          <div className="text-sm text-gray-600">Ready to Print</div>
        </div>
      </div>
    </div>
  );
}
