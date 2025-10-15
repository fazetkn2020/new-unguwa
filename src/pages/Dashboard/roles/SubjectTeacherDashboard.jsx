// src/pages/Dashboard/roles/SubjectTeacherDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useExam } from "../../../context/ExamContext";
import { subjects } from "../../../data/subjects";
import { Link } from "react-router-dom";

export default function SubjectTeacherDashboard() {
  const { user } = useAuth();
  const { examData, updateScore } = useExam();
  const [activeTab, setActiveTab] = useState("quickScore");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  if (!user) {
    return <div className="p-6">Loading user data...</div>;
  }

  // Get teacher's assigned subjects and classes
  const teacherSubjects = user.subjects || [];
  const teacherClasses = user.classes || ["SS1", "SS2", "SS3"]; // Default if not set

  // Set default selections
  useEffect(() => {
    if (teacherClasses.length > 0 && !selectedClass) {
      setSelectedClass(teacherClasses[0]);
    }
    if (teacherSubjects.length > 0 && !selectedSubject) {
      setSelectedSubject(teacherSubjects[0]);
    }
  }, [teacherClasses, teacherSubjects]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Teacher Scoring Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.name}</p>
        
        {/* Teacher Info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">📚 Teaching Subjects</h3>
            <p className="text-blue-600">{teacherSubjects.join(", ") || "No subjects assigned"}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">🏫 Assigned Classes</h3>
            <p className="text-green-600">{teacherClasses.join(", ") || "All classes"}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold">{getTotalStudents(teacherClasses)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm text-gray-500">Scores Entered</h3>
          <p className="text-2xl font-bold text-green-600">
            {getScoresEnteredCount(examData, teacherSubjects)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-orange-600">
            {getPendingScoresCount(teacherClasses, teacherSubjects, examData)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm text-gray-500">Completion</h3>
          <p className="text-2xl font-bold text-blue-600">
            {getCompletionRate(teacherClasses, teacherSubjects, examData)}%
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("quickScore")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "quickScore"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            ✏️ Quick Score Entry
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "recent"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            📊 Recent Activity
          </button>
          <Link 
            to="/dashboard/exambank"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "exambank"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            🗂️ Full Exam Bank
          </Link>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "quickScore" && (
        <QuickScoreEntry 
          teacherSubjects={teacherSubjects}
          teacherClasses={teacherClasses}
          selectedClass={selectedClass}
          selectedSubject={selectedSubject}
          onClassChange={setSelectedClass}
          onSubjectChange={setSelectedSubject}
        />
      )}
      
      {activeTab === "recent" && (
        <RecentActivity 
          teacherSubjects={teacherSubjects}
          examData={examData}
        />
      )}
    </div>
  );
}

// Quick Score Entry Component
function QuickScoreEntry({ teacherSubjects, teacherClasses, selectedClass, selectedSubject, onClassChange, onSubjectChange }) {
  const { examData, updateScore } = useExam();
  
  // Get students for selected class
  const getClassStudents = (className) => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    return classLists[className] || [];
  };

  const students = getClassStudents(selectedClass);

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Score Entry</h2>
      
      {/* Class and Subject Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => onClassChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {teacherClasses.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Select Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {teacherSubjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Score Entry Table */}
      {students.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No students found in {selectedClass}.</p>
          <p className="text-sm text-gray-400">Form Master needs to add students first.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left">Student Name</th>
                <th className="py-3 px-4 border-b text-center">CA Score (0-40)</th>
                <th className="py-3 px-4 border-b text-center">Exam Score (0-60)</th>
                <th className="py-3 px-4 border-b text-center">Total</th>
                <th className="py-3 px-4 border-b text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const scores = examData[student.id]?.[selectedSubject] || { ca: '', exam: '', total: 0 };
                const isComplete = scores.ca !== '' && scores.exam !== '';
                
                return (
                  <tr key={student.id} className="hover:bg-gray-50 border-b">
                    <td className="py-3 px-4 font-medium">{student.fullName}</td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max="40"
                        value={scores.ca}
                        onChange={(e) => updateScore(student.id, selectedSubject, 'ca', e.target.value)}
                        className="w-20 p-1 border rounded text-center mx-auto block"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={scores.exam}
                        onChange={(e) => updateScore(student.id, selectedSubject, 'exam', e.target.value)}
                        className="w-20 p-1 border rounded text-center mx-auto block"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-4 text-center font-semibold">
                      {scores.total || 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        isComplete ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {isComplete ? 'Complete' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save All Scores
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Clear All
        </button>
      </div>
    </div>
  );
}

// Recent Activity Component
function RecentActivity({ teacherSubjects, examData }) {
  // This would show recently edited scores
  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Scoring Activity</h2>
      <div className="text-center py-8 text-gray-500">
        <p>Recent score entries will appear here.</p>
        <p className="text-sm">Start entering scores to see your activity.</p>
      </div>
    </div>
  );
}

// Utility Functions
function getTotalStudents(classes) {
  let total = 0;
  const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
  classes.forEach(cls => {
    total += (classLists[cls] || []).length;
  });
  return total;
}

function getScoresEnteredCount(examData, subjects) {
  let count = 0;
  Object.values(examData).forEach(studentScores => {
    subjects.forEach(subject => {
      const scores = studentScores[subject];
      if (scores && scores.ca !== '' && scores.exam !== '') {
        count++;
      }
    });
  });
  return count;
}

function getPendingScoresCount(classes, subjects, examData) {
  const totalStudents = getTotalStudents(classes);
  const scoresEntered = getScoresEnteredCount(examData, subjects);
  return (totalStudents * subjects.length) - scoresEntered;
}

function getCompletionRate(classes, subjects, examData) {
  const totalPossible = getTotalStudents(classes) * subjects.length;
  const completed = getScoresEnteredCount(examData, subjects);
  return totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
}
