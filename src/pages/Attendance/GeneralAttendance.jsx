import React from 'react';
import { getAttendanceRecords, getTodaysAttendance, getAllStaff } from '../../utils/attendanceStorage.jsx';
import { getGeneralStats, getDateRangeStats } from '../../utils/attendanceCalculations';
import AttendanceStats from './components/AttendanceStats';

const GeneralAttendance = () => {
  const attendanceRecords = getAttendanceRecords();
  const todayStats = getGeneralStats(attendanceRecords);
  const weeklyStats = getDateRangeStats(attendanceRecords, 7);
  const monthlyStats = getDateRangeStats(attendanceRecords, 30);
  
  const allStaff = getAllStaff();
  const todayAttendance = getTodaysAttendance();

  // Calculate term stats (last 90 days)
  const termStatsArray = getDateRangeStats(attendanceRecords, 90);
  const termStats = {
    present: termStatsArray.reduce((sum, day) => sum + day.present, 0),
    late: termStatsArray.reduce((sum, day) => sum + day.late, 0),
    absent: termStatsArray.reduce((sum, day) => sum + day.absent, 0),
    total: termStatsArray.reduce((sum, day) => sum + day.total, 0)
  };
  termStats.percentage = termStats.total > 0 ? Math.round((termStats.present / termStats.total) * 100) : 0;

  // Get today's date for display
  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 mobile-padding">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Staff Attendance Overview
          </h1>
          <p className="text-gray-600">
            Public view of staff attendance statistics
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: {today}
          </p>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AttendanceStats stats={todayStats} period="Today" />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Staff Attendance</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allStaff.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No staff members registered in the system.
                </div>
              ) : (
                allStaff.map(staff => {
                  const todayRecord = todayAttendance[staff.id];
                  const status = todayRecord?.status || 'absent';
                  const time = todayRecord?.arrivalTime || 'Not recorded';
                  
                  const statusColors = {
                    present: 'text-green-600 bg-green-50',
                    late: 'text-yellow-600 bg-yellow-50',
                    absent: 'text-red-600 bg-red-50'
                  };

                  return (
                    <div key={staff.id} className="flex justify-between items-center border-b pb-3 last:border-b-0">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.role}</div>
                      </div>
                      <div className={`text-sm font-medium px-3 py-1 rounded-full ${statusColors[status]}`}>
                        {status.toUpperCase()} {time !== 'Not recorded' && `(${time})`}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Total Staff Members</div>
                <div className="text-2xl font-bold text-gray-900">{allStaff.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Present Today</div>
                <div className="text-2xl font-bold text-green-600">{todayStats.present}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Late Today</div>
                <div className="text-2xl font-bold text-yellow-600">{todayStats.late}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Absent Today</div>
                <div className="text-2xl font-bold text-red-600">{todayStats.absent}</div>
              </div>
              {todayStats.total > 0 && (
                <div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((todayStats.present / todayStats.total) * 100)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Period Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AttendanceStats 
            stats={{
              present: weeklyStats.reduce((sum, day) => sum + day.present, 0),
              late: weeklyStats.reduce((sum, day) => sum + day.late, 0),
              absent: weeklyStats.reduce((sum, day) => sum + day.absent, 0),
              total: weeklyStats.reduce((sum, day) => sum + day.total, 0),
              percentage: weeklyStats.reduce((sum, day) => sum + day.total, 0) > 0 
                ? Math.round((weeklyStats.reduce((sum, day) => sum + day.present, 0) / 
                  weeklyStats.reduce((sum, day) => sum + day.total, 0)) * 100) 
                : 0
            }} 
            period="This Week" 
          />
          
          <AttendanceStats 
            stats={{
              present: monthlyStats.reduce((sum, day) => sum + day.present, 0),
              late: monthlyStats.reduce((sum, day) => sum + day.late, 0),
              absent: monthlyStats.reduce((sum, day) => sum + day.absent, 0),
              total: monthlyStats.reduce((sum, day) => sum + day.total, 0),
              percentage: monthlyStats.reduce((sum, day) => sum + day.total, 0) > 0
                ? Math.round((monthlyStats.reduce((sum, day) => sum + day.present, 0) / 
                  monthlyStats.reduce((sum, day) => sum + day.total, 0)) * 100)
                : 0
            }} 
            period="This Month" 
          />
          
          <AttendanceStats 
            stats={termStats} 
            period="This Term" 
          />
        </div>

        {/* System Information */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">About This System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Staff Attendance Tracking</h4>
              <ul className="space-y-1">
                <li>• Real-time attendance monitoring</li>
                <li>• Automatic status calculation</li>
                <li>• Historical data analysis</li>
                <li>• Mobile-friendly interface</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Access Levels</h4>
              <ul className="space-y-1">
                <li>• <strong>Public:</strong> View general statistics</li>
                <li>• <strong>Staff:</strong> View personal records</li>
                <li>• <strong>VP Admin:</strong> Manage all attendance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Empty State Guidance */}
        {allStaff.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Staff Members Found</h3>
            <p className="text-yellow-700">
              The attendance system is ready, but no staff members are registered yet. 
              Staff users need to be created in the system administration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralAttendance;
