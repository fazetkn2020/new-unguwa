import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getExamBankKey, getInitialScoreEntry } from '../../data/examBankTemplate';
import { ScoreEntryTable } from '../../components/scoring';

export default function ScoreCenter() {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [studentRoster, setStudentRoster] = useState([]);
  const [examData, setExamData] = useState({});
  
  // Get assigned classes and subjects from user data
  const assignedClasses = user?.assignedClasses || [];
  const assignedSubjects = user?.assignedSubjects || [];

  useEffect(() => {
    if (selectedClass) {
      const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
      const classStudents = classLists[selectedClass] || [];
      setStudentRoster(classStudents);
    } else {
      setStudentRoster([]);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      const key = getExamBankKey(selectedClass, selectedSubject);
      const data = JSON.parse(localStorage.getItem(key)) || {};
      setExamData(data);
    }
  }, [selectedClass, selectedSubject]);

  const updateScore = (studentIdentifier, subject, scoreType, value) => {
    if (!selectedClass || !selectedSubject) return;

    const key = getExamBankKey(selectedClass, selectedSubject);
    const currentData = JSON.parse(localStorage.getItem(key)) || {};

    if (!currentData[studentIdentifier]) {
      currentData[studentIdentifier] = getInitialScoreEntry(studentIdentifier, selectedSubject);
    }

    currentData[studentIdentifier][scoreType] = value;

    // Calculate total if both scores are available
    const caScore = currentData[studentIdentifier].ca !== "" ? parseInt(currentData[studentIdentifier].ca) : 0;
    const examScore = currentData[studentIdentifier].exam !== "" ? parseInt(currentData[studentIdentifier].exam) : 0;
    currentData[studentIdentifier].total = Math.min(100, caScore + examScore);

    localStorage.setItem(key, JSON.stringify(currentData));
    setExamData(currentData);
  };

  // Check if user is assigned to teach any classes/subjects
  if (assignedClasses.length === 0 || assignedSubjects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
            <div className="text-yellow-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-white mb-4">No Teaching Assignment</h1>
            <p className="text-blue-200 text-lg mb-6">
              You have not been assigned to teach any classes or subjects.
            </p>
            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-yellow-200">
                Please contact <strong>VP Admin</strong> or <strong>VP Academic</strong> to get assigned to classes and subjects.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Score Center</h1>
              <p className="text-blue-200">Enter scores for your assigned classes and subjects</p>
            </div>
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-3">
              <p className="text-white text-sm">
                <strong>Assigned:</strong> {assignedClasses.length} classes, {assignedSubjects.length} subjects
              </p>
            </div>
          </div>

          {/* Class and Subject Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <label className="block text-white font-semibold mb-3">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a class</option>
                {assignedClasses.map(cls => (
                  <option key={cls} value={cls} className="text-gray-900">{cls}</option>
                ))}
              </select>
              <p className="text-blue-200 text-xs mt-2">
                Your assigned classes: {assignedClasses.join(', ')}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <label className="block text-white font-semibold mb-3">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a subject</option>
                {assignedSubjects.map(subject => (
                  <option key={subject} value={subject} className="text-gray-900">{subject}</option>
                ))}
              </select>
              <p className="text-blue-200 text-xs mt-2">
                Your assigned subjects: {assignedSubjects.join(', ')}
              </p>
            </div>
          </div>

          {/* Rest of component remains the same */}
          {selectedClass && (
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">
                    {selectedClass} - {studentRoster.length} Students
                  </h3>
                  <p className="text-blue-200 text-sm">
                    {selectedSubject ? `Scoring for: ${selectedSubject}` : 'Select a subject to begin scoring'}
                  </p>
                </div>
                {studentRoster.length === 0 && (
                  <p className="text-yellow-300 text-sm">
                    💡 No students in this class. Ask VP Admin to enroll students.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Score Entry Table */}
          {selectedClass && selectedSubject ? (
            studentRoster.length > 0 ? (
              <ScoreEntryTable
                students={studentRoster}
                selectedSubject={selectedSubject}
                examData={examData}
                updateScore={updateScore}
                currentClass={selectedClass}
              />
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <div className="text-yellow-400 text-6xl mb-4">🎓</div>
                <h3 className="text-white text-xl font-semibold mb-2">No Students Found</h3>
                <p className="text-blue-200">
                  There are no students enrolled in {selectedClass}.<br />
                  Please ask the VP Admin to enroll students in this class.
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
              <div className="text-blue-400 text-6xl mb-4">📝</div>
              <h3 className="text-white text-xl font-semibold mb-2">Ready to Score</h3>
              <p className="text-blue-200">
                Select a class and subject from your assignments to begin score entry.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
