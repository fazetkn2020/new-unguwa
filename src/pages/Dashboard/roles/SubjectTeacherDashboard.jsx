import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useExam } from "../../../context/ExamContext";
import { Link } from "react-router-dom";
import {
  ScoreEntryTable,
  ScoringStatistics,
  RecentActivity
} from "../../../components/scoring";

function SubjectTeacherDashboard() {
  const { user } = useAuth();
  const { examData, updateScore } = useExam();

  // UI state
  const [activeTab, setActiveTab] = useState("scoreEntry"); // renamed default
  const [currentClassIndex, setCurrentClassIndex] = useState(0);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);

  // collapsible sections
  const [showSubjects, setShowSubjects] = useState(true);
  const [showClasses, setShowClasses] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showReports, setShowReports] = useState(true); // report generator (kept if needed)
  const [showScoreEntry, setShowScoreEntry] = useState(true);

  // search for score entry
  const [searchTerm, setSearchTerm] = useState("");

  // toast
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  // trigger re-render for RecentActivity after saving
  const [savedToggle, setSavedToggle] = useState(false);

  useEffect(() => {
    loadDashboardData();
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Data loading & helpers (unchanged logic mostly) ---
  const loadDashboardData = () => {
    // keep original behavior (if you want to fetch more later, replace)
    // (this function currently only ensures initial load — examData comes from context)
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-teal-400">Loading user data...</div>
      </div>
    );
  }

  // Assigned data
  const teacherSubjects = user.assignedSubjects || user.subjects || [];
  const teacherClasses = user.assignedClasses || user.classes || [];

  // Current selected
  const currentClass = teacherClasses[currentClassIndex] || "";
  const currentSubject = teacherSubjects[currentSubjectIndex] || "";

  // Students helper (reads from localStorage as original)
  const getClassStudents = (className) => {
    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
    return classLists[className] || [];
  };

  const students = getClassStudents(currentClass);

  // Navigate classes/subjects
  const nextClass = () => {
    if (teacherClasses.length === 0) return;
    setCurrentClassIndex((prev) => (prev + 1) % teacherClasses.length);
    setCurrentSubjectIndex(0);
  };
  const prevClass = () => {
    if (teacherClasses.length === 0) return;
    setCurrentClassIndex((prev) => (prev - 1 + teacherClasses.length) % teacherClasses.length);
    setCurrentSubjectIndex(0);
  };
  const nextSubject = () => {
    if (teacherSubjects.length === 0) return;
    setCurrentSubjectIndex((prev) => (prev + 1) % teacherSubjects.length);
  };
  const prevSubject = () => {
    if (teacherSubjects.length === 0) return;
    setCurrentSubjectIndex((prev) => (prev - 1 + teacherSubjects.length) % teacherSubjects.length);
  };

  // Utility functions (kept from your file)
  function getTotalStudents(classes) {
    let total = 0;
    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
    classes.forEach((cls) => {
      total += (classLists[cls] || []).length;
    });
    return total;
  }

  function getScoresEnteredCount(examDataObj, subjects) {
    let count = 0;
    Object.values(examDataObj || {}).forEach((studentScores) => {
      subjects.forEach((subject) => {
        const scores = studentScores?.[subject];
        if (scores && scores.ca !== "" && scores.exam !== "") {
          count++;
        }
      });
    });
    return count;
  }

  function getPendingScoresCount(classes, subjects, examDataObj) {
    const totalStudents = getTotalStudents(classes);
    const scoresEntered = getScoresEnteredCount(examDataObj, subjects);
    return totalStudents * subjects.length - scoresEntered;
  }

  function getCompletionRate(classes, subjects, examDataObj) {
    const totalPossible = getTotalStudents(classes) * subjects.length;
    const completed = getScoresEnteredCount(examDataObj, subjects);
    return totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
  }

  // Filter students by search term (case-insensitive)
  const filteredStudents = students.filter((s) => {
    if (!searchTerm) return true;
    const name = (s.name || s.fullName || `${s.firstName || ""} ${s.lastName || ""}`).toLowerCase();
    return name.includes(searchTerm.trim().toLowerCase());
  });

  // Save handler: persist examData to localStorage (so RecentActivity picks it up),
  // show toast and collapse Score Entry
  const handleSaveAll = () => {
    try {
      // Persist examData (if your exam context already persists, this is safe/redundant)
      localStorage.setItem("examData", JSON.stringify(examData || {}));

      // Optional: if you want to call updateScore as a finalizer, you could do it here.
      // But as we don't know the exact signature for bulk save, we persist examData.

      // Show toast
      setToast({ type: "success", message: "Scores saved successfully" });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 3000);

      // Collapse Score Entry
      setShowScoreEntry(false);

      // Toggle saved state for RecentActivity to re-render
      setSavedToggle((s) => !s);
    } catch (err) {
      setToast({ type: "error", message: "Failed to save scores" });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 3000);
    }
  };

  // When Save is clicked inside the ScoreEntry table itself (if it emits an event), you can call handleSaveAll.
  // We also expose updateScore for per-row updates (ScoreEntryTable should call onScoreUpdate prop when editing).

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-10 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Teaching Portal
            </h1>
            <p className="text-slate-300 mt-1">
              Welcome back, <span className="text-teal-300 font-medium">{user.name}</span>
            </p>
          </div>
        </div>

        {/* Collapsible: Your Subjects & Your Classes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Your Subjects */}
          <div className="bg-slate-800/50 rounded-xl border border-teal-500/20 transition-all duration-300 overflow-hidden">
            <button
              onClick={() => setShowSubjects((s) => !s)}
              className="w-full flex items-center justify-between p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center border border-teal-500/20">
                  <span className="text-lg">📚</span>
                </div>
                <div>
                  <h3 className="font-semibold text-teal-300">Your Subjects</h3>
                  <p className="text-sm text-slate-400">{teacherSubjects.length} assigned</p>
                </div>
              </div>
              <div className="text-slate-300">{showSubjects ? "▾" : "▸"}</div>
            </button>

            <div
              className={`px-5 pb-5 transition-all duration-300 ${
                showSubjects ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-slate-200 mb-2">
                {teacherSubjects.length > 0 ? teacherSubjects.join(", ") : "Awaiting assignment"}
              </p>
            </div>
          </div>

          {/* Your Classes */}
          <div className="bg-slate-800/50 rounded-xl border border-cyan-500/20 transition-all duration-300 overflow-hidden">
            <button
              onClick={() => setShowClasses((s) => !s)}
              className="w-full flex items-center justify-between p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                  <span className="text-lg">🏫</span>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-300">Your Classes</h3>
                  <p className="text-sm text-slate-400">{teacherClasses.length} assigned</p>
                </div>
              </div>
              <div className="text-slate-300">{showClasses ? "▾" : "▸"}</div>
            </button>

            <div
              className={`px-5 pb-5 transition-all duration-300 ${
                showClasses ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-slate-200 mb-2">
                {teacherClasses.length > 0 ? teacherClasses.join(", ") : "Awaiting assignment"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Stats (collapsible) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full"></div>
            <h2 className="text-xl font-semibold text-white">Your Stats</h2>
          </div>
          <button
            onClick={() => setShowStats((s) => !s)}
            className="text-sm text-slate-300"
          >
            {showStats ? "Hide ▲" : "Show ▼"}
          </button>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden transition-all duration-400 ${
            showStats ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {[
            { label: "Total Students", value: getTotalStudents(teacherClasses), color: "teal", icon: "👥" },
            { label: "Scores Entered", value: getScoresEnteredCount(examData, teacherSubjects), color: "emerald", icon: "✅" },
            { label: "Pending Scores", value: getPendingScoresCount(teacherClasses, teacherSubjects, examData), color: "amber", icon: "⏳" },
            { label: "Completion Rate", value: `${getCompletionRate(teacherClasses, teacherSubjects, examData)}%`, color: "cyan", icon: "📊" }
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800/60 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center border border-${stat.color}-500/20 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <div className={`w-2 h-2 bg-${stat.color}-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className={`text-sm font-medium text-${stat.color}-300`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Assignment Navigation */}
      {teacherClasses.length > 0 && teacherSubjects.length > 0 && (
        <div className="bg-slate-800/40 rounded-xl border border-slate-700 p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
            <h3 className="font-semibold text-white text-lg">Active Assignment</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400 font-medium">Current Class</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                    {currentClassIndex + 1} of {Math.max(teacherClasses.length, 1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">{currentClass}</span>
                <div className="flex gap-2">
                  <button
                    onClick={prevClass}
                    className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={teacherClasses.length <= 1}
                  >
                    ←
                  </button>
                  <button
                    onClick={nextClass}
                    className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={teacherClasses.length <= 1}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400 font-medium">Current Subject</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                    {currentSubjectIndex + 1} of {Math.max(teacherSubjects.length, 1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">{currentSubject}</span>
                <div className="flex gap-2">
                  <button
                    onClick={prevSubject}
                    className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={teacherSubjects.length <= 1}
                  >
                    ←
                  </button>
                  <button
                    onClick={nextSubject}
                    className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={teacherSubjects.length <= 1}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-slate-800/40 rounded-xl p-2 mb-8 border border-slate-700 backdrop-blur-sm">
        <div className="flex space-x-2">
          {[
            { id: "scoreEntry", label: "Score Entry", icon: "✏️" },
            { id: "recent", label: "Recent Activity", icon: "📊" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}

          <Link
            to="/dashboard/exambank"
            className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all duration-200"
          >
            <span>🗂️</span>
            <span>Exam Bank</span>
          </Link>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800/40 rounded-xl border border-slate-700 overflow-hidden backdrop-blur-sm">
        {activeTab === "scoreEntry" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full"></div>
              <h2 className="text-xl font-semibold text-white">
                Score Entry - <span className="text-teal-300">{currentClass}</span> • <span className="text-cyan-300">{currentSubject}</span>
              </h2>
            </div>

            {teacherClasses.length === 0 || teacherSubjects.length === 0 ? (
              <div className="text-center py-12 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-amber-300 font-semibold text-lg mb-2">No Teaching Assignments</p>
                <p className="text-slate-400">
                  Admin has not assigned you any classes or subjects yet.
                </p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-slate-300 font-semibold text-lg mb-2">Empty Class Roster</p>
                <p className="text-slate-400">No students found in {currentClass}.</p>
                <p className="text-sm text-slate-500 mt-1">Form Master needs to add students first.</p>
              </div>
            ) : (
              <>
                {/* Scoring stats (keeps same behaviour) */}
                <ScoringStatistics
                  students={students}
                  selectedSubject={currentSubject}
                  examData={examData}
                />

                {/* Collapsible Score Entry */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-sky-400 to-cyan-400 rounded-full"></div>
                      <h3 className="text-lg font-semibold">Score Entry</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* search */}
                      <div className="relative">
                        <input
                          type="search"
                          placeholder="Search student name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-slate-700/60 placeholder:text-slate-400 text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</div>
                      </div>

                      <button
                        onClick={() => setShowScoreEntry((s) => !s)}
                        className="text-sm text-slate-300"
                      >
                        {showScoreEntry ? "Hide ▲" : "Show ▼"}
                      </button>
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-400 overflow-hidden ${showScoreEntry ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    {/* Pass filteredStudents to the ScoreEntryTable so search works regardless of internals */}
                    <ScoreEntryTable
                      students={filteredStudents}
                      selectedSubject={currentSubject}
                      examData={examData}
                      onScoreUpdate={updateScore}
                      currentClass={currentClass}
                    />

                    {/* Quick Actions */}
                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={handleSaveAll}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg shadow-teal-500/25"
                      >
                        <span>Save All Scores</span>
                        <span>→</span>
                      </button>

                      <button className="bg-slate-700 text-slate-300 px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors duration-200 font-medium border border-slate-600">
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "recent" && (
          <div className="p-6">
            {/* RecentActivity now receives examData and savedToggle so it updates after saves */}
            <RecentActivity
              teacherSubjects={teacherSubjects}
              examData={examData}
              savedToggle={savedToggle}
            />
          </div>
        )}
      </div>

      {/* OPERATIONAL PROTOCOLS (unchanged) */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 border border-slate-700 shadow-lg mt-8">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <div className="w-1 h-6 bg-green-500 rounded animate-pulse"></div>
          OPERATIONAL PROTOCOLS
        </h3>
        <ul className="space-y-3">
          {[
            "Collect and verify test question data streams",
            "Manage internal examination processing protocols",
            "Generate and distribute student report modules",
            "Monitor instructor submission activity feeds",
            "Coordinate external examination interfaces",
          ].map((item, i) => (
            <li key={i} className="flex items-center text-slate-300">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-3 flex-shrink-0" />
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 font-mono">SYSTEM: OPERATIONAL</div>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <div className={`px-4 py-2 rounded-md shadow-lg ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectTeacherDashboard;
