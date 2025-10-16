import React from 'react';

const RecentActivity = ({ 
  teacherSubjects = [],
  examData = {} 
}) => {
  // This would show recently edited scores - simplified for now
  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Scoring Activity</h2>
      <div className="text-center py-8 text-gray-500">
        <p>Recent score entries will appear here.</p>
        <p className="text-sm">Start entering scores to see your activity.</p>
      </div>
    </div>
  );
};

export default RecentActivity;