// src/pages/Dashboard/roles/QuestionCreator.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function QuestionCreator() {
  const { user } = useAuth();
  const [question, setQuestion] = useState({
    subject: user.assignedSubjects?.[0] || '',
    classLevel: user.assignedClasses?.[0] || '',
    term: '1', // 1st, 2nd, 3rd term
    questionType: 'exam', // exam, test, assignment
    file: null,
    description: '', // Optional text description
    title: '' // Optional title for the question set
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation - File is primary, required
    if (!question.file) {
      alert('Please upload a question file');
      setIsSubmitting(false);
      return;
    }

    const questionData = {
      id: `questions-${Date.now()}`,
      ...question,
      fileName: question.file.name,
      fileType: question.file.type,
      fileSize: question.file.size,
      createdBy: user.id,
      createdByName: user.name,
      createdAt: new Date().toISOString(),
      status: 'pending_review'
    };

    try {
      // Save to school question bank (not exam bank)
      const schoolQuestions = JSON.parse(localStorage.getItem('schoolQuestions')) || [];
      schoolQuestions.push(questionData);
      localStorage.setItem('schoolQuestions', JSON.stringify(schoolQuestions));

      // Reset form
      setQuestion({
        subject: user.assignedSubjects?.[0] || '',
        classLevel: user.assignedClasses?.[0] || '',
        term: '1',
        questionType: 'exam',
        file: null,
        description: '',
        title: ''
      });

      // Clear file input
      document.getElementById('questionFile').value = '';

      alert('✅ Questions uploaded! Sent to Exam Officer for review.');
    } catch (error) {
      alert('Error uploading questions. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-700">Upload Questions</h2>
      <p className="text-gray-600 mb-6">Upload exam/test questions for school question bank</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject *</label>
            <select
              value={question.subject}
              onChange={(e) => setQuestion({...question, subject: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Subject</option>
              {user.assignedSubjects?.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Class *</label>
            <select
              value={question.classLevel}
              onChange={(e) => setQuestion({...question, classLevel: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Class</option>
              {user.assignedClasses?.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Term and Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Term *</label>
            <select
              value={question.term}
              onChange={(e) => setQuestion({...question, term: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="1">1st Term</option>
              <option value="2">2nd Term</option>
              <option value="3">3rd Term</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Question Type *</label>
            <select
              value={question.questionType}
              onChange={(e) => setQuestion({...question, questionType: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="exam">Exam Questions</option>
              <option value="test">Test Questions</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>
        </div>

        {/* PRIMARY: File Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Question File *
            <span className="text-gray-500 text-xs ml-2">(PDF, Word, Text files)</span>
          </label>
          <input
            id="questionFile"
            type="file"
            onChange={(e) => setQuestion({...question, file: e.target.files[0]})}
            className="w-full p-2 border rounded"
            accept=".pdf,.doc,.docx,.txt,.jpg,.png"
            required
          />
          {question.file && (
            <p className="text-sm text-green-600 mt-1">
              ✅ Selected: {question.file.name} ({(question.file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* SECONDARY: Optional Text Fields */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Optional Information</h3>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Title (Optional)</label>
            <input
              type="text"
              value={question.title}
              onChange={(e) => setQuestion({...question, title: e.target.value})}
              placeholder="e.g., Mid-term Physics Exam, Chapter 5 Test"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea
              value={question.description}
              onChange={(e) => setQuestion({...question, description: e.target.value})}
              placeholder="Any additional notes about these questions..."
              className="w-full p-2 border rounded h-20"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !question.file}
          className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '📤 Uploading...' : '📤 Send to Exam Officer'}
        </button>
      </form>

      {/* Upload Guidelines */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Upload Guidelines</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Primary Method:</strong> Upload question files (PDF, Word, etc.)</li>
          <li>• <strong>Optional:</strong> Add title and description for context</li>
          <li>• <strong>Destination:</strong> School Question Bank (not Exam Bank)</li>
          <li>• <strong>Review:</strong> Exam Officer will review before publishing</li>
          <li>• <strong>Usage:</strong> For exams, tests, and assignments</li>
        </ul>
      </div>
    </div>
  );
}
