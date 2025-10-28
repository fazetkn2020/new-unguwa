import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function VPAdminAttendance() {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const today = new Date().toISOString().split('T')[0];
    
    const allStaff = users.filter(u => 
      u.role !== 'Student' && u.role !== 'Admin'
    );
    setStaff(allStaff);
    
    const todayAttendance = JSON.parse(localStorage.getItem(`attendance_${today}`)) || {};
    setAttendance(todayAttendance);
  }, []);

  const markPresent = (staffId) => {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    // Determine if late (after 8:00 AM)
    const isLate = hours > 8 || (hours === 8 && minutes > 0);
    const status = isLate ? 'late' : 'present';

    const updatedAttendance = {
      ...attendance,
      [staffId]: {
        status,
        arrivalTime: timeString,
        markedBy: user.name,
        date: today,
        timestamp: currentTime.toISOString()
      }
    };
    
    setAttendance(updatedAttendance);
    localStorage.setItem(`attendance_${today}`, JSON.stringify(updatedAttendance));
  };

  const markAbsent = (staffId) => {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-NG', { 
      hour: '2-digit', minute: '2-digit' 
    });

    const updatedAttendance = {
      ...attendance,
      [staffId]: {
        status: 'absent',
        arrivalTime: null,
        markedBy: user.name,
        date: today,
        timestamp: new Date().toISOString(),
        markedAt: currentTime
      }
    };
    
    setAttendance(updatedAttendance);
    localStorage.setItem(`attendance_${today}`, JSON.stringify(updatedAttendance));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-NG', { 
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Staff Attendance</h2>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('en-NG', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Time</div>
            <div className="text-lg font-semibold">{getCurrentTime()}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arrival Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staff.map(staffMember => {
                const record = attendance[staffMember.id];
                const isMarked = record && record.status;
                
                return (
                  <tr key={staffMember.id} className={isMarked ? 'bg-gray-50' : ''}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{staffMember.name}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{staffMember.role}</td>
                    <td className="px-4 py-3">
                      {isMarked ? (
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status.toUpperCase()}
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          AWAITING
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {record?.arrivalTime || '--:--'}
                    </td>
                    <td className="px-4 py-3">
                      {!isMarked ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => markPresent(staffMember.id)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Mark Present
                          </button>
                          <button
                            onClick={() => markAbsent(staffMember.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Mark Absent
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Marked by {record.markedBy}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Mark Present</strong> - Records current time automatically</li>
            <li>• <strong>Before 8:00 AM</strong> - Shows as "PRESENT"</li>
            <li>• <strong>After 8:00 AM</strong> - Shows as "LATE"</li>
            <li>• <strong>Mark Absent</strong> - Records absence with timestamp</li>
            <li>• <strong>Real-time</strong> - Uses current Nigerian time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
