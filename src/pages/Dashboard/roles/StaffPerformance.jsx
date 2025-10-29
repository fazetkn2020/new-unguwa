// src/pages/Dashboard/roles/StaffPerformance.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function StaffPerformance() {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [filter, setFilter] = useState('all'); // all, teachers, form_masters, senior_masters
  const [sortBy, setSortBy] = useState('completion'); // completion, score, name

  useEffect(() => {
    loadStaffPerformance();
  }, []);

  const loadStaffPerformance = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const examData = JSON.parse(localStorage.getItem('examData')) || {};
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    const schoolQuestions = JSON.parse(localStorage.getItem('schoolQuestions')) || [];

    const teachingStaff = users.filter(u => 
      ['Subject Teacher', 'Form Master', 'Senior Master', 'Exam Officer', 'VP Academic', 'VP Admin'].includes(u.role)
    );

    const staffWithPerformance = teachingStaff.map(staffMember => {
      // Teaching performance metrics
      const teachingMetrics = calculateTeachingPerformance(staffMember, examData, users);
      
      // Question submission metrics (for teachers)
      const questionMetrics = calculateQuestionMetrics(staffMember, schoolQuestions);
      
      // Attendance metrics
      const attendanceMetrics = calculateStaffAttendance(staffMember, attendanceRecords);
      
      // Overall performance score
      const overallScore = calculateOverallScore(teachingMetrics, questionMetrics, attendanceMetrics, staffMember.role);

      return {
        ...staffMember,
        teachingMetrics,
        questionMetrics,
        attendanceMetrics,
        overallScore,
        performanceLevel: getPerformanceLevel(overallScore)
      };
    });

    setStaff(staffWithPerformance);
  };

  const calculateTeachingPerformance = (staffMember, examData, users) => {
    if (!['Subject Teacher', 'Form Master'].includes(staffMember.role)) {
      return { completionRate: 0, averageScore: 0, studentsAssessed: 0, totalStudents: 0 };
    }

    const classes = staffMember.assignedClasses || [];
    const subjects = staffMember.assignedSubjects || [];
    
    let totalStudents = 0;
    let completedAssessments = 0;
    let totalScore = 0;

    classes.forEach(className => {
      subjects.forEach(subject => {
        const classStudents = users.filter(u => 
          u.role === 'Student' && u.assignedClasses?.includes(className)
        );
        
        totalStudents += classStudents.length;
        
        classStudents.forEach(student => {
          const studentId = `${className}_${student.name?.replace(/\s+/g, '_')}`;
          const scores = examData[studentId]?.[subject];
          if (scores && scores.ca !== '' && scores.exam !== '') {
            completedAssessments++;
            totalScore += scores.total || 0;
          }
        });
      });
    });

    const completionRate = totalStudents > 0 ? (completedAssessments / totalStudents) * 100 : 0;
    const averageScore = completedAssessments > 0 ? totalScore / completedAssessments : 0;

    return {
      completionRate: Math.round(completionRate),
      averageScore: Math.round(averageScore),
      studentsAssessed: completedAssessments,
      totalStudents
    };
  };

  const calculateQuestionMetrics = (staffMember, schoolQuestions) => {
    if (!['Subject Teacher', 'Form Master'].includes(staffMember.role)) {
      return { questionsSubmitted: 0, questionsApproved: 0, approvalRate: 0 };
    }

    const teacherQuestions = schoolQuestions.filter(q => q.createdBy === staffMember.id);
    const approvedQuestions = teacherQuestions.filter(q => q.status === 'approved');

    const approvalRate = teacherQuestions.length > 0 ? 
      (approvedQuestions.length / teacherQuestions.length) * 100 : 0;

    return {
      questionsSubmitted: teacherQuestions.length,
      questionsApproved: approvedQuestions.length,
      approvalRate: Math.round(approvalRate)
    };
  };

  const calculateStaffAttendance = (staffMember, attendanceRecords) => {
    // This would integrate with actual staff attendance system
    // For now, using placeholder data
    const totalDays = 20; // Example: 20 school days in period
    const daysPresent = Math.floor(Math.random() * 18) + 15; // Random between 15-20
    
    const attendanceRate = (daysPresent / totalDays) * 100;

    return {
      daysPresent,
      totalDays,
      attendanceRate: Math.round(attendanceRate)
    };
  };

  const calculateOverallScore = (teachingMetrics, questionMetrics, attendanceMetrics, role) => {
    let score = 0;
    let weightCount = 0;

    // Teaching performance weight (for teaching staff)
    if (['Subject Teacher', 'Form Master'].includes(role)) {
      score += teachingMetrics.completionRate * 0.4;
      score += teachingMetrics.averageScore * 0.3;
      weightCount += 0.7;
    }

    // Question submission weight (for teaching staff)
    if (['Subject Teacher', 'Form Master'].includes(role)) {
      score += questionMetrics.approvalRate * 0.2;
      weightCount += 0.2;
    }

    // Attendance weight (for all staff)
    score += attendanceMetrics.attendanceRate * 0.1;
    weightCount += 0.1;

    // Normalize score
    return weightCount > 0 ? Math.round(score / weightCount) : 0;
  };

  const getPerformanceLevel = (score) => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 60) return 'satisfactory';
    return 'needs_improvement';
  };

  const getPerformanceColor = (level) => {
    switch (level) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'satisfactory': return 'text-yellow-600 bg-yellow-100';
      case 'needs_improvement': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceText = (level) => {
    switch (level) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'satisfactory': return 'Satisfactory';
      case 'needs_improvement': return 'Needs Improvement';
      default: return 'Not Rated';
    }
  };

  const getFilteredStaff = () => {
    let filtered = staff;

    if (filter === 'teachers') {
      filtered = staff.filter(s => ['Subject Teacher', 'Form Master'].includes(s.role));
    } else if (filter === 'form_masters') {
      filtered = staff.filter(s => s.role === 'Form Master');
    } else if (filter === 'senior_masters') {
      filtered = staff.filter(s => ['Senior Master', 'Exam Officer'].includes(s.role));
    }

    // Sort staff
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'completion':
          return b.teachingMetrics.completionRate - a.teachingMetrics.completionRate;
        case 'score':
          return b.teachingMetrics.averageScore - a.teachingMetrics.averageScore;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return b.overallScore - a.overallScore;
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Staff Performance Overview</h2>
        <p className="text-gray-600">Comprehensive evaluation of teaching and administrative staff</p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Role</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Staff</option>
              <option value="teachers">Teaching Staff</option>
              <option value="form_masters">Form Masters</option>
              <option value="senior_masters">Senior Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="overall">Overall Performance</option>
              <option value="completion">Score Completion</option>
              <option value="score">Average Score</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              {getFilteredStaff().length} staff members
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {staff.filter(s => s.performanceLevel === 'excellent').length}
          </div>
          <div className="text-sm text-gray-600">Excellent</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {staff.filter(s => s.performanceLevel === 'good').length}
          </div>
          <div className="text-sm text-gray-600">Good</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {staff.filter(s => s.performanceLevel === 'satisfactory').length}
          </div>
          <div className="text-sm text-gray-600">Satisfactory</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {staff.filter(s => s.performanceLevel === 'needs_improvement').length}
          </div>
          <div className="text-sm text-gray-600">Needs Improvement</div>
        </div>
      </div>

      {/* Staff Performance Grid */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Staff Performance Details</h3>
        </div>

        <div className="divide-y">
          {getFilteredStaff().length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No staff members found matching your filters.
            </div>
          ) : (
            getFilteredStaff().map(staffMember => (
              <div key={staffMember.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{staffMember.name}</h4>
                    <div className="text-sm text-gray-600">
                      {staffMember.role} • {staffMember.assignedClasses?.join(', ') || 'No classes assigned'}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(staffMember.performanceLevel)}`}>
                    {getPerformanceText(staffMember.performanceLevel)} ({staffMember.overallScore}%)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Teaching Performance */}
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Teaching Performance</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Score Completion:</span>
                        <span className="font-medium">{staffMember.teachingMetrics.completionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Score:</span>
                        <span className="font-medium">{staffMember.teachingMetrics.averageScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Students Assessed:</span>
                        <span className="font-medium">{staffMember.teachingMetrics.studentsAssessed}/{staffMember.teachingMetrics.totalStudents}</span>
                      </div>
                    </div>
                  </div>

                  {/* Question Contributions */}
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Question Contributions</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Questions Submitted:</span>
                        <span className="font-medium">{staffMember.questionMetrics.questionsSubmitted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions Approved:</span>
                        <span className="font-medium">{staffMember.questionMetrics.questionsApproved}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Approval Rate:</span>
                        <span className="font-medium">{staffMember.questionMetrics.approvalRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance & Overall */}
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Attendance & Overall</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Attendance Rate:</span>
                        <span className="font-medium">{staffMember.attendanceMetrics.attendanceRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Days Present:</span>
                        <span className="font-medium">{staffMember.attendanceMetrics.daysPresent}/{staffMember.attendanceMetrics.totalDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overall Score:</span>
                        <span className="font-bold text-lg">{staffMember.overallScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Progress Bars */}
                <div className="mt-4 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Teaching Performance</span>
                      <span>{staffMember.teachingMetrics.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${staffMember.teachingMetrics.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Question Contribution</span>
                      <span>{staffMember.questionMetrics.approvalRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${staffMember.questionMetrics.approvalRate}%` }}
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
