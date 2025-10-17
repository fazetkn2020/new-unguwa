import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useExam } from "../../context/ExamContext";
import ReportSheet from "../../components/ReportSheet";

export default function ReportCardDashboard() {
  const { user } = useAuth();
  const { examData } = useExam();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

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
      {/* Dashboard Controls - Hidden when printing */}
      <div className="bg-white rounded-lg shadow border p-6 mb-6 no-print">
        <h1 className="text-2xl font-bold mb-2">Report Card System</h1>
        <p className="text-gray-600 mb-4">
          {user.role === "Exam Officer" 
            ? "Generate and print student report cards" 
            : "View student academic reports"
          }
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="p-2 border rounded w-48"
          >
            <option value="">Choose a class</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {selectedClass && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Student:</label>
            <select
              value={selectedStudent?.fullName || ""}
              onChange={(e) => {
                const student = students.find(s => s.fullName === e.target.value);
                setSelectedStudent(student);
              }}
              className="p-2 border rounded w-64"
            >
              <option value="">Choose a student</option>
              {students.map(student => (
                <option key={student.fullName} value={student.fullName}>
                  {student.fullName}
                </option>
              ))}
            </select>
          </div>
        )}

        {canPrintReports && selectedStudent && (
          <div className="mb-6 flex gap-4">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              🖨️ Print Report Card
            </button>
          </div>
        )}
      </div>

      {/* Report Card Display */}
      {selectedStudent && (
        <div ref={reportRef} className="print:block">
          <ReportSheet
            student={selectedStudent}
            examData={examData}
            currentClass={selectedClass}
            students={students}
          />
        </div>
      )}

      {!selectedStudent && selectedClass && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center no-print">
          <p className="text-blue-700">
            Select a student from {selectedClass} to view their report card
          </p>
        </div>
      )}
    </div>
  );
}
