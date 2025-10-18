import React from 'react';

const TeachingNavigation = ({ 
  teaching, 
  compact = false,
  onClassChange,
  onSubjectChange 
}) => {
  const {
    subjects,
    classes,
    currentSubject,
    currentClass,
    currentSubjectIndex,
    currentClassIndex,
    nextSubject,
    prevSubject,
    nextClass,
    prevClass
  } = teaching;

  // Don't render if no teaching assignments
  if (subjects.length === 0 || classes.length === 0) {
    return null;
  }

  if (compact) {
    // Compact version for dashboard widgets
    return (
      <div className="bg-slate-800/40 rounded-xl border border-slate-700 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
          <h3 className="font-semibold text-white text-lg">Active Assignment</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Current Class */}
          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Class</span>
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                {currentClassIndex + 1} of {Math.max(classes.length, 1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{currentClass}</span>
              <div className="flex gap-1">
                <button
                  onClick={prevClass}
                  className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-slate-300 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  disabled={classes.length <= 1}
                >
                  ←
                </button>
                <button
                  onClick={nextClass}
                  className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-slate-300 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  disabled={classes.length <= 1}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Current Subject */}
          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Subject</span>
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                {currentSubjectIndex + 1} of {Math.max(subjects.length, 1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{currentSubject}</span>
              <div className="flex gap-1">
                <button
                  onClick={prevSubject}
                  className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-slate-300 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  disabled={subjects.length <= 1}
                >
                  ←
                </button>
                <button
                  onClick={nextSubject}
                  className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-slate-300 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  disabled={subjects.length <= 1}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full version for teaching portal
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Teaching Navigation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class Navigation */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Current Class
          </h3>
          
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex-1">
              <div className="text-2xl font-bold text-blue-800">{currentClass}</div>
              <div className="text-sm text-blue-600 mt-1">
                Class {currentClassIndex + 1} of {classes.length}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={prevClass}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={classes.length <= 1}
                title="Previous class"
              >
                ←
              </button>
              <button
                onClick={nextClass}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={classes.length <= 1}
                title="Next class"
              >
                →
              </button>
            </div>
          </div>

          {/* Class List */}
          <div className="text-sm">
            <span className="text-gray-600">All classes: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {classes.map((cls, index) => (
                <button
                  key={cls}
                  onClick={() => onClassChange?.(index)}
                  className={`px-2 py-1 rounded text-xs ${
                    index === currentClassIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Navigation */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Current Subject
          </h3>
          
          <div className="flex items-center justify-between bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex-1">
              <div className="text-2xl font-bold text-green-800">{currentSubject}</div>
              <div className="text-sm text-green-600 mt-1">
                Subject {currentSubjectIndex + 1} of {subjects.length}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={prevSubject}
                className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center text-white transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={subjects.length <= 1}
                title="Previous subject"
              >
                ←
              </button>
              <button
                onClick={nextSubject}
                className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center text-white transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={subjects.length <= 1}
                title="Next subject"
              >
                →
              </button>
            </div>
          </div>

          {/* Subject List */}
          <div className="text-sm">
            <span className="text-gray-600">All subjects: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {subjects.map((subject, index) => (
                <button
                  key={subject}
                  onClick={() => onSubjectChange?.(index)}
                  className={`px-2 py-1 rounded text-xs ${
                    index === currentSubjectIndex
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{classes.length}</div>
          <div className="text-xs text-gray-600">Classes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{subjects.length}</div>
          <div className="text-xs text-gray-600">Subjects</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {teaching.getCurrentClassStudents().length}
          </div>
          <div className="text-xs text-gray-600">Students</div>
        </div>
      </div>
    </div>
  );
};

export default TeachingNavigation;
