import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function TeacherPerformance() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [performance, setPerformance] = useState({});

  useEffect(() => {
    loadTeacherPerformance();
  }, []);

  const loadTeacherPerformance = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const teachingStaff = users.filter(u => 
      ['Subject Teacher', 'Form Master'].includes(u.role)
    );
    setTeachers(teachingStaff);

    // Calculate performance metrics
    const examData = JSON.parse(localStorage.getItem('examData')) || {};
    const performanceData = {};

    teachingStaff.forEach(teacher => {
      const classes = teacher.assignedClasses || [];
      const subjects = teacher.assignedSubjects || [];
      
      let totalStudents = 0;
      let completedScores = 0;
      let averageScore = 0;

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
              completedScores++;
              averageScore += scores.total || 0;
            }
          });
        });
      });

      const completionRate = totalStudents > 0 ? (completedScores / totalStudents) * 100 : 0;
      const avgScore = completedScores > 0 ? averageScore / completedScores : 0;

      performanceData[teacher.id] = {
        completionRate: Math.round(completionRate),
        averageScore: Math.round(avgScore),
        studentsAssessed: completedScores,
        totalStudents: totalStudents
      };
    });

    setPerformance(performanceData);
  };

  const getPerformanceColor = (rate) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Teacher Performance Overview</h2>
        <p className="text-gray-600">
          Monitor teaching staff performance and score submission metrics
        </p>
      </div>

      {/* Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(teacher => {
          const stats = performance[teacher.id] || {
            completionRate: 0,
            averageScore: 0,
            studentsAssessed: 0,
            totalStudents: 0
          };

          return (
            <div key={teacher.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">{teacher.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{teacher.role}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Score Completion:</span>
                    <span className={getPerformanceColor(stats.completionRate)}>
                      {stats.completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Average Score:</span>
                  <span className={getScoreColor(stats.averageScore)}>
                    {stats.averageScore}%
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Students Assessed:</span>
                  <span>
                    {stats.studentsAssessed}/{stats.totalStudents}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  Classes: {teacher.assignedClasses?.join(', ') || 'None'}
                </div>
                <div className="text-xs text-gray-500">
                  Subjects: {teacher.assignedSubjects?.join(', ') || 'None'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{teachers.length}</div>
            <div className="text-sm text-gray-600">Total Teachers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                teachers.reduce((sum, teacher) => {
                  const stats = performance[teacher.id];
                  return sum + (stats?.completionRate || 0);
                }, 0) / Math.max(teachers.length, 1)
              )}%
            </div>
            <div className="text-sm text-gray-600">Avg Completion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(
                teachers.reduce((sum, teacher) => {
                  const stats = performance[teacher.id];
                  return sum + (stats?.averageScore || 0);
                }, 0) / Math.max(teachers.length, 1)
              )}%
            </div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {teachers.reduce((sum, teacher) => {
                const stats = performance[teacher.id];
                return sum + (stats?.studentsAssessed || 0);
              }, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Assessed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
