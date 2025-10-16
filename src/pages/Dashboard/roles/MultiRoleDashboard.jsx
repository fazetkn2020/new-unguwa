import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useExam } from "../../../context/ExamContext";
import {
  ScoreEntryTable,
  SubjectSelector,
  ScoringStatistics,
  RecentActivity
} from "../../../components/scoring";

export default function MultiRoleDashboard() {
  const { user } = useAuth();
  const { examData, updateScore } = useExam();
  const [activeTab, setActiveTab] = useState("scoring");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  if (!user) {
    return <div className="p-6">Loading user data...</div>;
  }

  // Get teaching assignments for any role
  const hasTeachingRole = user.role === "Subject Teacher" || 
                         user.role === "Form Master" || 
                         user.role === "Principal" ||
                         user.role === "Senior Master" ||
                         user.role === "VP Academic";

  const teacherSubjects = user.subjects || [];
  const teacherClasses = user.classes || ["SS1", "SS2", "SS3"];

  // Set default selections
  useEffect(() => {
    if (teacherClasses.length > 0 && !selectedClass) {
      setSelectedClass(teacherClasses[0]);
    }
    if (teacherSubjects.length > 0 && !selectedSubject) {
      setSelectedSubject(teacherSubjects[0]);
    }
  }, [teacherClasses, teacherSubjects]);

  // Get students for selected class
  const getClassStudents = (className) => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    return classLists[className] || [];
  };

  const students = getClassStudents(selectedClass);

  const canEditScores = user.role === "Admin" || 
                       user.role === "Form Master" || 
                       (user.role === "Subject Teacher" && teacherSubjects.includes(selectedSubject));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{user.role} Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.name}</p>
        
        {/* Role-specific info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">🎯 Your Role</h3>
            <p className="text-blue-600">{user.role}</p>
          </div>
          
          {hasTeachingRole && teacherSubjects.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">📚 Teaching Subjects</h3>
              <p className="text-green-600">{teacherSubjects.join(", ")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {hasTeachingRole && teacherSubjects.length > 0 && (
            <button
              onClick={() => setActiveTab("scoring")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "scoring"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              ✏️ Score Entry
            </button>
          )}
          
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            📊 Overview
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "scoring" && hasTeachingRole && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold mb-4">
            Score Entry - {user.role}
            {!canEditScores && (
              <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                View Only
              </span>
            )}
          </h2>
          
          <SubjectSelector
            teacherSubjects={teacherSubjects}
            teacherClasses={teacherClasses}
            selectedClass={selectedClass}
            selectedSubject={selectedSubject}
            onClassChange={setSelectedClass}
            onSubjectChange={setSelectedSubject}
          />

          <ScoringStatistics
            students={students}
            selectedSubject={selectedSubject}
            examData={examData}
          />

          {students.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No students found in {selectedClass}.</p>
              <p className="text-sm text-gray-400">Form Master needs to add students first.</p>
            </div>
          ) : (
            <ScoreEntryTable
              students={students}
              selectedSubject={selectedSubject}
              examData={examData}
              onScoreUpdate={updateScore}
              readOnly={!canEditScores}
            />
          )}

          {canEditScores && (
            <div className="mt-6 flex gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save All Scores
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "overview" && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Students</h3>
              <p className="text-2xl font-bold text-blue-600">{getTotalStudents()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Subjects</h3>
              <p className="text-2xl font-bold text-green-600">{getTotalSubjects()}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Scores Entered</h3>
              <p className="text-2xl font-bold text-purple-600">
                {getTotalScoresEntered(examData)}
              </p>
            </div>
          </div>
        </div>
      )}

      {!hasTeachingRole && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            No Teaching Assignments
          </h3>
          <p className="text-yellow-700">
            You don't have any subject teaching assignments. 
            Contact admin to get assigned to subjects and classes.
          </p>
        </div>
      )}
    </div>
  );
}

// Utility functions
function getTotalStudents() {
  const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
  return Object.values(classLists).flat().length;
}

function getTotalSubjects() {
  const subjects = JSON.parse(localStorage.getItem('subjects')) || {};
  return Object.values(subjects).flat().length;
}

function getTotalScoresEntered(examData) {
  let count = 0;
  Object.values(examData).forEach(studentScores => {
    Object.values(studentScores).forEach(subjectScores => {
      if (subjectScores.ca !== '' && subjectScores.exam !== '') {
        count++;
      }
    });
  });
  return count;
}