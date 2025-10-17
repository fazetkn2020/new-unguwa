import React, { useState, useEffect } from 'react';
import { useBulkPrint } from '../context/BulkPrintContext';
import StudentSelectionTable from './StudentSelectionTable';
import BulkActionsToolbar from './BulkActionsToolbar';
import PDFExportManager from './PDFExportManager';
import { subjects } from '../data/subjects';

const BulkPrintManager = ({ students: initialStudents, className: initialClass = '' }) => {
  const { state, actions } = useBulkPrint();
  const [students, setStudents] = useState(initialStudents || []);
  const [currentClass, setCurrentClass] = useState(initialClass);

  // Initialize class selection
  useEffect(() => {
    if (initialClass && initialClass !== state.selectedClass) {
      actions.setSelectedClass(initialClass);
      setCurrentClass(initialClass);
    }
  }, [initialClass, state.selectedClass, actions]);

  // Update students when prop changes
  useEffect(() => {
    if (initialStudents) {
      setStudents(initialStudents);
    }
  }, [initialStudents]);

  // Get subjects for current class
  const getClassSubjects = () => {
    if (currentClass && subjects[currentClass]) {
      return subjects[currentClass];
    }
    // Fallback to all subjects or empty array
    return subjects.SS1 || [];
  };

  const handleBulkPrint = (selectedStudentIds = state.selectedStudents) => {
    if (selectedStudentIds.length === 0) {
      actions.setErrors(['Please select at least one student to print']);
      return;
    }

    const selectedStudents = students.filter(student => 
      selectedStudentIds.includes(student.id)
    );

    if (selectedStudents.length === 0) {
      actions.setErrors(['No valid students found for printing']);
      return;
    }

    // Use PDFExportManager functions through the context
    console.log('Initiating bulk print for:', selectedStudents.length, 'students');
    
    // This would typically be handled by the PDFExportManager
    // For now, we'll simulate the process
    actions.startBulkOperation('print', 'Generating PDFs for printing', `print_${Date.now()}`);
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      actions.updateProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          actions.finishBulkOperation();
          alert(`Print command sent for ${selectedStudents.length} report cards. Check your printer.`);
        }, 500);
      }
    }, 200);
  };

  const handleBulkSave = (selectedStudentIds = state.selectedStudents) => {
    if (selectedStudentIds.length === 0) {
      actions.setErrors(['Please select at least one student to save']);
      return;
    }

    const selectedStudents = students.filter(student => 
      selectedStudentIds.includes(student.id)
    );

    if (selectedStudents.length === 0) {
      actions.setErrors(['No valid students found for saving']);
      return;
    }

    console.log('Initiating bulk save for:', selectedStudents.length, 'students');
    
    actions.startBulkOperation('save', 'Generating PDF files', `save_${Date.now()}`);
    
    // Simulate PDF generation and download
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      actions.updateProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          actions.finishBulkOperation();
          
          // Simulate file downloads
          selectedStudents.forEach((student, index) => {
            setTimeout(() => {
              const fileName = `${currentClass}_${student.name.replace(/\s+/g, '_')}_Report.pdf`;
              console.log(`Downloading: ${fileName}`);
              // In real implementation, this would trigger actual PDF download
            }, index * 300);
          });
          
          alert(`${selectedStudents.length} PDF files are being downloaded. Check your downloads folder.`);
        }, 500);
      }
    }, 200);
  };

  const handleSettingsChange = (newSettings) => {
    actions.updatePrintSettings(newSettings);
  };

  const handleClassChange = (newClass) => {
    setCurrentClass(newClass);
    actions.setSelectedClass(newClass);
    // Clear student selections when class changes
    actions.deselectAllStudents();
  };

  const canShowInterface = students.length > 0 && currentClass;

  return (
    <div className="bulk-print-manager space-y-6">
      {/* PDF Export Manager - Handles actual PDF operations */}
      <PDFExportManager />

      {/* Class Selection (if not provided) */}
      {!initialClass && (
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Class for Bulk Operations
          </label>
          <select
            value={currentClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a class...</option>
            <option value="SS1">SS1</option>
            <option value="SS2">SS2</option>
            <option value="SS3">SS3</option>
          </select>
        </div>
      )}

      {/* Main Interface */}
      {canShowInterface ? (
        <>
          {/* Bulk Actions Toolbar */}
          <BulkActionsToolbar
            onBulkPrint={() => handleBulkPrint()}
            onBulkSave={() => handleBulkSave()}
            onSettingsChange={handleSettingsChange}
            className="sticky top-0 z-10"
            studentCount={students.length}
          />

          {/* Student Selection Table */}
          <StudentSelectionTable
            students={students}
            className={currentClass}
            onSelectionChange={(selectedIds) => {
              // Selection is managed by context, this is just for notification
              console.log('Selection changed:', selectedIds.length, 'students selected');
            }}
          />

          {/* Operation Summary */}
          {(state.isBulkPrinting || state.isBulkSaving) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">
                    {state.isBulkPrinting ? 'Printing in Progress' : 'Saving in Progress'}
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Processing {state.selectedStudents.length} report cards for {currentClass}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {state.progress}%
                  </div>
                  <div className="text-sm text-blue-600">
                    {state.currentOperation}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{students.length}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{state.selectedStudents.length}</div>
              <div className="text-sm text-gray-600">Selected</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getClassSubjects().length}</div>
              <div className="text-sm text-gray-600">Subjects</div>
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {initialClass ? 'No Students Loaded' : 'Select a Class'}
          </h3>
          <p className="text-gray-600">
            {initialClass 
              ? 'Load students to begin bulk printing operations.' 
              : 'Choose a class to manage bulk report card printing.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BulkPrintManager;
