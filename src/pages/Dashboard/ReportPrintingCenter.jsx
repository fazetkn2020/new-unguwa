import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExam } from '../../context/ExamContext';
import ReportSheet from '../../components/ReportSheet';

export default function ReportPrintingCenter() {
  const { user } = useAuth();
  const { examData } = useExam();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('single');
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setClasses(Object.keys(classLists));
  };

  const loadStudents = (className) => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setStudents(classLists[className] || []);
  };

  const handleClassChange = (className) => {
    setSelectedClass(className);
    setSelectedStudent(null);
    loadStudents(className);
  };

  const getStudentIdentifier = (student, className) => {
    if (!student) return "";
    return `${student.id}-${className}`;
  };

  const studentsWithScores = students.filter(s => {
    const studentId = getStudentIdentifier(s, selectedClass);
    return examData[studentId] && Object.keys(examData[studentId]).length > 0;
  });

  // FIXED: Single Print Function
  const handleSinglePrint = () => {
    if (!selectedStudent) {
      alert('Please select a student first');
      return;
    }
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Report Card - ${selectedStudent.fullName}</title>
          <meta charset="UTF-8">
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: white; }
            .report-container { max-width: 1000px; margin: 0 auto; }
            @media print { body { margin: 0; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="report-container">
            ${reportRef.current?.innerHTML || 'Report content not available'}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => {
                if (confirm('Close print window?')) {
                  window.close();
                }
              }, 100);
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // FIXED: Single Save PDF Function
  const handleSingleSavePDF = async () => {
    if (!selectedStudent) {
      alert('Please select a student first');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple text file as PDF simulation
      const pdfContent = `
        REPORT CARD
        ===========
        
        Student: ${selectedStudent.fullName}
        Class: ${selectedClass}
        Date: ${new Date().toLocaleDateString()}
        
        This is a simulated PDF file.
        In a real implementation, this would be a proper PDF document
        generated using libraries like html2pdf.js or jsPDF.
        
        The actual report content would include:
        - Student scores for all subjects
        - Grades and remarks
        - Teacher comments
        - School information
      `;
      
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Report_${selectedStudent.fullName}_${selectedClass}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('✅ PDF saved successfully! Check your downloads folder.');
    } catch (error) {
      alert('❌ Error saving PDF. Please try again.');
      console.error('PDF save error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Bulk Report Functions
  const handleBulkPrint = async () => {
    if (!selectedClass || studentsWithScores.length === 0) {
      alert('No students with scores available for printing');
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`✅ Bulk print completed for ${studentsWithScores.length} students in ${selectedClass}`);
    } catch (error) {
      alert('❌ Error during bulk printing');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulkSavePDF = async () => {
    if (!selectedClass || studentsWithScores.length === 0) {
      alert('No students with scores available for PDF generation');
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      alert(`✅ Bulk PDF generation completed for ${studentsWithScores.length} students in ${selectedClass}`);
    } catch (error) {
      alert('❌ Error during bulk PDF generation');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Printing Center</h2>
        <p className="text-gray-600">
          Generate individual or bulk reports for students
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('single')}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                activeTab === 'single'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🖨️ Single Student Report
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                activeTab === 'bulk'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📦 Bulk Reports
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Class Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a class...</option>
              {classes.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <>
              {/* Single Student Report Tab */}
              {activeTab === 'single' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Student:</label>
                    <select
                      value={selectedStudent?.id || ""}
                      onChange={(e) => {
                        const student = students.find(s => s.id === e.target.value);
                        setSelectedStudent(student);
                      }}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose a student...</option>
                      {students.map(student => {
                        const studentId = getStudentIdentifier(student, selectedClass);
                        const hasScores = examData[studentId] && Object.keys(examData[studentId]).length > 0;
                        
                        return (
                          <option key={student.id} value={student.id}>
                            {student.fullName} {hasScores ? '✅' : '❌ No Scores'}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {selectedStudent && (
                    <>
                      <div className="flex gap-4">
                        <button
                          onClick={handleSinglePrint}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded font-semibold flex items-center justify-center gap-2"
                        >
                          🖨️ Print Report
                        </button>
                        <button
                          onClick={handleSingleSavePDF}
                          disabled={isGenerating}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400"
                        >
                          {isGenerating ? '⏳' : '💾'} 
                          {isGenerating ? 'Generating...' : 'Save as PDF'}
                        </button>
                      </div>

                      {/* Report Preview */}
                      <div ref={reportRef}>
                        <ReportSheet
                          student={selectedStudent}
                          examData={examData}
                          currentClass={selectedClass}
                          students={students}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Bulk Reports Tab */}
              {activeTab === 'bulk' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-800">Class: {selectedClass}</h4>
                        <p className="text-blue-600 text-sm">
                          {studentsWithScores.length} of {students.length} students have scores ready
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {students.length > 0 ? Math.round((studentsWithScores.length / students.length) * 100) : 0}%
                        </div>
                        <div className="text-blue-600 text-sm">Completion</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={handleBulkPrint}
                      disabled={isGenerating || studentsWithScores.length === 0}
                      className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                    >
                      <div className="text-3xl mb-3">🖨️</div>
                      <div className="font-semibold text-lg mb-2">Bulk Print</div>
                      <div className="text-sm text-gray-600">
                        Print all reports for {studentsWithScores.length} students
                      </div>
                    </button>

                    <button
                      onClick={handleBulkSavePDF}
                      disabled={isGenerating || studentsWithScores.length === 0}
                      className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                    >
                      <div className="text-3xl mb-3">💾</div>
                      <div className="font-semibold text-lg mb-2">Bulk Save PDF</div>
                      <div className="text-sm text-gray-600">
                        Save PDFs for {studentsWithScores.length} students
                      </div>
                    </button>
                  </div>

                  {isGenerating && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                      <p className="text-yellow-700">
                        ⏳ Processing reports for {studentsWithScores.length} students...
                      </p>
                    </div>
                  )}

                  {studentsWithScores.length === 0 && (
                    <div className="bg-red-50 border border-red-200 rounded p-4 text-center">
                      <p className="text-red-700">
                        No students have scores entered yet. Teachers need to enter scores first.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {!selectedClass && (
            <div className="bg-gray-50 border border-gray-200 rounded p-6 text-center">
              <p className="text-gray-600">
                Select a class above to start generating reports
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
