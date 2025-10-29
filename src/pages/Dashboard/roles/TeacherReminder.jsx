// src/pages/Dashboard/roles/TeacherReminder.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function TeacherReminder() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, submitted
  const [reminderMessage, setReminderMessage] = useState('Please submit your exam questions for the current term.');
  const [selectedTerm, setSelectedTerm] = useState('2'); // Current term

  useEffect(() => {
    loadTeachers();
  }, [selectedTerm]);

  const loadTeachers = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const teachingStaff = users.filter(u => 
      ['Subject Teacher', 'Form Master'].includes(u.role) && 
      u.assignedSubjects && u.assignedSubjects.length > 0
    );
    
    // Check question submission status
    const questions = JSON.parse(localStorage.getItem('schoolQuestions')) || [];
    const teachersWithStatus = teachingStaff.map(teacher => {
      const teacherQuestions = questions.filter(q => 
        q.createdBy === teacher.id && 
        q.term === selectedTerm && 
        q.status === 'approved'
      );
      
      const submittedSubjects = teacherQuestions.map(q => q.subject);
      const pendingSubjects = teacher.assignedSubjects?.filter(subject => 
        !submittedSubjects.includes(subject)
      );

      return {
        ...teacher,
        submittedCount: teacherQuestions.length,
        totalSubjects: teacher.assignedSubjects?.length || 0,
        pendingSubjects,
        submittedSubjects,
        lastReminder: null // Would track reminder history
      };
    });

    setTeachers(teachersWithStatus);
  };

  const sendReminder = (teacher, subject = null) => {
    const message = subject 
      ? `Reminder sent to ${teacher.name} for ${subject}`
      : `Reminder sent to ${teacher.name} for all pending subjects`;

    // Save reminder history
    const reminders = JSON.parse(localStorage.getItem('teacherReminders')) || [];
    reminders.push({
      id: `reminder-${Date.now()}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      subject: subject,
      message: reminderMessage,
      sentBy: user.name,
      sentAt: new Date().toISOString(),
      term: selectedTerm
    });
    localStorage.setItem('teacherReminders', JSON.stringify(reminders));

    alert(`📧 ${message}`);
  };

  const sendBulkReminder = () => {
    const pendingTeachers = teachers.filter(t => t.pendingSubjects.length > 0);
    
    if (pendingTeachers.length === 0) {
      alert('✅ All teachers have submitted their questions!');
      return;
    }

    pendingTeachers.forEach(teacher => {
      sendReminder(teacher);
    });

    alert(`📧 Bulk reminders sent to ${pendingTeachers.length} teachers`);
  };

  const getFilteredTeachers = () => {
    switch (filter) {
      case 'pending':
        return teachers.filter(t => t.pendingSubjects.length > 0);
      case 'submitted':
        return teachers.filter(t => t.pendingSubjects.length === 0);
      default:
        return teachers;
    }
  };

  const getStatusColor = (teacher) => {
    if (teacher.pendingSubjects.length === 0) return 'text-green-600';
    if (teacher.submittedCount > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = (teacher) => {
    if (teacher.pendingSubjects.length === 0) return 'All Submitted';
    if (teacher.submittedCount > 0) return 'Partially Submitted';
    return 'Not Submitted';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher Reminder System</h2>
        <p className="text-gray-600">
          Send reminders to teachers for question submissions
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Filter Teachers</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Teachers</option>
              <option value="pending">Pending Submission</option>
              <option value="submitted">All Submitted</option>
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Reminder Message</label>
            <input
              type="text"
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              placeholder="Enter reminder message..."
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Bulk Action */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {getFilteredTeachers().filter(t => t.pendingSubjects.length > 0).length} teachers need reminders
          </div>
          <button
            onClick={sendBulkReminder}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            📧 Send Bulk Reminders
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{teachers.length}</div>
          <div className="text-sm text-gray-600">Total Teachers</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {teachers.filter(t => t.pendingSubjects.length === 0).length}
          </div>
          <div className="text-sm text-gray-600">All Submitted</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {teachers.filter(t => t.submittedCount > 0 && t.pendingSubjects.length > 0).length}
          </div>
          <div className="text-sm text-gray-600">Partial</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {teachers.filter(t => t.submittedCount === 0).length}
          </div>
          <div className="text-sm text-gray-600">Not Submitted</div>
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            Teachers ({getFilteredTeachers().length})
          </h3>
        </div>

        <div className="divide-y">
          {getFilteredTeachers().length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No teachers found matching your filters.
            </div>
          ) : (
            getFilteredTeachers().map(teacher => (
              <div key={teacher.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{teacher.name}</h4>
                    <div className="text-sm text-gray-600">
                      {teacher.role} • {teacher.assignedClasses?.join(', ')}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(teacher)}`}>
                    {getStatusText(teacher)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Submitted Subjects */}
                  <div>
                    <h5 className="font-medium text-green-700 mb-2">✅ Submitted ({teacher.submittedCount})</h5>
                    {teacher.submittedSubjects.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {teacher.submittedSubjects.map(subject => (
                          <span key={subject} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {subject}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No submissions yet</p>
                    )}
                  </div>

                  {/* Pending Subjects */}
                  <div>
                    <h5 className="font-medium text-red-700 mb-2">⏳ Pending ({teacher.pendingSubjects.length})</h5>
                    {teacher.pendingSubjects.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {teacher.pendingSubjects.map(subject => (
                          <span key={subject} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            {subject}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-green-600 text-sm">All subjects submitted</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {teacher.pendingSubjects.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Send reminder for specific subjects:
                    </span>
                    <div className="flex space-x-2">
                      {teacher.pendingSubjects.slice(0, 3).map(subject => (
                        <button
                          key={subject}
                          onClick={() => sendReminder(teacher, subject)}
                          className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                        >
                          Remind for {subject}
                        </button>
                      ))}
                      {teacher.pendingSubjects.length > 3 && (
                        <button
                          onClick={() => sendReminder(teacher)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Remind All
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
