import React, { useState } from 'react';
import universalTime from '../../../utils/universalTime.js';

const AppealForm = ({ staffId, staffName, onAppealSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [appealType, setAppealType] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const appealTypes = [
    { value: 'late_traffic', label: '🚗 Late - Traffic', description: 'Stuck in traffic' },
    { value: 'late_emergency', label: '🆘 Late - Emergency', description: 'Family/medical emergency' },
    { value: 'late_other', label: '⏰ Late - Other Reason', description: 'Other valid reason' },
    { value: 'sick_leave', label: '🏥 Sick Leave', description: 'Unable to come due to illness' },
    { value: 'official_duty', label: '📋 Official Duty', description: 'School-related official assignment' },
    { value: 'family_emergency', label: '👨‍👩‍👧‍👦 Family Emergency', description: 'Urgent family matter' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appealType || !reason.trim()) return;

    setSubmitting(true);
    
    const appealData = {
      staffId,
      staffName,
      appealType,
      reason,
      date: universalTime.getTodayDate(),
      timestamp: universalTime.getCurrentTime(),
      status: 'pending'
    };

    // Save appeal to localStorage
    const appeals = JSON.parse(localStorage.getItem('attendanceAppeals') || '[]');
    appeals.push(appealData);
    localStorage.setItem('attendanceAppeals', JSON.stringify(appeals));

    setSubmitting(false);
    setIsOpen(false);
    setAppealType('');
    setReason('');
    
    if (onAppealSubmit) {
      onAppealSubmit(appealData);
    }

    alert('Appeal submitted successfully! VP Admin will review it.');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-target"
      >
        📝 Submit Appeal
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submit Attendance Appeal
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appeal Type
                </label>
                <select
                  value={appealType}
                  onChange={(e) => setAppealType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select appeal type</option>
                  {appealTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide detailed explanation for your late arrival or absence..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !appealType || !reason.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Appeal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AppealForm;
