// src/pages/Dashboard/roles/SubjectInsights.jsx
import React, { useState, useEffect } from 'react';

export default function SubjectInsights() {
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('2');

  useEffect(() => {
    loadSubjectInsights();
  }, [selectedClass, selectedTerm]);

  const loadSubjectInsights = () => {
    const examData = JSON.parse(localStorage.getItem('examData')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Get all students
    const students = users.filter(u => u.role === 'Student');
    
    // Get all subjects from exam data
    const allSubjects = new Set();
    Object.values(examData).forEach(studentScores => {
      Object.keys(studentScores).forEach(subject => {
        allSubjects.add(subject);
      });
    });

    const subjectsData = Array.from(allSubjects).map(subject => {
      const subjectScores = [];
      
      // Collect all scores for this subject
      Object.entries(examData).forEach(([studentId, studentScores]) => {
        if (studentScores[subject]) {
          const totalScore = studentScores[subject].total || 0;
          subjectScores.push(totalScore);
        }
      });

      // Calculate grades distribution
      const gradeCounts = {
        A: 0, B: 0, C: 0, D: 0, E: 0, F: 0
      };

      subjectScores.forEach(score => {
        if (score >= 80) gradeCounts.A++;
        else if (score >= 70) gradeCounts.B++;
        else if (score >= 60) gradeCounts.C++;
        else if (score >= 50) gradeCounts.D++;
        else if (score >= 40) gradeCounts.E++;
        else gradeCounts.F++;
      });

      const totalStudents = subjectScores.length;
      const percentages = {
        A: totalStudents > 0 ? (gradeCounts.A / totalStudents * 100).toFixed(1) : 0,
        B: totalStudents > 0 ? (gradeCounts.B / totalStudents * 100).toFixed(1) : 0,
        C: totalStudents > 0 ? (gradeCounts.C / totalStudents * 100).toFixed(1) : 0,
        D: totalStudents > 0 ? (gradeCounts.D / totalStudents * 100).toFixed(1) : 0,
        E: totalStudents > 0 ? (gradeCounts.E / totalStudents * 100).toFixed(1) : 0,
        F: totalStudents > 0 ? (gradeCounts.F / totalStudents * 100).toFixed(1) : 0,
      };

      const averageScore = totalStudents > 0 
        ? (subjectScores.reduce((sum, score) => sum + score, 0) / totalStudents).toFixed(1)
        : 0;

      return {
        name: subject,
        totalStudents,
        averageScore,
        gradeCounts,
        percentages
      };
    });

    setSubjects(subjectsData);
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-orange-600';
      case 'E': return 'text-red-500';
      case 'F': return 'text-red-700';
      default: return 'text-gray-600';
    }
  };

  const getGradeBgColor = (grade) => {
    switch (grade) {
      case 'A': return 'bg-green-100';
      case 'B': return 'bg-blue-100';
      case 'C': return 'bg-yellow-100';
      case 'D': return 'bg-orange-100';
      case 'E': return 'bg-red-100';
      case 'F': return 'bg-red-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Subject Performance Insights</h2>
        <p className="text-gray-600">
          A/B/C grade distribution percentages across all subjects
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Classes</option>
              {/* Would populate with actual classes */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="1">1st Term</option>
              <option value="2">2nd Term</option>
              <option value="3">3rd Term</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Analyzing {subjects.length} subjects
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{subjects.length}</div>
          <div className="text-sm text-gray-600">Subjects</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {subjects.filter(s => s.averageScore >= 60).length}
          </div>
          <div className="text-sm text-gray-600">Good Performance (60%+)</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {subjects.filter(s => s.averageScore >= 50 && s.averageScore < 60).length}
          </div>
          <div className="text-sm text-gray-600">Average (50-59%)</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {subjects.filter(s => s.averageScore < 50).length}
          </div>
          <div className="text-sm text-gray-600">Needs Improvement</div>
        </div>
      </div>

      {/* Subjects List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Subject Performance Breakdown</h3>
        </div>

        <div className="divide-y">
          {subjects.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No subject data available. Scores need to be entered first.
            </div>
          ) : (
            subjects.map(subject => (
              <div key={subject.name} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{subject.name}</h4>
                    <div className="text-sm text-gray-600">
                      {subject.totalStudents} students • Average: {subject.averageScore}%
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    subject.averageScore >= 70 ? 'bg-green-100 text-green-800' :
                    subject.averageScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {subject.averageScore >= 70 ? 'Excellent' :
                     subject.averageScore >= 50 ? 'Average' : 'Needs Attention'}
                  </div>
                </div>

                {/* Grade Distribution */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {['A', 'B', 'C', 'D', 'E', 'F'].map(grade => (
                    <div key={grade} className={`p-3 rounded-lg text-center ${getGradeBgColor(grade)}`}>
                      <div className={`text-lg font-bold ${getGradeColor(grade)}`}>
                        {subject.percentages[grade]}%
                      </div>
                      <div className="text-xs text-gray-600">Grade {grade}</div>
                      <div className="text-xs text-gray-500">
                        ({subject.gradeCounts[grade]} students)
                      </div>
                    </div>
                  ))}
                </div>

                {/* Performance Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Grade Distribution</span>
                    <span>Total: {subject.totalStudents} students</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="flex h-2 rounded-full">
                      <div 
                        className="bg-green-500" 
                        style={{ width: `${subject.percentages.A}%` }}
                        title={`A: ${subject.percentages.A}%`}
                      ></div>
                      <div 
                        className="bg-blue-500" 
                        style={{ width: `${subject.percentages.B}%` }}
                        title={`B: ${subject.percentages.B}%`}
                      ></div>
                      <div 
                        className="bg-yellow-500" 
                        style={{ width: `${subject.percentages.C}%` }}
                        title={`C: ${subject.percentages.C}%`}
                      ></div>
                      <div 
                        className="bg-orange-500" 
                        style={{ width: `${subject.percentages.D}%` }}
                        title={`D: ${subject.percentages.D}%`}
                      ></div>
                      <div 
                        className="bg-red-500" 
                        style={{ width: `${subject.percentages.E}%` }}
                        title={`E: ${subject.percentages.E}%`}
                      ></div>
                      <div 
                        className="bg-red-700" 
                        style={{ width: `${subject.percentages.F}%` }}
                        title={`F: ${subject.percentages.F}%`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
