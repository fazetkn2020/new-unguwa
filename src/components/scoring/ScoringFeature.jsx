import React, { useState, useRef } from 'react';
import { useExam } from '../../context/ExamContext';
import useTeachingAssignments from './useTeachingAssignments';
import { ScoreEntryTable, ScoringStatistics, RecentActivity } from './index';

const ScoringFeature = ({ user, context = "dashboard" }) => {
  const { examData, updateScore } = useExam();
  const teaching = useTeachingAssignments(user);
  
  // Local state
  const [activeTab, setActiveTab] = useState("scoreEntry");
  const [searchTerm, setSearchTerm] = useState("");
  const [showScoreEntry, setShowScoreEntry] = useState(true);
  const [savedToggle, setSavedToggle] = useState(false);
  const [toast, setToast] = useState(null);

  const toastTimerRef = useRef(null);

  // Filter students by search term
  const filteredStudents = teaching.getCurrentClassStudents().filter((student) => {
    if (!searchTerm) return true;
    const name = (student.name || student.fullName || `${student.firstName || ""} ${student.lastName || ""}`).toLowerCase();
    return name.includes(searchTerm.trim().toLowerCase());
  });

  // Save handler
  const handleSaveAll = () => {
    try {
      // Persist examData
      localStorage.setItem("examData", JSON.stringify(examData || {}));

      // Show toast
      setToast({ type: "success", message: "Scores saved successfully" });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 3000);

      // Collapse Score Entry in dashboard context
      if (context === "dashboard") {
        setShowScoreEntry(false);
      }

      // Trigger re-render for RecentActivity
      setSavedToggle((s) => !s);
    } catch (err) {
      setToast({ type: "error", message: "Failed to save scores" });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 3000);
    }
  };

  // Don't render if no teaching assignments
  if (!teaching.hasTeachingAssignments) {
    return null;
  }

  return (
    <div className="scoring-feature">
      {/* Header - Different based on context */}
      {context === "dashboard" ? (
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full"></div>
          <h2 className="text-xl font-semibold text-white">
            Teaching - <span className="text-teal-300">{teaching.currentClass}</span> • <span className="text-cyan-300">{teaching.currentSubject}</span>
          </h2>
        </div>
      ) : (
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Teaching Portal</h1>
          <p className="text-gray-600">
            Managing <span className="font-semibold text-teal-600">{teaching.currentSubject}</span> for{" "}
            <span className="font-semibold text-blue-600">{teaching.currentClass}</span>
          </p>
        </div>
      )}

      {/* Navigation Tabs - Full set in portal, minimal in dashboard */}
      {context === "portal" && (
        <div className="bg-slate-800/40 rounded-xl p-2 mb-6 border border-slate-700 backdrop-blur-sm">
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
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-slate-800/40 rounded-xl border border-slate-700 overflow-hidden backdrop-blur-sm">
        {activeTab === "scoreEntry" && (
          <div className="p-6">
            {/* Show stats only if we have students */}
            {filteredStudents.length > 0 && (
              <ScoringStatistics
                students={filteredStudents}
                selectedSubject={teaching.currentSubject}
                examData={examData}
              />
            )}

            {/* Score Entry Section */}
            <div className="mt-6">
              {context === "dashboard" && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-sky-400 to-cyan-400 rounded-full"></div>
                    <h3 className="text-lg font-semibold">Score Entry</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Search */}
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
              )}

              {/* Score Entry Content */}
              <div className={`${context === "dashboard" ? (showScoreEntry ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0") : ""} transition-all duration-400 overflow-hidden`}>
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <p className="text-slate-300 font-semibold text-lg mb-2">Empty Class Roster</p>
                    <p className="text-slate-400">No students found in {teaching.currentClass}.</p>
                  </div>
                ) : (
                  <>
                    <ScoreEntryTable
                      students={filteredStudents}
                      selectedSubject={teaching.currentSubject}
                      examData={examData}
                      onScoreUpdate={updateScore}
                      currentClass={teaching.currentClass}
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
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "recent" && (
          <div className="p-6">
            <RecentActivity
              teacherSubjects={teaching.subjects}
              examData={examData}
              savedToggle={savedToggle}
            />
          </div>
        )}
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
};

export default ScoringFeature;
