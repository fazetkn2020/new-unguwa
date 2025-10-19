import React from 'react';

const AttendanceStats = ({ stats, period = "Period" }) => {
  const { present, late, absent, total, percentage } = stats;

  const getProgressColor = (percent) => {
    if (percent >= 90) return 'bg-green-500';
    if (percent >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mobile-padding">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {period} Attendance Summary
      </h3>
      
      {/* Overall Progress */}
      {percentage !== undefined && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Attendance Rate</span>
            <span className="text-sm font-bold text-gray-900">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${getProgressColor(percentage)} transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`rounded-lg p-4 text-center ${getStatusColor('present')}`}>
          <div className="text-2xl font-bold">{present}</div>
          <div className="text-sm">Present</div>
        </div>
        
        <div className={`rounded-lg p-4 text-center ${getStatusColor('late')}`}>
          <div className="text-2xl font-bold">{late}</div>
          <div className="text-sm">Late</div>
        </div>
        
        <div className={`rounded-lg p-4 text-center ${getStatusColor('absent')}`}>
          <div className="text-2xl font-bold">{absent}</div>
          <div className="text-sm">Absent</div>
        </div>
      </div>

      {/* Total Days */}
      {total > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Total: {total} days recorded
        </div>
      )}
    </div>
  );
};

export default AttendanceStats;
