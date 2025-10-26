import React from "react";
import { getStudentIdentifier } from "../../utils/studentUtils";

const ScoreEntryTable = ({
  students,
  selectedSubject,
  examData,
  updateScore,
  readOnly = false,
  currentClass = "",
}) => {
  const handleScoreChange = (studentIdentifier, scoreType, value) => {
    console.log("Score change:", { studentIdentifier, selectedSubject, scoreType, value });
    console.log("updateScore function exists:", !!updateScore);

    if (readOnly) return;
    if (!updateScore) {
      console.error("updateScore function is not available!");
      return;
    }

    let numericValue = value === "" ? "" : parseInt(value);
    if (numericValue !== "" && isNaN(numericValue)) numericValue = 0;

    if (numericValue !== "") {
      if (scoreType === "ca") numericValue = Math.max(0, Math.min(40, numericValue));
      if (scoreType === "exam") numericValue = Math.max(0, Math.min(60, numericValue));
    }

    updateScore(studentIdentifier, selectedSubject, scoreType, numericValue);
  };

  const getStudentScore = (studentIdentifier) => {
    return examData[studentIdentifier]?.[selectedSubject] || { ca: "", exam: "", total: "" };
  };

  const calculateTotal = (ca, exam) => {
    const caScore = ca === "" ? 0 : parseInt(ca);
    const examScore = exam === "" ? 0 : parseInt(exam);
    return Math.min(100, caScore + examScore);
  };

  // Debug info
  console.log("ScoreEntryTable Debug:");
  console.log("currentClass:", currentClass);
  console.log("selectedSubject:", selectedSubject);
  console.log("students count:", students.length);
  console.log("updateScore provided:", !!updateScore);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-slate-900 text-slate-200 rounded-lg shadow-lg">
        <thead className="bg-slate-700/80">
          <tr>
            <th className="py-3 px-4 border-b border-slate-600 text-left rounded-tl-lg">#</th>
            <th className="py-3 px-4 border-b border-slate-600 text-left">Student Name</th>
            <th className="py-3 px-4 border-b border-slate-600 text-center">CA Score (0-40)</th>
            <th className="py-3 px-4 border-b border-slate-600 text-center">Exam Score (0-60)</th>
            <th className="py-3 px-4 border-b border-slate-600 text-center rounded-tr-lg">Total (0-100)</th>
            <th className="py-3 px-4 border-b border-slate-600 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            const studentIdentifier = getStudentIdentifier(student, currentClass);
            const scores = getStudentScore(studentIdentifier);
            const isComplete = scores.ca !== "" && scores.exam !== "";
            const total = calculateTotal(scores.ca, scores.exam);

            return (
              <tr key={studentIdentifier} className="hover:bg-slate-800/50 border-b border-slate-700">
                <td className="py-3 px-4 font-medium">{index + 1}</td>
                <td className="py-3 px-4 font-medium text-teal-300">{student.fullName}</td>

                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={scores.ca === "" ? "" : scores.ca}
                    onChange={(e) => handleScoreChange(studentIdentifier, "ca", e.target.value)}
                    className="w-20 p-1 border rounded text-center mx-auto block focus:ring-2 focus:ring-cyan-500 bg-slate-700/80 border-slate-600 text-slate-100"
                    placeholder="0"
                    disabled={readOnly}
                  />
                  <div className="text-xs text-slate-500 text-center mt-1">Max: 40</div>
                </td>

                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={scores.exam === "" ? "" : scores.exam}
                    onChange={(e) => handleScoreChange(studentIdentifier, "exam", e.target.value)}
                    className="w-20 p-1 border rounded text-center mx-auto block focus:ring-2 focus:ring-cyan-500 bg-slate-700/80 border-slate-600 text-slate-100"
                    placeholder="0"
                    disabled={readOnly}
                  />
                  <div className="text-xs text-slate-500 text-center mt-1">Max: 60</div>
                </td>

                <td className="py-3 px-4 text-center font-semibold">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      total >= 70
                        ? "bg-emerald-600 text-white"
                        : total >= 50
                        ? "bg-cyan-600 text-white"
                        : total >= 40
                        ? "bg-yellow-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {total}
                  </span>
                </td>

                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      isComplete
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {isComplete ? "Complete" : "Pending"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreEntryTable;
