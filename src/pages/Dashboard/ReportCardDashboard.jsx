import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useExam } from "../../context/ExamContext";
import ReportSheet from "../../components/ReportSheet";
import html2pdf from 'html2pdf.js';

export default function ReportCardDashboard() {
  const { user } = useAuth();
  const { examData } = useExam();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const reportRef = useRef();

  const canAccessReports = user?.role === "Principal" || user?.role === "Exam Officer";
  const canPrintReports = user?.role === "Exam Officer";

  useEffect(() => {
    if (canAccessReports) {
      loadClasses();
    }
  }, [canAccessReports]);

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

  // Use consistent student identifier format
  const getStudentIdentifier = (student, className) => {
    if (!student) return "";
    return `${student.id}-${className}`;
  };

  // Professional print function
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Report Card - ${selectedStudent?.fullName}</title>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              background: white;
            }
            .report-container {
              max-width: 1000px;
              margin: 0 auto;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            ${reportRef.current.innerHTML}
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

  // Generate PDF for saving and sending to parents
  const handleSavePDF = async () => {
    if (!reportRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const element = reportRef.current;
      const opt = {
        margin: 10,
        filename: `Report_Card_${selectedStudent?.fullName}_${selectedClass}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!canAccessReports) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">
            Report card access is restricted to Principal and Exam Officer only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Report Card Generator</h2>
      
      {/* Class and Student Selection */}
      <div className="bg-white rounded-lg shadow border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">Choose a class</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <div>
              <label className="block text-sm font-medium mb-2">Select Student:</label>
              <select
                value={selectedStudent?.fullName || ""}
                onChange={(e) => {
                  const student = students.find(s => s.fullName === e.target.value);
                  setSelectedStudent(student);
                }}
                className="p-2 border rounded w-full"
              >
                <option value="">Choose a student</option>
                {students.map(student => {
                  // Check if student has scores in exam data
                  const studentId = getStudentIdentifier(student, selectedClass);
                  const hasScores = examData[studentId] && Object.keys(examData[studentId]).length > 0;
                  
                  return (
                    <option key={student.fullName} value={student.fullName}>
                      {student.fullName} {hasScores ? '✅' : '❌'}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {canPrintReports && selectedStudent && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2"
            >
              🖨️ Print Report
            </button>
            
            <button
              onClick={handleSavePDF}
              disabled={isGeneratingPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2 disabled:bg-gray-400"
            >
              {isGeneratingPDF ? '⏳' : '💾'} 
              {isGeneratingPDF ? 'Generating PDF...' : 'Save as PDF'}
            </button>
          </div>
        )}
      </div>

      {/* Report Preview */}
      {selectedStudent && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Report Preview</h3>
            <p className="text-sm text-gray-600">
              Ready for printing or saving as PDF to send to parents
            </p>
          </div>
          
          <div ref={reportRef}>
            <ReportSheet
              student={selectedStudent}
              examData={examData}
              currentClass={selectedClass}
              students={students}
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedStudent && selectedClass && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-700 mb-4">
            Select a student from {selectedClass} to view and generate their report card
          </p>
          <div className="text-sm text-blue-600 space-y-2">
            <p>• ✅ Students with checkmarks have scores entered</p>
            <p>• ❌ Students without checkmarks need scores from teachers</p>
            <p>• PDF reports can be saved and sent to parents via email</p>
            <p>• Print reports for physical distribution</p>
          </div>
        </div>
      )}

      {/* No Class Selected */}
      {!selectedClass && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-700">
            Select a class above to view students and generate report cards
          </p>
        </div>
      )}
    </div>
  );
}
