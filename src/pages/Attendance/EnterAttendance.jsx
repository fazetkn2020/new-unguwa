import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getAllStaff, 
  getTodaysAttendance, 
  saveAttendanceRecord, 
  getAttendanceSettings,
  updateAttendanceSettings,
  authenticateVP 
} from '../../utils/attendanceStorage.jsx';
import { calculateStatus } from '../../utils/attendanceCalculations';
import PasswordGate from './components/PasswordGate';

const EnterAttendance = () => {
  const { user } = useAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [lateThreshold, setLateThreshold] = useState('08:00');
  const [saveStatus, setSaveStatus] = useState('');
  const [isToday, setIsToday] = useState(true);

  const allStaff = getAllStaff();

  useEffect(() => {
    const settings = getAttendanceSettings();
    if (settings?.lateThreshold) {
      setLateThreshold(settings.lateThreshold);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadAttendanceData();
      checkIfToday();
    }
  }, [selectedDate, authenticated]);

  const loadAttendanceData = () => {
    const existingData = getTodaysAttendance();
    const initialData = {};
    
    allStaff.forEach(staff => {
      if (existingData[staff.id]) {
        initialData[staff.id] = existingData[staff.id];
      } else {
        initialData[staff.id] = { arrivalTime: '', status: 'absent' };
      }
    });
    
    setAttendanceData(initialData);
  };

  const checkIfToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setIsToday(selectedDate === today);
  };

  const handleTimeChange = (staffId, time) => {
    setAttendanceData(prev => ({
      ...prev,
      [staffId]: {
        arrivalTime: time,
        status: time ? calculateStatus(time, lateThreshold) : 'absent'
      }
    }));
  };

  const handleSaveSettings = () => {
    const settings = getAttendanceSettings();
    updateAttendanceSettings({
      ...settings,
      lateThreshold
    });
    setSaveStatus('Settings updated successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleSaveAttendance = () => {
    saveAttendanceRecord(selectedDate, attendanceData);
    setSaveStatus('Attendance saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleVPAuth = (password) => {
    if (user && authenticateVP(password, user)) {
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
          <p className="text-gray-600">Please log in to access attendance management.</p>
          <a href="/login" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <PasswordGate 
        onAuthenticate={handleVPAuth}
        title="VP Admin Access Required"
        buttonText="Enter Attendance System"
        placeholder="Enter your password..."
      />
    );
  }

  const presentCount = Object.values(attendanceData).filter(item => item.status === 'present').length;
  const lateCount = Object.values(attendanceData).filter(item => item.status === 'late').length;
  const absentCount = Object.values(attendanceData).filter(item => item.status === 'absent').length;

  return (
    <div className="min-h-screen bg-gray-50 mobile-padding">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Staff Attendance Entry
          </h1>
          <p className="text-gray-600">
            VP Admin - Enter and manage staff attendance records
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Logged in as: {user.name} ({user.role})
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendance Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 touch-target"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Late Threshold Time
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={lateThreshold}
                  onChange={(e) => setLateThreshold(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 touch-target"
                />
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-target"
                >
                  Update
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSaveAttendance}
                className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 touch-target"
              >
                Save Attendance Records
              </button>
            </div>
          </div>

          {saveStatus && (
            <div className="text-green-600 text-center font-medium">
              {saveStatus}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{presentCount}</div>
              <div className="text-sm text-green-600">Present</div>
            </div>
            <div className="text-center p-3 bg-yellow-100 rounded-lg">
              <div className="text-2xl font-bold text-yellow-800">{lateCount}</div>
              <div className="text-sm text-yellow-600">Late</div>
            </div>
            <div className="text-center p-3 bg-red-100 rounded-lg">
              <div className="text-2xl font-bold text-red-800">{absentCount}</div>
              <div className="text-sm text-red-600">Absent</div>
            </div>
          </div>
        </div>

        {/* Staff Attendance Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrival Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allStaff.map((staff) => {
                  const record = attendanceData[staff.id] || { arrivalTime: '', status: 'absent' };
                  
                  return (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                        <div className="text-xs text-gray-500">ID: {staff.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{staff.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="time"
                          value={record.arrivalTime}
                          onChange={(e) => handleTimeChange(staff.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive touch-target"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'present' 
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'late'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Select the date for attendance entry</li>
            <li>• Set the late threshold time (default: 8:00 AM)</li>
            <li>• Enter arrival time for each staff member</li>
            <li>• Status updates automatically based on threshold</li>
            <li>• Leave time empty to mark as absent</li>
            <li>• Click "Save Attendance Records" to save</li>
          </ul>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Access Information</h4>
          <p className="text-sm text-yellow-700">
            Only users with "VP Admin" role can access this page. 
            Using your login password for authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnterAttendance;
