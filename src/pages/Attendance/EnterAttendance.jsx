import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllStaff, getTodaysAttendance, saveAttendanceRecord } from '../../utils/attendanceStorage.jsx';
import universalTime from '../../utils/universalTime.js';
import autoAttendance from '../../utils/autoAttendance.js';
import PasswordGate from './components/PasswordGate';

const EnterAttendance = () => {
  const { user } = useAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [saveStatus, setSaveStatus] = useState('');
  const [autoSummary, setAutoSummary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [showReasonPopup, setShowReasonPopup] = useState(false);

  const allStaff = getAllStaff();
  const today = universalTime.getTodayDate();
  const currentTime = universalTime.getCurrentTime();

  useEffect(() => {
    if (authenticated) {
      loadAttendanceData();
      startAutoUpdates();
    }
    
    return () => {
      autoAttendance.stop();
    };
  }, [authenticated]);

  const loadAttendanceData = () => {
    const existingData = getTodaysAttendance();
    setAttendanceData(existingData);
    updateAutoSummary();
  };

  const startAutoUpdates = () => {
    autoAttendance.init();
    const updateInterval = setInterval(() => {
      loadAttendanceData();
    }, 30000);
    
    return () => clearInterval(updateInterval);
  };

  const updateAutoSummary = () => {
    setAutoSummary(autoAttendance.getAutoStatusSummary());
  };

  // Filter staff based on search
  const filteredStaff = allStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStaffClick = (staff) => {
    setSelectedStaff(staff);
    setShowActionPopup(true);
  };

  const calculateStatus = () => {
    return universalTime.isBefore('08:00') ? 'present' : 'late';
  };

  const handleMarkPresent = () => {
    if (!selectedStaff) return;

    const status = calculateStatus();
    
    const updatedData = {
      ...attendanceData,
      [selectedStaff.id]: {
        arrivalTime: currentTime,
        status: status,
        manualEntry: true,
        entryTime: currentTime,
        timestamp: universalTime.generateTimestampHash(),
        entryBy: 'vp_admin'
      }
    };

    saveAttendanceRecord(today, updatedData);
    setAttendanceData(updatedData);
    setShowActionPopup(false);
    setSelectedStaff(null);
    setSaveStatus(`${selectedStaff.name} marked ${status} at ${currentTime}`);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleAbsentWithPermission = () => {
    setShowActionPopup(false);
    setShowReasonPopup(true);
  };

  const handleAbsentWithoutPermission = () => {
    if (!selectedStaff) return;

    const updatedData = {
      ...attendanceData,
      [selectedStaff.id]: {
        arrivalTime: null,
        status: 'absent',
        absentType: 'unauthorized',
        manualEntry: true,
        entryTime: currentTime,
        timestamp: universalTime.generateTimestampHash(),
        entryBy: 'vp_admin',
        notes: 'Absent without permission'
      }
    };

    saveAttendanceRecord(today, updatedData);
    setAttendanceData(updatedData);
    setShowActionPopup(false);
    setSelectedStaff(null);
    setSaveStatus(`${selectedStaff.name} marked absent (unauthorized)`);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleSubmitReason = (reasonType, customReason = '') => {
    if (!selectedStaff) return;

    const reasonText = customReason || reasonType;
    
    const updatedData = {
      ...attendanceData,
      [selectedStaff.id]: {
        arrivalTime: null,
        status: 'absent',
        absentType: reasonType,
        manualEntry: true,
        entryTime: currentTime,
        timestamp: universalTime.generateTimestampHash(),
        entryBy: 'vp_admin',
        notes: `Absent with permission: ${reasonText}`
      }
    };

    saveAttendanceRecord(today, updatedData);
    setAttendanceData(updatedData);
    setShowReasonPopup(false);
    setSelectedStaff(null);
    setSaveStatus(`${selectedStaff.name} marked absent (${reasonType})`);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAbsentTypeText = (absentType) => {
    const types = {
      'sick_leave': '🏥 Sick Leave',
      'official_duty': '📋 Official Duty',
      'emergency': '🚨 Emergency',
      'unauthorized': '❌ Unauthorized',
      'family_emergency': '👨‍👩‍👧‍👦 Family Emergency',
      'other': '📝 Other Reason'
    };
    return types[absentType] || absentType;
  };

  const handleVPAuth = (password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentVP = users.find(u => u.id === user.id && u.role?.toLowerCase() === 'vp admin');
    
    if (currentVP && currentVP.password === password) {
      setAuthenticated(true);
      return true;
    }
    return false;
  };

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

  return (
    <div className="min-h-screen bg-gray-50 mobile-padding">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Staff Attendance Console
          </h1>
          <p className="text-gray-600">
            VP Admin - Real-time Attendance Management
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Today: {today} | Current Time: {currentTime} | Nigerian Time (WAT)
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <input
            type="text"
            placeholder="Search staff names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            autoFocus
          />
        </div>

        {/* Auto-System Status */}
        {autoSummary && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Auto-System Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-blue-700">Total Staff</div>
                <div className="font-bold">{autoSummary.totalStaff}</div>
              </div>
              <div>
                <div className="text-green-700">Auto-Marked</div>
                <div className="font-bold">{autoSummary.autoMarked}</div>
              </div>
              <div>
                <div className="text-purple-700">Manual Entries</div>
                <div className="font-bold">{autoSummary.manuallyMarked}</div>
              </div>
              <div>
                <div className="text-orange-700">Pending</div>
                <div className="font-bold">{autoSummary.pending}</div>
              </div>
            </div>
          </div>
        )}

        {/* Save Status */}
        {saveStatus && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {saveStatus}
          </div>
        )}

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
                    Current Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrival Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quick Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(searchTerm ? filteredStaff : allStaff).map((staff) => {
                  const record = attendanceData[staff.id] || {};
                  
                  return (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div 
                          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => handleStaffClick(staff)}
                        >
                          {staff.name}
                        </div>
                        <div className="text-xs text-gray-500">{staff.role}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status ? record.status.toUpperCase() : 'NOT MARKED'}
                          {record.absentType && ` (${getAbsentTypeText(record.absentType)})`}
                        </span>
                        {record.autoStatus && (
                          <div className="text-xs text-gray-500 mt-1">Auto-system</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.arrivalTime || 'Not recorded'}
                        {record.entryTime && (
                          <div className="text-xs text-gray-500">Marked at: {record.entryTime}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleStaffClick(staff)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 touch-target"
                          >
                            Mark Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Popup */}
        {showActionPopup && selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {selectedStaff.name}
              </h3>
              <p className="text-gray-600 mb-1">{selectedStaff.role}</p>
              <p className="text-sm text-gray-500 mb-4">Current Time: {currentTime}</p>
              
              <div className="space-y-3">
                <button
                  onClick={handleMarkPresent}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 touch-target"
                >
                  PRESENT
                </button>
                
                <button
                  onClick={handleAbsentWithPermission}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-target"
                >
                  ABSENT WITH PERMISSION
                </button>
                
                <button
                  onClick={handleAbsentWithoutPermission}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 touch-target"
                >
                  ABSENT WITHOUT PERMISSION
                </button>
                
                <button
                  onClick={() => setShowActionPopup(false)}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 touch-target"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reason Popup */}
        {showReasonPopup && selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Reason for Absence
              </h3>
              
              <div className="space-y-3 mb-4">
                {[
                  { type: 'sick_leave', label: '🏥 Sick Leave' },
                  { type: 'official_duty', label: '📋 Official Duty' },
                  { type: 'family_emergency', label: '👨‍👩‍👧‍👦 Family Emergency' },
                  { type: 'other', label: '📝 Other Reason' }
                ].map((reason) => (
                  <button
                    key={reason.type}
                    onClick={() => {
                      if (reason.type === 'other') {
                        const customReason = prompt('Please specify reason:');
                        if (customReason) {
                          handleSubmitReason('other', customReason);
                        }
                      } else {
                        handleSubmitReason(reason.type);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-target text-left"
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => {
                  setShowReasonPopup(false);
                  setShowActionPopup(true);
                }}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 touch-target"
              >
                BACK
              </button>
            </div>
          </div>
        )}

        {/* System Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">System Information</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Click staff name</strong> to mark attendance with popup</li>
            <li>• <strong>Search</strong> staff by typing names</li>
            <li>• <strong>Auto-system:</strong> Automatically marks absent at 10:00 AM</li>
            <li>• <strong>Time:</strong> Uses Nigerian time (WAT) - cannot be manipulated</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnterAttendance;
