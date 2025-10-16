import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useExam } from "../../../context/ExamContext";
import { Link } from "react-router-dom";
import {
  ScoreEntryTable,
  ScoringStatistics,
  RecentActivity
} from "../../../components/scoring";

export default function SubjectTeacherDashboard() {
  const { user } = useAuth();
  const { examData, updateScore } = useExam();
  const [activeTab, setActiveTab] = useState("quickScore");
  const [currentClassIndex, setCurrentClassIndex] = useState(0);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);

  if (!user) {
    return <div className="p-6">Loading user data...</div>;
  }

  // Get teacher's assigned subjects and classes from admin assignment
  const teacherSubjects = user.assignedSubjects || user.subjects || [];
  const teacherClasses = user.assignedClasses || user.classes || [];

  // Get current class and subject based on index
  const currentClass = teacherClasses[currentClassIndex] || "";
  const currentSubject = teacherSubjects[currentSubjectIndex] || "";

  // Get students for current class
  const getClassStudents = (className) => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    return classLists[className] || [];
  };

  const students = getClassStudents(currentClass);

  // Navigation between assigned classes/subjects
  const nextClass = () => {
    setCurrentClassIndex((prev) => (prev + 1) % teacherClasses.length);
    setCurrentSubjectIndex(0);
  };

  const prevClass = () => {
    setCurrentClassIndex((prev) => (prev - 1 + teacherClasses.length) % teacherClasses.length);
    setCurrentSubjectIndex(0);
  };

  const nextSubject = () => {
    setCurrentSubjectIndex((prev) => (prev + 1) % teacherSubjects.length);
  };

  const prevSubject = () => {
    setCurrentSubjectIndex((prev) => (prev - 1 + teacherSubjects.length) % teacherSubjects.length);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Teacher Scoring Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.name}</p>
        
        {/* Teacher Info - Shows admin assignments */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">📚 Assigned Subjects</h3>
            <p className="text-blue-600">
              {teacherSubjects.length > 0 ? teacherSubjects.join(", ") : "No subjects assigned by admin"}
            </p>
            <p className="text-sm text-blue-500 mt-1">Contact admin to change assignments</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">🏫 Assigned Classes</h3>
            <p className="text-green-600">
              {teacherClasses.length > 0 ? teacherClasses.join(", ") : "No classes assigned by admin"}
            </p>
            <p className="text-sm text-green-500 mt-1">Contact admin to change assignments</p>
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

      {/* Current Assignment Navigation */}
      {teacherClasses.length > 0 && teacherSubjects.length > 0 && (
        <div className="bg-white rounded-lg shadow border p-4 mb-6">
          <h3 className="font-semibold mb-3">Current Assignment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500">Class:</span>
                <span className="ml-2 font-semibold">{currentClass}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={prevClass}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                  disabled={teacherClasses.length <= 1}
                >
                  ←
                </button>
                <button 
                  onClick={nextClass}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                  disabled={teacherClasses.length <= 1}
                >
                  →
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500">Subject:</span>
                <span className="ml-2 font-semibold">{currentSubject}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={prevSubject}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                  disabled={teacherSubjects.length <= 1}
                >
                  ←
                </button>
                <button 
                  onClick={nextSubject}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                  disabled={teacherSubjects.length <= 1}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700"
          >
            🗂️ Full Exam Bank
          </Link>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "quickScore" && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold mb-4">
            Quick Score Entry - {currentClass} - {currentSubject}
          </h2>

          {teacherClasses.length === 0 || teacherSubjects.length === 0 ? (
            <div className="text-center py-8 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700 font-semibold">No Teaching Assignments</p>
              <p className="text-yellow-600 text-sm mt-2">
                Admin has not assigned you any classes or subjects yet.
              </p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No students found in {currentClass}.</p>
              <p className="text-sm text-gray-400">Form Master needs to add students first.</p>
            </div>
          ) : (
            <>
              <ScoringStatistics
                students={students}
                selectedSubject={currentSubject}
                examData={examData}
              />

              <ScoreEntryTable
                students={students}
                selectedSubject={currentSubject}
                examData={examData}
                onScoreUpdate={updateScore}
              />

              {/* Quick Actions */}
              <div className="mt-6 flex gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save All Scores
                </button>
              </div>
            </>
          )}
        </div>
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

// Utility Functions (same as before)
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