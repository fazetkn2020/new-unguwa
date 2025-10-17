// FIXED IMPORT PATHS
import React, { useState, useEffect } from 'react';
import { BulkPrintProvider, useBulkPrint } from '../../context/BulkPrintContext';
import BulkPrintManager from '../../components/BulkPrintManager';
import BulkProgressIndicator from './components/BulkProgressIndicator';
import { students } from '../../data/students';
import { subjects } from '../../data/subjects';

// Main component that uses the context
const BulkReportCenterContent = () => {
  const { state } = useBulkPrint();
  const [currentClass, setCurrentClass] = useState('SS1');
  const [classStudents, setClassStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load students when class changes
  useEffect(() => {
    const loadClassStudents = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter students by class and add sample scores if missing
      const filteredStudents = students
        .filter(student => student.class === currentClass)
        .map(student => ({
          ...student,
          scores: student.scores || generateSampleScores(currentClass)
        }));
      
      setClassStudents(filteredStudents);
      setIsLoading(false);
    };

    if (currentClass) {
      loadClassStudents();
    }
  }, [currentClass]);

  // Generate sample scores for demonstration
  const generateSampleScores = (className) => {
    const classSubjects = subjects[className] || [];
    const scores = {};
    
    classSubjects.forEach(subject => {
      // Generate random scores between 40 and 95
      scores[subject] = Math.floor(Math.random() * 56) + 40;
    });
    
    return scores;
  };

  const handleClassChange = (newClass) => {
    setCurrentClass(newClass);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Bulk Report Center</h1>
        <p className="text-gray-600 mt-2">
          Print or save multiple report cards at once for efficient distribution
        </p>
      </div>

      {/* Class Selection Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Class Selection</h2>
            <p className="text-gray-600 text-sm">
              Choose a class to manage report cards
            </p>
          </div>
          <select
            value={currentClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={state.isBulkPrinting || state.isBulkSaving}
          >
            <option value="SS1">Senior Secondary 1 (SS1)</option>
            <option value="SS2">Senior Secondary 2 (SS2)</option>
            <option value="SS3">Senior Secondary 3 (SS3)</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students for {currentClass}...</p>
        </div>
      )}

      {/* Bulk Print Manager */}
      {!isLoading && (
        <BulkPrintManager
          students={classStudents}
          className={currentClass}
        />
      )}

      {/* Progress Indicator */}
      <BulkProgressIndicator />

      {/* Quick Stats Footer */}
      {!isLoading && classStudents.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Statistics - {currentClass}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{classStudents.length}</div>
              <div className="text-sm text-blue-800">Total Students</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {classStudents.filter(s => s.scores && Object.keys(s.scores).length > 0).length}
              </div>
              <div className="text-sm text-green-800">With Scores</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {subjects[currentClass]?.length || 0}
              </div>
              <div className="text-sm text-purple-800">Subjects</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {state.selectedStudents.length}
              </div>
              <div className="text-sm text-orange-800">Currently Selected</div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          💡 How to Use Bulk Report Center
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
          <div>
            <strong>1. Select Class</strong> - Choose the class you want to work with
          </div>
          <div>
            <strong>2. Choose Students</strong> - Select individual students or use "Select All"
          </div>
          <div>
            <strong>3. Configure Settings</strong> - Set term, session, and other options
          </div>
          <div>
            <strong>4. Print or Save</strong> - Generate PDFs for printing or download
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
          <p className="text-xs text-yellow-800">
            <strong>Tip:</strong> For large classes, use the selection checkboxes to print reports 
            in batches. The system can handle multiple students simultaneously.
          </p>
        </div>
      </div>
    </div>
  );
};

// Provider wrapper component
const BulkReportCenter = () => {
  return (
    <BulkPrintProvider>
      <BulkReportCenterContent />
    </BulkPrintProvider>
  );
};

export default BulkReportCenter;
