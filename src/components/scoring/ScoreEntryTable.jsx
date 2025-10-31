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
    console.log("🔄 Score change triggered:", { studentIdentifier, scoreType, value });
    console.log("📝 updateScore function:", updateScore);
    console.log("📚 selectedSubject:", selectedSubject);
    
    if (readOnly) {
      console.log("❌ Read-only mode");
      return;
    }
    if (!updateScore) {
      console.error("❌ updateScore function is not available!");
      return;
    }

    let numericValue = value === "" ? "" : parseInt(value);
    if (numericValue !== "" && isNaN(numericValue)) numericValue = 0;

    if (numericValue !== "") {
      if (scoreType === "ca") numericValue = Math.max(0, Math.min(40, numericValue));
      if (scoreType === "exam") numericValue = Math.max(0, Math.min(60, numericValue));
    }

    console.log("💾 Calling updateScore with:", { studentIdentifier, selectedSubject, scoreType, numericValue });
    updateScore(studentIdentifier, selectedSubject, scoreType, numericValue);
  };

  const getStudentScore = (studentIdentifier) => {
    const scores = examData[studentIdentifier]?.[selectedSubject] || { ca: "", exam: "", total: "" };
    console.log("📊 Getting scores for", studentIdentifier, ":", scores);
    return scores;
  };

  const calculateTotal = (ca, exam) => {
    const caScore = ca === "" ? 0 : parseInt(ca);
    const examScore = exam === "" ? 0 : parseInt(exam);
    return Math.min(100, caScore + examScore);
  };

  console.log("🎯 ScoreEntryTable Render - Students:", students.length);
  console.log("📖 Selected Subject:", selectedSubject);
  console.log("📊 Exam Data:", examData);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white text-gray-800 border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold">#</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold">Student Name</th>
            <th className="py-3 px-4 border-b border-gray-300 text-center font-semibold">CA (0-40)</th>
            <th className="py-3 px-4 border-b border-gray-300 text-center font-semibold">Exam (0-60)</th>
            <th className="py-3 px-4 border-b border-gray-300 text-center font-semibold">Total</th>
            <th className="py-3 px-4 border-b border-gray-300 text-center font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            const studentIdentifier = getStudentIdentifier(student, currentClass);
            const scores = getStudentScore(studentIdentifier);
            const isComplete = scores.ca !== "" && scores.exam !== "";
            const total = calculateTotal(scores.ca, scores.exam);

            return (
              <tr key={studentIdentifier} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="py-3 px-4 font-medium">{index + 1}</td>
                <td className="py-3 px-4 font-medium text-blue-700">{student.fullName}</td>

                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={scores.ca === "" ? "" : scores.ca}
                    onChange={(e) => handleScoreChange(studentIdentifier, "ca", e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded text-center block focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 mx-auto"
                    placeholder="0"
                    disabled={readOnly}
                  />
                </td>

                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={scores.exam === "" ? "" : scores.exam}
                    onChange={(e) => handleScoreChange(studentIdentifier, "exam", e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded text-center block focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 mx-auto"
                    placeholder="0"
                    disabled={readOnly}
                  />
                </td>

                <td className="py-3 px-4 text-center font-semibold">
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      total >= 70
                        ? "bg-green-100 text-green-800"
                        : total >= 50
                        ? "bg-blue-100 text-blue-800"
                        : total >= 40
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {total}
                  </span>
                </td>

                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      isComplete
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
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

      <div className="mt-4 p-3 bg-gray-100 rounded border border-gray-300">
        <div className="text-sm text-gray-700 text-center">
          <strong>{students.filter(s => {
            const scores = getStudentScore(getStudentIdentifier(s, currentClass));
            return scores.ca !== "" && scores.exam !== "";
          }).length}</strong> of <strong>{students.length}</strong> students completed
        </div>
      </div>
    </div>
  );
};

export default ScoreEntryTable;
