// src/components/ReportSheet.jsx
import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { schoolConfig } from "../data/schoolConfig";
import { getStudentPosition } from "../utils/positionCalculator";

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

  const studentPosition = getStudentPosition(
    students,
    examData,
    currentClass,
    student.fullName
  );

  const getGrade = (total) => {
    if (total >= 70) return { grade: "A", remark: "Excellent" };
    if (total >= 60) return { grade: "B", remark: "Very Good" };
    if (total >= 50) return { grade: "C", remark: "Good" };
    if (total >= 45) return { grade: "D", remark: "Fair" };
    if (total >= 40) return { grade: "E", remark: "Pass" };
    return { grade: "F", remark: "Fail" };
  };

  const studentIdentifier = `${currentClass}_${student.fullName.replace(/\s+/g, "_")}`;
  const studentScores = examData[studentIdentifier] || {};
  const subjects = Object.keys(studentScores);

  const subjectResults = subjects.map((subject) => {
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

  const totalScore = subjectResults.reduce((sum, r) => sum + r.total, 0);
  const average =
    subjectResults.length > 0
      ? (totalScore / subjectResults.length).toFixed(1)
      : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = async () => {
    try {
      const element = reportRef.current;
      
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `${student.fullName}_report.png`;
      link.href = canvas.toDataURL();
      link.click();
      
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
          Save as Image
        </button>
      </div>

      <div
        ref={reportRef}
        className="bg-white border border-gray-400 shadow-lg mx-auto w-full max-w-3xl p-4 print:shadow-none print:border print:p-2 report-sheet-container"
        style={{ 
          width: '210mm',
          minHeight: '297mm',
          pageBreakInside: 'avoid'
        }}
      >
        <div className="text-center border-b-2 border-gray-600 pb-2 mb-3">
          <h1 className="text-xl font-bold uppercase">{schoolConfig.name}</h1>
          <p className="text-sm">{schoolConfig.zone}</p>
          <p className="italic text-gray-600 text-xs">{schoolConfig.motto}</p>
          <h2 className="mt-1 font-semibold">
            {term} Term Report Sheet – {year}
          </h2>
        </div>

        <div className="grid grid-cols-2 text-sm mb-3">
          <p><strong>Name:</strong> {student.fullName}</p>
          <p><strong>Class:</strong> {currentClass}</p>
          <p>
            <strong>Position:</strong>{" "}
            {studentPosition
              ? `${studentPosition.displayPosition} of ${studentPosition.totalStudents}`
              : "N/A"}
          </p>
          <p><strong>Average:</strong> {average}%</p>
        </div>

        <table className="w-full text-sm border border-gray-400 mb-3">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-1 text-left">Subject</th>
              <th className="border p-1">CA (40)</th>
              <th className="border p-1">Exam (60)</th>
              <th className="border p-1">Total (100)</th>
              <th className="border p-1">Grade</th>
              <th className="border p-1">Remark</th>
            </tr>
          </thead>
          <tbody>
            {subjectResults.map((r, idx) => (
              <tr key={idx}>
                <td className="border p-1">{r.subject}</td>
                <td className="border p-1 text-center">{r.ca}</td>
                <td className="border p-1 text-center">{r.exam}</td>
                <td className="border p-1 text-center font-semibold">{r.total}</td>
                <td className="border p-1 text-center">{r.grade}</td>
                <td className="border p-1 text-center">{r.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 text-sm">
          <p className="mb-2"><strong>Form Master's Comment:</strong> ___________________</p>
          <p className="mb-2"><strong>Principal's Comment:</strong> ___________________</p>
          <p><strong>Principal's Signature:</strong> ___________________</p>
        </div>
      </div>
    </div>
  );
};

export default ReportSheet;