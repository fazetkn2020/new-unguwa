// src/components/ReportSheet.jsx
import React, { useRef } from "react";
import jsPDF from "jspdf";
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
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${student.fullName}_report.pdf`);
  };

  return (
    <div className="flex flex-col items-center">
      {/* 🔹 Top Buttons (only two: Print + Save) */}
      <div className="flex gap-3 mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          Print Report Card
        </button>

        <button
          onClick={handleSavePDF}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Save as PDF
        </button>
      </div>

      {/* Report Sheet */}
      <div
        ref={reportRef}
        className="bg-white border border-gray-400 shadow-lg mx-auto max-w-4xl p-4 print:shadow-none print:border print:p-2"
      >
        {/* Header */}
        <div className="text-center border-b-4 border-gray-600 pb-2 mb-2">
          <h1 className="text-xl font-bold uppercase">{schoolConfig.name}</h1>
          <p className="text-sm">{schoolConfig.zone}</p>
          <p className="italic text-gray-600 text-xs">{schoolConfig.motto}</p>
          <h2 className="mt-1 font-semibold">
            {term} Term Report Sheet – {year}
          </h2>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 text-sm mb-2">
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

        {/* Subjects Table */}
        <table className="w-full text-xs border border-gray-400 mb-3">
          <thead className="bg-gray-100">
            <tr className="border border-gray-400 text-[11px]">
              <th className="border p-1">Subject</th>
              <th className="border p-1">CA (40)</th>
              <th className="border p-1">Exam (60)</th>
              <th className="border p-1">Total (100)</th>
              <th className="border p-1">Grade</th>
              <th className="border p-1">Remark</th>
            </tr>
          </thead>
          <tbody>
            {subjectResults.map((r, idx) => (
              <tr key={idx} className="text-center">
                <td className="border p-1 text-left">{r.subject}</td>
                <td className="border p-1">{r.ca}</td>
                <td className="border p-1">{r.exam}</td>
                <td className="border p-1 font-semibold">{r.total}</td>
                <td className="border p-1">{r.grade}</td>
                <td className="border p-1">{r.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Comments */}
        <div className="mt-3 text-sm">
          <p className="mb-2">
            <strong>Form Master’s Comment:</strong> ____________________________________________
          </p>
          <p className="mb-1">
            <strong>Principal’s Comment:</strong> ______________________________________________
          </p>
          <p className="text-xs mt-2">
            <strong>Principal’s Signature:</strong> ______________________
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportSheet;
