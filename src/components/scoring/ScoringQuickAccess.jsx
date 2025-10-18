import React from 'react';
import { Link } from 'react-router-dom';

const ScoringQuickAccess = ({ teaching, onExpand }) => {
  const {
    hasTeachingAssignments,
    subjects,
    classes,
    currentSubject,
    currentClass,
    getCurrentClassStudents
  } = teaching;

  // Don't render if no teaching assignments
  if (!hasTeachingAssignments) {
    return null;
  }

  const students = getCurrentClassStudents();
  const studentCount = students.length;

  // Calculate completion stats
  const calculateCompletion = () => {
    const examData = JSON.parse(localStorage.getItem('examData')) || {};
    let completed = 0;
    let totalPossible = 0;

    students.forEach(student => {
      const studentId = `${currentClass}_${student.fullName?.replace(/\s+/g, '_')}`;
      const studentScores = examData[studentId] || {};
      const subjectScore = studentScores[currentSubject];

      if (subjectScore) {
        if (subjectScore.ca !== '' && subjectScore.exam !== '') {
          completed++;
        }
      }
      totalPossible++;
    });

    return totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
  };

  const completionRate = calculateCompletion();

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 mb-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full"></div>
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Scoring</h3>
            <p className="text-sm text-slate-400">
              {currentSubject} • {currentClass}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Portal Link */}
          <Link
            to="/dashboard/teaching-portal"
            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
            title="Open Teaching Portal"
          >
            <span>📚</span>
            <span>Portal</span>
          </Link>
          
          {/* Expand Button */}
          {onExpand && (
            <button
              onClick={onExpand}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
              title="Expand in dashboard"
            >
              <span>⬆️</span>
              <span>Expand</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-400">{studentCount}</div>
          <div className="text-xs text-slate-400">Students</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">{completionRate}%</div>
          <div className="text-xs text-slate-400">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{subjects.length}</div>
          <div className="text-xs text-slate-400">Subjects</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Scoring Progress</span>
          <span>{completionRate}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Link
          to="/dashboard/teaching-portal"
          className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200"
        >
          Enter Scores
        </Link>
        
        <button className="bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200">
          View Class
        </button>
      </div>

      {/* Assignment Summary */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Teaching Assignments:</span>
            <span className="text-slate-300">{classes.length} classes, {subjects.length} subjects</span>
          </div>
          <div className="flex justify-between">
            <span>Current:</span>
            <span className="text-teal-300">{currentClass} • {currentSubject}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringQuickAccess;
