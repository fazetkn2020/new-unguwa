import React from "react";

const ReportSheet = ({ student, examData, currentClass, term = "Second", year = "2025" }) => {
  if (!student) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-700">Select a student to view report card</p>
      </div>
    );
  }

  // Grading system A-F
  const getGrade = (total) => {
    if (total >= 70) return { grade: "A", remark: "Excellent" };
    if (total >= 60) return { grade: "B", remark: "Very Good" };
    if (total >= 50) return { grade: "C", remark: "Good" };
    if (total >= 45) return { grade: "D", remark: "Fair" };
    if (total >= 40) return { grade: "E", remark: "Pass" };
    return { grade: "F", remark: "Fail" };
  };

  const studentIdentifier = `${currentClass}_${student.fullName.replace(/\s+/g, '_')}`;
  const studentScores = examData[studentIdentifier] || {};

  // Get top 9 subjects (or all if less than 9)
  const subjects = Object.keys(studentScores).slice(0, 9);
  
  // Calculate totals and grades
  const subjectResults = subjects.map(subject => {
    const scores = studentScores[subject] || { ca: '', exam: '', total: 0 };
    const total = scores.total || 0;
    const { grade, remark } = getGrade(total);
    
    return {
      subject,
      ca: scores.ca || '',
      exam: scores.exam || '',
      total,
      grade,
      remark
    };
  });

  // Calculate overall average
  const totalScore = subjectResults.reduce((sum, result) => sum + result.total, 0);
  const average = subjectResults.length > 0 ? (totalScore / subjectResults.length).toFixed(1) : 0;
  const overallGrade = getGrade(average);

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 max-w-4xl mx-auto">
      {/* School Header */}
      <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">SCHOOL MANAGEMENT SYSTEM</h1>
        <h2 className="text-xl font-semibold text-gray-700">STUDENT REPORT CARD</h2>
        <p className="text-gray-600">{term} Term {year}</p>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Student Name:</strong> {student.fullName}</p>
          <p><strong>Class:</strong> {currentClass}</p>
        </div>
        <div>
          <p><strong>Term:</strong> {term}</p>
          <p><strong>Academic Year:</strong> {year}</p>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-center">ACADEMIC PERFORMANCE</h3>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2">Subject</th>
              <th className="border border-gray-400 p-2">CA (40)</th>
              <th className="border border-gray-400 p-2">Exam (60)</th>
              <th className="border border-gray-400 p-2">Total (100)</th>
              <th className="border border-gray-400 p-2">Grade</th>
              <th className="border border-gray-400 p-2">Remark</th>
            </tr>
          </thead>
          <tbody>
            {subjectResults.map((result, index) => (
              <tr key={result.subject} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-400 p-2 font-medium">{result.subject}</td>
                <td className="border border-gray-400 p-2 text-center">{result.ca}</td>
                <td className="border border-gray-400 p-2 text-center">{result.exam}</td>
                <td className="border border-gray-400 p-2 text-center font-semibold">{result.total}</td>
                <td className="border border-gray-400 p-2 text-center font-bold">{result.grade}</td>
                <td className="border border-gray-400 p-2 text-center">{result.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <p className="font-semibold">Total Subjects</p>
          <p className="text-xl font-bold">{subjectResults.length}</p>
        </div>
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <p className="font-semibold">Overall Average</p>
          <p className="text-xl font-bold">{average}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded border border-purple-200">
          <p className="font-semibold">Overall Grade</p>
          <p className="text-xl font-bold">{overallGrade.grade}</p>
        </div>
      </div>

      {/* Comments Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-bold mb-2">Form Master's Comments:</h4>
          <div className="border border-gray-400 p-3 h-24 rounded bg-gray-50">
            {/* Space for written comments */}
          </div>
          <div className="mt-4 text-center border-t border-gray-300 pt-2">
            <p>Form Master's Signature</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-2">Principal's Comments:</h4>
          <div className="border border-gray-400 p-3 h-24 rounded bg-gray-50">
            {/* Space for written comments */}
          </div>
          <div className="mt-4 text-center border-t border-gray-300 pt-2">
            <p>Principal's Signature</p>
          </div>
        </div>
      </div>

      {/* Grading Key */}
      <div className="bg-gray-100 p-3 rounded border border-gray-300 text-sm">
        <p className="font-semibold mb-1">Grading System:</p>
        <div className="grid grid-cols-3 gap-2">
          <span>A: 70-100 (Excellent)</span>
          <span>B: 60-69 (Very Good)</span>
          <span>C: 50-59 (Good)</span>
          <span>D: 45-49 (Fair)</span>
          <span>E: 40-44 (Pass)</span>
          <span>F: 0-39 (Fail)</span>
        </div>
      </div>
    </div>
  );
};

export default ReportSheet;
