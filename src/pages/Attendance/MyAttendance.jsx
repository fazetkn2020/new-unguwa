import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStaffAttendance, getCurrentUserStaff } from '../../utils/attendanceStorage.jsx';
import { getAttendanceStats } from '../../utils/attendanceCalculations.js';
import universalTime from '../../utils/universalTime.js';
import PasswordGate from './components/PasswordGate';
import AttendanceStats from './components/AttendanceStats';
import AppealForm from './components/AppealForm';

const MyAttendance = () => {
  const { user } = useAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [staffRecords, setStaffRecords] = useState({});

  useEffect(() => {
    if (user) {
      const staffData = getCurrentUserStaff(user);
      setCurrentStaff(staffData);
    }
  }, [user]);

  useEffect(() => {
    if (authenticated && currentStaff) {
      const records = getStaffAttendance(currentStaff.id);
      setStaffRecords(records);
    }
  }, [authenticated, currentStaff]);

  const handleStaffAuth = (password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentStaffUser = users.find(u => u.id === user.id);
    
    if (currentStaffUser && currentStaffUser.password === password) {
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

  // Get today's record
  const today = universalTime.getTodayDate();
  const todayRecord = staffRecords[today];
  const todayStatus = todayRecord?.status || 'Not recorded';
  const todayArrivalTime = todayRecord?.arrivalTime || 'Not recorded';

  const statusColors = {
    'present': 'bg-green-100 text-green-800',
    'late': 'bg-yellow-100 text-yellow-800',
    'absent': 'bg-red-100 text-red-800',
    'Not recorded': 'bg-gray-100 text-gray-800'
  };

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
        </div>

        {/* Today's Status - Always Visible */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Status</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Current Status</div>
              <div className="text-2xl font-bold mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[todayStatus]}`}>
                  {todayStatus.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Arrival Time: {todayArrivalTime}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Date</div>
              <div className="text-lg font-semibold">
                {new Date().toLocaleDateString('en-NG', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-sm text-gray-500">
                {universalTime.getCurrentTime()}
              </div>
            </div>
          </div>

          {/* Appeal Section */}
          {(todayStatus === 'late' || todayStatus === 'absent') && (
            <div className="border-t pt-4 mt-4">
              <div className="text-sm text-gray-600 mb-3">
                Disagree with today's status? Submit an appeal with your reason:
              </div>
              <AppealForm 
                staffId={currentStaff.id}
                staffName={currentStaff.name}
                onAppealSubmit={() => {
                  // Refresh data after appeal
                  const records = getStaffAttendance(currentStaff.id);
                  setStaffRecords(records);
                }}
              />
            </div>
          )}
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
      </div>
    </div>
  );
};

export default MyAttendance;
