import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { students } from "../../data/students";
import { subjects } from "../../data/subjects";

export default function ExamBank() {
  const { user } = useAuth() || {};
  const [selectedClass, setSelectedClass] = useState(user?.classes?.[0] || "");
  const [examData, setExamData] = useState({}); // {studentId: {subject: {ca, exam}}}

  useEffect(() => {
    // Load saved exam data from localStorage if any
    const savedData = localStorage.getItem("examData");
    if (savedData) setExamData(JSON.parse(savedData));
  }, []);

  if (!user) return <p>Loading...</p>;

  // Check if current user can edit this class/subject
  const canEdit = role => ["Form Master", "Subject Teacher"].includes(role);

  const handleInputChange = (studentId, subject, field, value) => {
    // Only allow edits if user can edit AND is assigned to this subject
    if (!canEdit(user.role)) return;
    if (user.role === "Subject Teacher" && !user.subjects.includes(subject)) return;
    if (user.role === "Form Master" && !user.subjects.includes(subject)) return;

    setExamData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: {
          ...prev[studentId]?.[subject],
          [field]: value
        }
      }
    }));
  };

  const saveExamData = () => {
    if (!canEdit(user.role)) return;
    localStorage.setItem("examData", JSON.stringify(examData));
    alert("Exam data saved successfully!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Exam Bank</h2>

      {/* Select class */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Class:</label>
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          className="p-2 border rounded"
        >
          {user.classes?.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(100px,1fr))] font-semibold border-b pb-2 mb-2">
        <span>Student</span>
        {subjects[selectedClass]?.map(sub => (
          <span key={sub}>{sub} CA</span>
        ))}
        {subjects[selectedClass]?.map(sub => (
          <span key={sub + "_exam"}>{sub} Exam</span>
        ))}
      </div>

      {/* Students Rows */}
      {students[selectedClass]?.map(student => (
        <div key={student.id} className="grid grid-cols-[200px_repeat(auto-fill,minmax(100px,1fr))] gap-1 mb-1">
          <span>{student.name}</span>

          {/* CA Inputs */}
          {subjects[selectedClass]?.map(sub => (
            <input
              key={sub + "_ca"}
              type="number"
              placeholder="CA"
              value={examData[student.id]?.[sub]?.ca || ""}
              onChange={e => handleInputChange(student.id, sub, "ca", e.target.value)}
              disabled={!canEdit(user.role) || 
                        (user.role === "Subject Teacher" && !user.subjects.includes(sub)) ||
                        (user.role === "Form Master" && !user.subjects.includes(sub))}
              className="border p-1 rounded w-full"
            />
          ))}

          {/* Exam Inputs */}
          {subjects[selectedClass]?.map(sub => (
            <input
              key={sub + "_exam"}
              type="number"
              placeholder="Exam"
              value={examData[student.id]?.[sub]?.exam || ""}
              onChange={e => handleInputChange(student.id, sub, "exam", e.target.value)}
              disabled={!canEdit(user.role) ||
                        (user.role === "Subject Teacher" && !user.subjects.includes(sub)) ||
                        (user.role === "Form Master" && !user.subjects.includes(sub))}
              className="border p-1 rounded w-full"
            />
          ))}
        </div>
      ))}

      {/* Save button */}
      {canEdit(user.role) && (
        <button
          onClick={saveExamData}
          className="mt-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
        >
          Save
        </button>
      )}
    </div>
  );
}
