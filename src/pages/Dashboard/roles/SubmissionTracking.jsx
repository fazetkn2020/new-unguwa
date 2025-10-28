import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function SubmissionTracking() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    loadSubmissions();
    loadTeachers();
  }, []);

  const loadSubmissions = () => {
    const savedSubmissions = JSON.parse(localStorage.getItem('examSubmissions')) || [];
    setSubmissions(savedSubmissions);
  };

  const loadTeachers = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const teachingStaff = users.filter(u => 
      ['Subject Teacher', 'Form Master'].includes(u.role)
    );
    setTeachers(teachingStaff);
  };

  const markSubmission = (teacherId, className, subject, status) => {
    const today = new Date().toISOString().split('T')[0];
    const submission = {
      id: Date.now().toString(),
      teacherId,
      teacherName: teachers.find(t => t.id === teacherId)?.name,
      className,
      subject,
      status,
      submittedAt: new Date().toISOString(),
      receivedBy: user.name,
      date: today
    };

    const updatedSubmissions = [...submissions, submission];
    setSubmissions(updatedSubmissions);
    localStorage.setItem('examSubmissions', JSON.stringify(updatedSubmissions));
  };

  const getSubmissionStatus = (teacherId, className, subject) => {
    const teacherSubmission = submissions.find(s => 
      s.teacherId === teacherId && 
      s.className === className && 
      s.subject === subject
    );
    return teacherSubmission?.status || 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Exam Submission Tracking</h2>
        <p className="text-gray-600 mb-6">
          Track exam score submissions from teachers
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teachers.map(teacher => {
                const teacherClasses = teacher.assignedClasses || [];
                const teacherSubjects = teacher.assignedSubjects || [];
                
                return teacherClasses.flatMap(className => 
                  teacherSubjects.map(subject => {
                    const status = getSubmissionStatus(teacher.id, className, subject);
                    
                    return (
                      <tr key={`${teacher.id}-${className}-${subject}`}>
                        <td className="px-4 py-3">
                          <div className="font-medium">{teacher.name}</div>
                          <div className="text-sm text-gray-500">{teacher.role}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">{className}</td>
                        <td className="px-4 py-3 text-sm">{subject}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                            {status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => markSubmission(teacher.id, className, subject, 'submitted')}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Mark Submitted
                            </button>
                            <button
                              onClick={() => markSubmission(teacher.id, className, subject, 'partial')}
                              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                            >
                              Partial
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {submissions.filter(s => s.status === 'submitted').length}
          </div>
          <div className="text-sm text-gray-600">Fully Submitted</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {submissions.filter(s => s.status === 'partial').length}
          </div>
          <div className="text-sm text-gray-600">Partial Submissions</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-red-600">
            {teachers.length - submissions.length}
          </div>
          <div className="text-sm text-gray-600">Pending Submissions</div>
        </div>
      </div>
    </div>
  );
}
