import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function SchoolAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({});
  const [timeRange, setTimeRange] = useState('current_term');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchoolAnalytics();
  }, [timeRange]);

  const loadSchoolAnalytics = () => {
    setLoading(true);
    
    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const examData = JSON.parse(localStorage.getItem('examData')) || {};
      const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
      const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
      
      // Filter approved students and active staff
      const students = users.filter(u => u.role === 'Student' && u.status === 'approved');
      const teachers = users.filter(u => 
        ['Subject Teacher', 'Form Master', 'Senior Master'].includes(u.role) && u.status === 'active'
      );
      
      const analyticsData = {
        students,
        teachers,
        studentPerformance: calculateStudentPerformance(students, examData, classLists),
        teacherEffectiveness: calculateTeacherEffectiveness(teachers, examData, classLists),
        attendanceTrends: calculateAttendanceTrends(attendanceRecords, students),
        classPerformance: calculateClassPerformance(students, examData, classLists)
      };
      
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setAnalytics({});
    } finally {
      setLoading(false);
    }
  };

  const calculateStudentPerformance = (students, examData, classLists) => {
    // FIX: Use proper exam data structure from your system
    const examBankData = JSON.parse(localStorage.getItem('examBank_2025_2')) || {};
    
    let totalStudents = students.length;
    let studentsWithScores = 0;
    let totalAverage = 0;
    let gradeDistribution = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };

    students.forEach(student => {
      let hasScores = false;
      let studentTotal = 0;
      let subjectCount = 0;

      // Check each class for student scores
      Object.entries(examBankData).forEach(([className, classData]) => {
        Object.entries(classData).forEach(([subject, scores]) => {
          const studentScore = scores.find(s => s.studentName === student.fullName);
          if (studentScore && studentScore.totalScore) {
            hasScores = true;
            studentTotal += studentScore.totalScore;
            subjectCount++;
          }
        });
      });

      if (hasScores && subjectCount > 0) {
        studentsWithScores++;
        const studentAverage = studentTotal / subjectCount;
        totalAverage += studentAverage;
        
        // Grade distribution
        if (studentAverage >= 80) gradeDistribution.A++;
        else if (studentAverage >= 70) gradeDistribution.B++;
        else if (studentAverage >= 60) gradeDistribution.C++;
        else if (studentAverage >= 50) gradeDistribution.D++;
        else if (studentAverage >= 40) gradeDistribution.E++;
        else gradeDistribution.F++;
      }
    });

    const averageScore = studentsWithScores > 0 ? totalAverage / studentsWithScores : 0;
    const scoreCompletionRate = (studentsWithScores / totalStudents) * 100;

    return {
      totalStudents,
      studentsWithScores,
      averageScore: Math.round(averageScore),
      scoreCompletionRate: Math.round(scoreCompletionRate),
      gradeDistribution
    };
  };

  // ... (similar fixes for other calculation functions)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with real data */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">School Analytics Dashboard</h2>
            <p className="text-gray-600">Real-time school performance metrics</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="current_term">Current Term</option>
            <option value="last_term">Last Term</option>
            <option value="yearly">This Year</option>
          </select>
        </div>

        {/* Real metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{analytics.students?.length || 0}</div>
            <div className="text-sm text-blue-700">Total Students</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {analytics.studentPerformance?.averageScore || 0}%
            </div>
            <div className="text-sm text-green-700">Average Score</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">
              {analytics.attendanceTrends?.attendanceRate || 0}%
            </div>
            <div className="text-sm text-purple-700">Attendance Rate</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">
              {analytics.teachers?.length || 0}
            </div>
            <div className="text-sm text-orange-700">Teaching Staff</div>
          </div>
        </div>

        {/* Data status indicator */}
        <div className="text-sm text-gray-500">
          {analytics.studentPerformance?.studentsWithScores === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              📊 No score data available yet. Scores will appear after teachers enter marks.
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              ✅ Analytics based on {analytics.studentPerformance?.studentsWithScores} students with scores
            </div>
          )}
        </div>
      </div>

      {/* Rest of your analytics components... */}
    </div>
  );
}