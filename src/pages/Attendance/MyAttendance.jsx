import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStaffAttendance, authenticateStaff, getCurrentUserStaff } from '../../utils/attendanceStorage.jsx';
import { getAttendanceStats } from '../../utils/attendanceCalculations';
import PasswordGate from './components/PasswordGate';
import AttendanceStats from './components/AttendanceStats';

const MyAttendance = () => {
  const { user } = useAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [staffRecords, setStaffRecords] = useState({});

  useEffect(() => {
    if (user) {
      const staffData = getCurrentUserStaff(user);
      setCurrentStaff(staffData);
      
      // Auto-authenticate if user is logged in (optional - for convenience)
      // Or require password every time for security
      if (staffData) {
        // For security, we'll require password each time
        // setAuthenticated(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (authenticated && currentStaff) {
      const records = getStaffAttendance(currentStaff.id);
      setStaffRecords(records);
    }
  }, [authenticated, currentStaff]);

  const handleStaffAuth = (password) => {
    if (currentStaff && authenticateStaff(currentStaff.id, password)) {
      setAuthenticated(true);
      return true;
    }
    return false;
  };

  // If no user is logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mobile-padding">
        <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Required</h2>
          <p className="text-gray-600">Please log in to view your attendance records.</p>
          <a href="/login" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // If user is logged in but not found in staff records
  if (!currentStaff) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mobile-padding">
        <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900">Staff Access Only</h2>
          <p className="text-gray-600">Your account is not registered as staff member.</p>
          <p className="text-sm text-gray-500">Contact administrator for staff role assignment.</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <PasswordGate 
        onAuthenticate={handleStaffAuth}
        title="Staff Attendance Access"
        buttonText="View My Attendance"
        placeholder="Enter your password..."
      />
    );
  }

  const weeklyStats = getAttendanceStats(staffRecords, 'week');
  const monthlyStats = getAttendanceStats(staffRecords, 'month');
  const termStats = getAttendanceStats(staffRecords, 'term');

  return (
    <div className="min-h-screen bg-gray-50 mobile-padding">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Attendance Record
          </h1>
          <p className="text-gray-600">
            Welcome, {currentStaff?.name} - {currentStaff?.role}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Staff ID: {currentStaff?.id}
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AttendanceStats stats={weeklyStats} period="This Week" />
          <AttendanceStats stats={monthlyStats} period="This Month" />
          <AttendanceStats stats={termStats} period="This Term" />
        </div>

        {/* Detailed Records */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Attendance History
          </h3>
          
          {Object.keys(staffRecords).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No attendance records found for you yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arrival Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(staffRecords)
                    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                    .map(([date, record]) => (
                      <tr key={date}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(date).toLocaleDateString('en-NG', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {record.arrivalTime || 'Not recorded'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.status === 'present' 
                              ? 'bg-green-100 text-green-800'
                              : record.status === 'late'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status?.toUpperCase() || 'ABSENT'}
                          </span>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Legend */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Status Legend:</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Present - Arrived on time</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Late - Arrived after threshold</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Absent - No record for the day</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Security Notice</h4>
          <p className="text-sm text-yellow-700">
            For security, you must enter your password each time to view attendance records. 
            Contact administrator if you need to reset your password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;
