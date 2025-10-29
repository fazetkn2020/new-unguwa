// src/pages/Dashboard/roles/QuestionReview.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function QuestionReview() {
  const { user } = useAuth();
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [approvedQuestions, setApprovedQuestions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    const questions = JSON.parse(localStorage.getItem('schoolQuestions')) || [];
    
    const pending = questions.filter(q => q.status === 'pending_review');
    const approved = questions.filter(q => q.status === 'approved');
    
    setPendingQuestions(pending);
    setApprovedQuestions(approved);
  };

  const approveQuestion = (questionId) => {
    const questions = JSON.parse(localStorage.getItem('schoolQuestions')) || [];
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, status: 'approved', reviewedBy: user.name, reviewedAt: new Date().toISOString() } : q
    );
    
    localStorage.setItem('schoolQuestions', JSON.stringify(updatedQuestions));
    loadQuestions();
    alert('✅ Question approved and added to school question bank!');
  };

  const rejectQuestion = (questionId, reason) => {
    const questions = JSON.parse(localStorage.getItem('schoolQuestions')) || [];
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, status: 'rejected', reviewNotes: reason, reviewedBy: user.name, reviewedAt: new Date().toISOString() } : q
    );
    
    localStorage.setItem('schoolQuestions', JSON.stringify(updatedQuestions));
    loadQuestions();
    alert('❌ Question rejected.');
  };

  const downloadFile = (question) => {
    if (question.file) {
      // Create a download link for the file
      const url = URL.createObjectURL(question.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = question.fileName || 'question_file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getFilteredQuestions = () => {
    const allQuestions = [...pendingQuestions, ...approvedQuestions];
    let filtered = allQuestions;

    if (filter === 'pending') filtered = pendingQuestions;
    if (filter === 'approved') filtered = approvedQuestions;
    
    if (selectedSubject) {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }

    return filtered;
  };

  const getSubjects = () => {
    const allQuestions = [...pendingQuestions, ...approvedQuestions];
    return [...new Set(allQuestions.map(q => q.subject))].filter(Boolean);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Question Review Center</h2>
        <p className="text-gray-600">
          Review and approve questions submitted by teachers for school question bank
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{pendingQuestions.length + approvedQuestions.length}</div>
          <div className="text-sm text-gray-600">Total Submissions</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{pendingQuestions.length}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{approvedQuestions.length}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{getSubjects().length}</div>
          <div className="text-sm text-gray-600">Subjects</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Filter by Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Questions</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Filter by Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Subjects</option>
              {getSubjects().map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {filter === 'pending' ? 'Pending Review' : 
             filter === 'approved' ? 'Approved Questions' : 'All Questions'} 
            ({getFilteredQuestions().length})
          </h3>
        </div>

        <div className="divide-y">
          {getFilteredQuestions().length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No questions found matching your filters.
            </div>
          ) : (
            getFilteredQuestions().map(question => (
              <div key={question.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {question.title || `Questions for ${question.subject}`}
                    </h4>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{question.subject}</span> • 
                      <span className="ml-2">{question.classLevel}</span> • 
                      <span className="ml-2">{question.questionType}</span> • 
                      <span className="ml-2">Term {question.term}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Submitted by {question.createdByName} on {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    question.status === 'pending_review' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {question.status === 'pending_review' ? 'Pending Review' : 'Approved'}
                  </span>
                </div>

                {question.description && (
                  <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded">
                    {question.description}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <div>
                    {question.file && (
                      <button
                        onClick={() => downloadFile(question)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                      >
                        <span>📎</span>
                        <span>Download {question.fileName || 'File'}</span>
                      </button>
                    )}
                  </div>

                  {question.status === 'pending_review' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const reason = prompt('Enter rejection reason (optional):');
                          if (reason !== null) {
                            rejectQuestion(question.id, reason);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveQuestion(question.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Approve
                      </button>
                    </div>
                  )}

                  {question.status === 'approved' && (
                    <div className="text-sm text-green-600">
                      Approved by {question.reviewedBy} on {new Date(question.reviewedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
