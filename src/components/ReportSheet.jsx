import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { schoolConfig } from "../data/schoolConfig";
import { getStudentPosition } from "../utils/positionCalculator";
import { getStudentSubjects } from "../data/subjects";

const ReportSheet = ({
  student,
  examData,
  currentClass,
  students,
  term = "Second",
  year = "2024/2025",
}) => {
  const reportRef = useRef();

  if (!student) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-700">Select a student to view report card</p>
      </div>
    );
  }

  // FIXED: Use the same student identifier format as ExamBank
  const getStudentIdentifier = (student, className) => {
    if (!student) return "";
    return `${student.id}-${className}`;
  };

  const studentIdentifier = getStudentIdentifier(student, currentClass);
  
  // FIXED: Calculate position based on total scores
  const calculateStudentPosition = () => {
    const studentsWithScores = students
      .map(s => {
        const sid = getStudentIdentifier(s, currentClass);
        const scores = examData[sid] || {};
        const totalMarks = Object.values(scores).reduce((sum, subject) => 
          sum + (subject.total || 0), 0
        );
        return { ...s, totalMarks };
      })
      .filter(s => s.totalMarks > 0)
      .sort((a, b) => b.totalMarks - a.totalMarks);

    const currentStudentIndex = studentsWithScores.findIndex(
      s => s.id === student.id
    );

    if (currentStudentIndex === -1) return null;

    return {
      position: currentStudentIndex + 1,
      totalStudents: studentsWithScores.length,
      totalMarks: studentsWithScores[currentStudentIndex].totalMarks
    };
  };

  const studentPosition = calculateStudentPosition();

  const getGrade = (total) => {
    if (total >= 70) return { grade: "A", remark: "Excellent" };
    if (total >= 60) return { grade: "B", remark: "Very Good" };
    if (total >= 50) return { grade: "C", remark: "Good" };
    if (total >= 45) return { grade: "D", remark: "Fair" };
    if (total >= 40) return { grade: "E", remark: "Pass" };
    return { grade: "F", remark: "Fail" };
  };

  // FIXED: Use the correct student identifier
  const studentScores = examData[studentIdentifier] || {};

  // Get ALL subjects for the class
  const allSubjects = getStudentSubjects(student.id, currentClass);

  const subjectResults = allSubjects.map((subject) => {
    const scores = studentScores[subject] || { ca: "", exam: "", total: 0 };
    const total = scores.total || 0;
    const gradeInfo = getGrade(total);

    return {
      subject,
      ca: scores.ca || "-",
      exam: scores.exam || "-",
      total,
      grade: gradeInfo.grade,
      remark: gradeInfo.remark,
    };
  });

  // Calculate totals only for subjects with actual scores
  const subjectsWithScores = subjectResults.filter(subj => subj.ca !== "-" && subj.exam !== "-");
  const totalScore = subjectsWithScores.reduce((sum, r) => sum + r.total, 0);
  const average = subjectsWithScores.length > 0
    ? (totalScore / subjectsWithScores.length).toFixed(1)
    : 0;

  // FIXED: Calculate maximum possible marks
  const maxPossibleMarks = allSubjects.length * 100;

  const handlePrint = () => {
    window.print();
  };

  // FIXED: Optimized PDF generation for smaller file size
  const handleSavePDF = async () => {
    try {
      const element = reportRef.current;
      
      // Optimize canvas settings for smaller file size
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced from 2 to 1.5
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        removeContainer: true,
        imageTimeout: 0
      });

      // Convert to JPEG with lower quality for smaller file size
      const imgData = canvas.toDataURL('image/jpeg', 0.8); // 80% quality
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to fit A4
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      // Add image to PDF with compression
      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio, undefined, 'FAST');
      
      // Save PDF with proper filename
      const fileName = `${student.fullName}_${currentClass}_Report_${term}_Term_${year}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please use the Print button instead.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-3 mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          Print Report
        </button>
        <button
          onClick={handleSavePDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Save as PDF
        </button>
      </div>

      <div
        ref={reportRef}
        className="bg-white border border-gray-400 shadow-lg mx-auto w-full p-4 print:shadow-none print:border print:p-2 report-sheet-container"
        style={{
          width: '210mm',
          minHeight: '297mm',
          pageBreakInside: 'avoid',
          pageBreakAfter: 'avoid'
        }}
      >
        {/* School Header */}
        <div className="text-center border-b-2 border-gray-600 pb-2 mb-3">
          <h1 className="text-xl font-bold uppercase">{schoolConfig.name}</h1>
          <p className="text-sm font-semibold">{schoolConfig.zone}</p>
          <p className="text-sm">{schoolConfig.address}</p>
          <p className="italic text-gray-600 text-xs mt-1">{schoolConfig.motto}</p>
          <h2 className="mt-2 font-semibold text-lg">
            {term} Term Report Sheet – {year} Academic Session
          </h2>
        </div>

        {/* Student Information - FIXED: Added Total Marks */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div>
            <p><strong>Name:</strong> {student.fullName}</p>
            <p><strong>Admission No:</strong> {student.admissionNumber || "N/A"}</p>
            <p><strong>Class:</strong> {currentClass}</p>
          </div>
          <div>
            <p>
              <strong>Position:</strong>{" "}
              {studentPosition
                ? `${studentPosition.position} of ${studentPosition.totalStudents}`
                : "N/A"}
            </p>
            <p><strong>Average Score:</strong> {average}%</p>
            <p><strong>Total Marks:</strong> {totalScore} / {maxPossibleMarks}</p>
          </div>
        </div>

        {/* Performance Summary - NEW: Added performance indicators */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>
              <strong>Subjects Taken:</strong> {allSubjects.length}
            </div>
            <div>
              <strong>Subjects Scored:</strong> {subjectsWithScores.length}
            </div>
            <div>
              <strong>Total Marks:</strong> {totalScore}
            </div>
            <div>
              <strong>Class Position:</strong> {studentPosition ? studentPosition.position : 'N/A'}
            </div>
          </div>
        </div>

        {/* Results Table */}
        <table className="w-full text-xs border border-gray-400 mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-400 p-1 text-left w-1/3">Subject</th>
              <th className="border border-gray-400 p-1 w-1/8">CA (40)</th>
              <th className="border border-gray-400 p-1 w-1/8">Exam (60)</th>
              <th className="border border-gray-400 p-1 w-1/8">Total (100)</th>
              <th className="border border-gray-400 p-1 w-1/8">Grade</th>
              <th className="border border-gray-400 p-1 w-1/4">Remark</th>
            </tr>
          </thead>
          <tbody>
            {subjectResults.map((r, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-400 p-1 font-medium">{r.subject}</td>
                <td className="border border-gray-400 p-1 text-center">{r.ca}</td>
                <td className="border border-gray-400 p-1 text-center">{r.exam}</td>
                <td className="border border-gray-400 p-1 text-center font-semibold">
                  {r.total > 0 ? r.total : "-"}
                </td>
                <td className="border border-gray-400 p-1 text-center">{r.grade}</td>
                <td className="border border-gray-400 p-1 text-center text-xs">{r.remark}</td>
              </tr>
            ))}
          </tbody>
          {/* Footer with totals - NEW */}
          <tfoot className="bg-gray-100 font-semibold">
            <tr>
              <td className="border border-gray-400 p-1 text-right">TOTAL:</td>
              <td className="border border-gray-400 p-1 text-center">
                {subjectResults.reduce((sum, r) => sum + (parseInt(r.ca) || 0), 0)}
              </td>
              <td className="border border-gray-400 p-1 text-center">
                {subjectResults.reduce((sum, r) => sum + (parseInt(r.exam) || 0), 0)}
              </td>
              <td className="border border-gray-400 p-1 text-center bg-blue-100">
                {totalScore}
              </td>
              <td className="border border-gray-400 p-1 text-center" colSpan="2">
                Average: {average}%
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Grading Legend */}
        <div className="text-xs mb-4 p-2 bg-gray-50 border border-gray-300">
          <p className="font-semibold mb-1">Grading System:</p>
          <div className="grid grid-cols-3 gap-1">
            <span>A: 70-100% (Excellent)</span>
            <span>B: 60-69% (Very Good)</span>
            <span>C: 50-59% (Good)</span>
            <span>D: 45-49% (Fair)</span>
            <span>E: 40-44% (Pass)</span>
            <span>F: 0-39% (Fail)</span>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="mt-6 border-t border-gray-400 pt-4">
          <div className="grid grid-cols-2 gap-8 text-sm">
            {/* Form Master Section */}
            <div className="text-center">
              <div className="mb-2 border-t border-gray-400 mt-8 pt-1">
                <p className="font-semibold">Form Master's Signature</p>
              </div>
              <p className="text-xs text-gray-600 mb-1">Name: ___________________</p>
              <p className="text-xs text-gray-600">Date: ___________________</p>
              <div className="mt-2 text-left">
                <p className="font-semibold mb-1">Form Master's Comment:</p>
                <div className="border border-gray-300 h-16 p-1 text-xs">
                  _________________________________
                </div>
              </div>
            </div>

            {/* Principal Section */}
            <div className="text-center">
              <div className="mb-2 border-t border-gray-400 mt-8 pt-1">
                <p className="font-semibold">Principal's Signature</p>
              </div>
              <p className="text-xs text-gray-600 mb-1">Name: ___________________</p>
              <p className="text-xs text-gray-600">Date: ___________________</p>
              <div className="mt-2 text-left">
                <p className="font-semibold mb-1">Principal's Comment:</p>
                <div className="border border-gray-300 h-16 p-1 text-xs">
                  _________________________________
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-300 pt-2">
          <p>Generated on: {new Date().toLocaleDateString()}</p>
          <p>© {new Date().getFullYear()} {schoolConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ReportSheet;
