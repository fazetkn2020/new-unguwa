// src/pages/Dashboard/roles/SchoolAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function SchoolAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({});
  const [timeRange, setTimeRange] = useState('current_term'); // current_term, last_term, yearly

  useEffect(() => {
    loadSchoolAnalytics();
  }, [timeRange]);

  const loadSchoolAnalytics = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const examData = JSON.parse(localStorage.getItem('examData')) || {};
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    
    // Calculate comprehensive analytics
    const students = users.filter(u => u.role === 'Student');
    const teachers = users.filter(u => 
      ['Subject Teacher', 'Form Master', 'Senior Master'].includes(u.role)
    );
    
    // Student Performance
    const studentPerformance = calculateStudentPerformance(students, examData);
    
    // Teacher Effectiveness
    const teacherEffectiveness = calculateTeacherEffectiveness(teachers, examData);
    
    // Attendance Trends
    const attendanceTrends = calculateAttendanceTrends(attendanceRecords, students);
    
    // Class Performance
    const classPerformance = calculateClassPerformance(students, examData);
    
    setAnalytics({
      students,
      teachers,
      studentPerformance,
      teacherEffectiveness,
      attendanceTrends,
      classPerformance
    });
  };

  const calculateStudentPerformance = (students, examData) => {
    let totalStudents = students.length;
    let studentsWithScores = 0;
    let totalAverage = 0;
    let gradeDistribution = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };

    students.forEach(student => {
      const studentId = `${student.assignedClasses?.[0]}_${student.name?.replace(/\s+/g, '_')}`;
      const scores = examData[studentId];
      
      if (scores && Object.keys(scores).length > 0) {
        studentsWithScores++;
        const studentAverage = calculateStudentAverage(scores);
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

  const calculateStudentAverage = (scores) => {
    const subjectAverages = Object.values(scores).map(subject => 
      subject.total || ((subject.ca || 0) + (subject.exam || 0))
    );
    return subjectAverages.reduce((sum, avg) => sum + avg, 0) / subjectAverages.length;
  };

  const calculateTeacherEffectiveness = (teachers, examData) => {
    const teacherStats = teachers.map(teacher => {
      const classes = teacher.assignedClasses || [];
      const subjects = teacher.assignedSubjects || [];
      
      let totalStudents = 0;
      let completedAssessments = 0;
      let totalScore = 0;

      classes.forEach(className => {
        subjects.forEach(subject => {
          const classStudents = teachers.filter(t => 
            t.role === 'Student' && t.assignedClasses?.includes(className)
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
        teacherName: teacher.name,
        role: teacher.role,
        completionRate: Math.round(completionRate),
        averageScore: Math.round(averageScore),
        studentsAssessed: completedAssessments,
        totalStudents
      };
    });

    return teacherStats.sort((a, b) => b.completionRate - a.completionRate);
  };

  const calculateAttendanceTrends = (attendanceRecords, students) => {
    const totalDays = Object.keys(attendanceRecords).length;
    let totalPresent = 0;
    let totalPossible = 0;

    Object.values(attendanceRecords).forEach(dayAttendance => {
      Object.values(dayAttendance).forEach(record => {
        totalPossible++;
        if (record.status === 'present') totalPresent++;
      });
    });

    const attendanceRate = totalPossible > 0 ? (totalPresent / totalPossible) * 100 : 0;

    return {
      totalDays,
      attendanceRate: Math.round(attendanceRate),
      totalPresent,
      totalPossible
    };
  };

  const calculateClassPerformance = (students, examData) => {
    const classStats = {};
    
    students.forEach(student => {
      const className = student.assignedClasses?.[0];
      if (!className) return;
      
      if (!classStats[className]) {
        classStats[className] = {
          totalStudents: 0,
          studentsWithScores: 0,
          totalScore: 0,
          gradeDistribution: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }
        };
      }
      
      classStats[className].totalStudents++;
      
      const studentId = `${className}_${student.name?.replace(/\s+/g, '_')}`;
      const scores = examData[studentId];
      
      if (scores && Object.keys(scores).length > 0) {
        classStats[className].studentsWithScores++;
        const average = calculateStudentAverage(scores);
        classStats[className].totalScore += average;
        
        if (average >= 80) classStats[className].gradeDistribution.A++;
        else if (average >= 70) classStats[className].gradeDistribution.B++;
        else if (average >= 60) classStats[className].gradeDistribution.C++;
        else if (average >= 50) classStats[className].gradeDistribution.D++;
        else if (average >= 40) classStats[className].gradeDistribution.E++;
        else classStats[className].gradeDistribution.F++;
      }
    });

    // Calculate averages
    Object.keys(classStats).forEach(className => {
      const stats = classStats[className];
      stats.averageScore = stats.studentsWithScores > 0 ? 
        Math.round(stats.totalScore / stats.studentsWithScores) : 0;
      stats.completionRate = Math.round((stats.studentsWithScores / stats.totalStudents) * 100);
    });

    return classStats;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">School Analytics Dashboard</h2>
            <p className="text-gray-600">Comprehensive overview of school performance and metrics</p>
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

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{analytics.students?.length || 0}</div>
            <div className="text-sm text-blue-700">Total Students</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {analytics.studentPerformance?.averageScore || 0}%
            </div>
            <div className="text-sm text-green-700">Average Score</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analytics.attendanceTrends?.attendanceRate || 0}%
            </div>
            <div className="text-sm text-purple-700">Attendance Rate</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analytics.teachers?.length || 0}
            </div>
            <div className="text-sm text-orange-700">Teaching Staff</div>
          </div>
        </div>
      </div>

      {/* Student Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Student Performance Overview</h3>
        {analytics.studentPerformance && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Grade Distribution</h4>
              <div className="space-y-2">
                {Object.entries(analytics.studentPerformance.gradeDistribution).map(([grade, count]) => (
                  <div key={grade} className="flex justify-between items-center">
                    <span className="font-medium">Grade {grade}</span>
                    <span className="text-gray-600">{count} students</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Performance Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Score Completion</span>
                    <span>{analytics.studentPerformance.scoreCompletionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${analytics.studentPerformance.scoreCompletionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Students with Scores</span>
                  <span>{analytics.studentPerformance.studentsWithScores}/{analytics.studentPerformance.totalStudents}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Class Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Class Performance</h3>
        {analytics.classPerformance && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Class</th>
                  <th className="px-4 py-2 text-left">Students</th>
                  <th className="px-4 py-2 text-left">Avg Score</th>
                  <th className="px-4 py-2 text-left">Completion</th>
                  <th className="px-4 py-2 text-left">Top Grade</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.classPerformance).map(([className, stats]) => {
                  const topGrade = Object.entries(stats.gradeDistribution)
                    .sort(([,a], [,b]) => b - a)[0];
                  
                  return (
                    <tr key={className} className="border-t">
                      <td className="px-4 py-2 font-medium">{className}</td>
                      <td className="px-4 py-2">{stats.totalStudents}</td>
                      <td className="px-4 py-2">{stats.averageScore}%</td>
                      <td className="px-4 py-2">{stats.completionRate}%</td>
                      <td className="px-4 py-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {topGrade[0]} ({topGrade[1]})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Teacher Effectiveness */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Teacher Effectiveness</h3>
        {analytics.teacherEffectiveness && analytics.teacherEffectiveness.length > 0 ? (
          <div className="space-y-4">
            {analytics.teacherEffectiveness.slice(0, 5).map((teacher, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{teacher.teacherName}</h4>
                  <span className="text-sm text-gray-600">{teacher.role}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Completion:</span>
                    <span className="ml-2 font-medium">{teacher.completionRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Score:</span>
                    <span className="ml-2 font-medium">{teacher.averageScore}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Assessed:</span>
                    <span className="ml-2 font-medium">{teacher.studentsAssessed}/{teacher.totalStudents}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Performance:</span>
                    <span className={`ml-2 font-medium ${
                      teacher.completionRate >= 80 ? 'text-green-600' :
                      teacher.completionRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {teacher.completionRate >= 80 ? 'Excellent' :
                       teacher.completionRate >= 60 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No teacher performance data available</p>
        )}
      </div>
    </div>
  );
}
