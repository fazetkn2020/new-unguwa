import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useExam } from "../../../context/ExamContext";
import { Link } from "react-router-dom";
import {
  ScoreEntryTable,
  RecentActivity
} from "../../../components/scoring";

export default function SubjectTeacherDashboard() {
  const { user } = useAuth();
  const { examData, updateScore } = useExam(); 

  const [activeTab, setActiveTab] = useState("scoreEntry");
  const [currentClassIndex, setCurrentClassIndex] = useState(0);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);

  const [showSubjects, setShowSubjects] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showScoreEntry, setShowScoreEntry] = useState(false); 

  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const [savedToggle, setSavedToggle] = useState(false);
  const [savedVisible, setSavedVisible] = useState(false);
  const [showSavedStudents, setShowSavedStudents] = useState(false);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-teal-400">Loading user data...</div>
      </div>
    );
  }

  const teacherSubjects = user.assignedSubjects || user.subjects || [];
  const teacherClasses = user.assignedClasses || user.classes || [];

  const currentClass = teacherClasses[currentClassIndex] || "";
  const currentSubject = teacherSubjects[currentSubjectIndex] || "";

  const getClassStudents = (className) => {
    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
    return classLists[className] || [];
  };

  const students = getClassStudents(currentClass);

  const nextClass = () => {
    if (teacherClasses.length === 0) return;
    setCurrentClassIndex((prev) => (prev + 1) % teacherClasses.length);
    setCurrentSubjectIndex(0); 
    setShowScoreEntry(false); 
  };
  const prevClass = () => {
    if (teacherClasses.length === 0) return;
    setCurrentClassIndex((prev) => (prev - 1 + teacherClasses.length) % teacherClasses.length);
    setCurrentSubjectIndex(0); 
    setShowScoreEntry(false); 
  };
  const nextSubject = () => {
    if (teacherSubjects.length === 0) return;
    setCurrentSubjectIndex((prev) => (prev + 1) % teacherSubjects.length);
    setShowScoreEntry(false); 
  };
  const prevSubject = () => {
    if (teacherSubjects.length === 0) return;
    setCurrentSubjectIndex((prev) => (prev - 1 + teacherSubjects.length) % teacherSubjects.length);
    setShowScoreEntry(false); 
  };

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

  const filteredStudents = students.filter((s) => {
    if (!searchTerm) return true;
    const name = (s.name || s.fullName || `${s.firstName || ""} ${s.lastName || ""}`).toLowerCase();
    return name.includes(searchTerm.trim().toLowerCase());
  });

  const handleSaveAll = () => {
    try {
      localStorage.setItem("examData", JSON.stringify(examData || {}));
      setToast({ type: "success", message: "Scores saved successfully" });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 3000);
      
      setShowScoreEntry(false); 
      
      setSavedToggle((s) => !s);
      setSavedVisible(true);
      setShowSavedStudents(false); 
    } catch (err) {
      setToast({ type: "error", message: "Failed to save scores" });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/40 rounded-xl border border-teal-500/20 transition-all duration-300 overflow-hidden">
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

            <div className={`px-5 pb-5 transition-all duration-300 ${showSubjects ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
              <p className="text-slate-200 mb-2">
                {teacherSubjects.length > 0 ? teacherSubjects.join(", ") : "Awaiting assignment"}
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-xl border border-cyan-500/20 transition-all duration-300 overflow-hidden">
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

            <div className={`px-5 pb-5 transition-all duration-300 ${showClasses ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
              <p className="text-slate-200 mb-2">
                {teacherClasses.length > 0 ? teacherClasses.join(", ") : "Awaiting assignment"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full"></div>
            <h2 className="text-xl font-semibold text-white">Your Stats</h2>
          </div>
          <button onClick={() => setShowStats((s) => !s)} className="text-sm text-slate-300">
            {showStats ? "Hide ▲" : "Show ▼"}
          </button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden transition-all duration-400 ${showStats ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
          {[
            { label: "Total Students", value: getTotalStudents(teacherClasses), color: "teal", icon: "👥" },
            { label: "Scores Entered", value: getScoresEnteredCount(examData, teacherSubjects), color: "emerald", icon: "✅" },
            { label: "Pending Scores", value: getPendingScoresCount(teacherClasses, teacherSubjects, examData), color: "amber", icon: "⏳" },
            { label: "Completion Rate", value: `${getCompletionRate(teacherClasses, teacherSubjects, examData)}%`, color: "cyan", icon: "📊" }
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800/60 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border bg-[rgba(255,255,255,0.02)]`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <div className="w-2 h-2 bg-[rgba(255,255,255,0.02)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-slate-800/40 rounded-xl p-2 mb-8 border border-slate-700 backdrop-blur-sm">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { id: "scoreEntry", label: "Score Entry", icon: "✏️" },
            { id: "recent", label: "Recent Activity", icon: "📊" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm ${activeTab === tab.id ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"}`}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
          <Link to="/dashboard/exambank" className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/50">
            <span>🗂️</span>
            <span>Exam Bank</span>
          </Link>
        </div>
      </div>

      <div className="bg-slate-800/40 rounded-xl border border-slate-700 overflow-hidden backdrop-blur-sm">
        {activeTab === "scoreEntry" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-gradient-to-b from-sky-400 to-cyan-400 rounded-full"></div>
              <h2 className="text-xl font-semibold text-white">
                Score Entry for <span className="text-teal-300">{currentClass}</span> • <span className="text-cyan-300">{currentSubject}</span>
              </h2>
            </div>

            {/* Class and Subject Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 flex items-center justify-between">
                    <span className="text-sm text-slate-400 font-medium">Class: <span className="text-lg font-semibold text-white">{currentClass}</span></span>
                    <div className="flex gap-2">
                        <button onClick={prevClass} className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300" disabled={teacherClasses.length <= 1}>←</button>
                        <button onClick={nextClass} className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300" disabled={teacherClasses.length <= 1}>→</button>
                    </div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 flex items-center justify-between">
                    <span className="text-sm text-slate-400 font-medium">Subject: <span className="text-lg font-semibold text-white">{currentSubject}</span></span>
                    <div className="flex gap-2">
                        <button onClick={prevSubject} className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300" disabled={teacherSubjects.length <= 1}>←</button>
                        <button onClick={nextSubject} className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300" disabled={teacherSubjects.length <= 1}>→</button>
                    </div>
                </div>
            </div>

            {teacherClasses.length === 0 || teacherSubjects.length === 0 || students.length === 0 ? (
              // Display messages for no assignments or empty class (omitted for brevity)
              <div className="text-center py-12 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-amber-300 font-semibold text-lg mb-2">
                    {teacherClasses.length === 0 || teacherSubjects.length === 0 ? "No Teaching Assignments" : "Empty Class Roster"}
                </p>
                <p className="text-slate-400">
                    {teacherClasses.length === 0 || teacherSubjects.length === 0 ? "Admin has not assigned you any classes or subjects yet." : `No students found in ${currentClass}.`}
                </p>
              </div>
            ) : (
              <>
                <div className="mt-6">
                    {/* SAVE ALL BUTTON */}
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={handleSaveAll} 
                            className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:from-teal-400 hover:to-cyan-400 transition duration-200"
                        >
                            💾 Save All Scores
                        </button>
                    </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-sky-400 to-cyan-400 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">Entry Controls</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                      
                      {savedVisible && (
                        <>
                          {/* Search Input */}
                          <div className="relative w-full sm:w-auto flex-grow">
                            <input
                              type="text"
                              placeholder="Search student..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-3 pr-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 text-sm focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                          
                          {/* Show Saved Toggle */}
                          <button 
                              onClick={() => setShowSavedStudents((s) => !s)} 
                              className="text-sm px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 flex-shrink-0"
                          >
                              {showSavedStudents ? "Hide Saved" : "Show Saved"}
                          </button>
                        </>
                      )}
                      
                      {/* Show/Hide Score Table Toggle */}
                      <button 
                          onClick={() => setShowScoreEntry((s) => !s)} 
                          className="text-sm px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 flex-shrink-0"
                      >
                          {showScoreEntry ? "Hide Table ▲" : "Show Table ▼"}
                      </button>
                    </div>
                  </div>

                  {/* SCORE ENTRY TABLE */}
                  <div className={`transition-all duration-300 ${showScoreEntry ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                    <div className="mb-4">
                      <ScoreEntryTable
                        students={filteredStudents}
                        subject={currentSubject}
                        examData={examData}
                        updateScore={updateScore} 
                      />
                    </div>
                  </div>

                  {/* SAVED STUDENTS LIST */}
                  {savedVisible && showSavedStudents && (
                    <div className="mt-4 bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                      <h4 className="text-sm text-slate-200 mb-3">Saved Scores for {currentSubject}</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredStudents.length === 0 ? (
                          <div className="text-center text-sm text-slate-400 py-4">No students match your search.</div>
                        ) : (
                          filteredStudents.map((s) => {
                            // 💡 FIX 1: Use the same identifier logic as the table
                            const studentIdentifier = s.id || s.fullName || `temp_student_${s.email}`; 

                            const studentScores = (examData || {})[studentIdentifier] || {};
                            const subjScores = studentScores[currentSubject] || {};
                            
                            // 💡 FIX 2: Ensure we display '—' if the score is an empty string
                            const displayScore = (score) => score === '' ? '—' : score;

                            return (
                              <div key={studentIdentifier} className="flex items-center justify-between bg-slate-800/50 p-2 rounded">
                                <div>
                                  <div className="text-sm text-slate-100 font-medium">{s.name || s.fullName || s.firstName}</div>
                                  <div className="text-xs text-slate-400">{s.admNo || s.id || ""}</div>
                                </div>
                                <div className="text-sm text-slate-300 flex gap-4">
                                  <div className="font-semibold text-teal-300">CA: {displayScore(subjScores?.ca)}</div>
                                  <div className="font-semibold text-cyan-300">Exam: {displayScore(subjScores?.exam)}</div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "recent" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full"></div>
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            </div>
            <RecentActivity toggle={savedToggle} />
          </div>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 bg-${toast.type === "success" ? "emerald" : "rose"}-600 text-white px-4 py-2 rounded-lg shadow-lg`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
