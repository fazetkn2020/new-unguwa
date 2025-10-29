// src/pages/Dashboard/roles/DutyRosterManager.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function DutyRosterManager() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [dutyRoster, setDutyRoster] = useState({});
  const [dutyReports, setDutyReports] = useState({});
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    loadTeachers();
    loadDutyRoster();
    loadDutyReports();
  }, []);

  const loadTeachers = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Exclude Principal, VP Academic, and Admin from duty roster
    const teachingStaff = users.filter(u => 
      !['Principal', 'VP Academic', 'VP Admin', 'Admin'].includes(u.role) &&
      ['Subject Teacher', 'Form Master', 'Senior Master', 'Exam Officer'].includes(u.role)
    );
    setTeachers(teachingStaff);
  };

  const loadDutyRoster = () => {
    const savedRoster = JSON.parse(localStorage.getItem('dutyRoster')) || {};
    setDutyRoster(savedRoster);
  };

  const loadDutyReports = () => {
    const savedReports = JSON.parse(localStorage.getItem('dutyReports')) || {};
    setDutyReports(savedReports);
  };

  const generateDutyRoster = () => {
    if (teachers.length === 0) {
      alert('No teachers available for duty assignment');
      return;
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const newRoster = {};
    
    days.forEach((day, index) => {
      const teacherIndex = (currentWeek - 1 + index) % teachers.length;
      const teacher = teachers[teacherIndex];
      
      if (teacher) {
        newRoster[day] = {
          teacherId: teacher.id,
          teacherName: teacher.name,
          teacherRole: teacher.role,
          week: currentWeek,
          assignedAt: new Date().toISOString()
        };
      }
    });

    setDutyRoster(newRoster);
    localStorage.setItem('dutyRoster', JSON.stringify(newRoster));
    alert('✅ Duty Roster generated for week ' + currentWeek);
  };

  const markReportSubmitted = (day, teacherId) => {
    const today = new Date().toISOString().split('T')[0];
    const reportKey = `${today}_${day}`;
    
    const newReports = {
      ...dutyReports,
      [reportKey]: {
        teacherId,
        teacherName: teachers.find(t => t.id === teacherId)?.name,
        day,
        submitted: true,
        submittedAt: new Date().toISOString(),
        verifiedBy: user.name
      }
    };

    setDutyReports(newReports);
    localStorage.setItem('dutyReports', JSON.stringify(newReports));
  };

  const getTodayDuty = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    const todayName = days[today];
    
    return dutyRoster[todayName];
  };

  const getReportStatus = (day) => {
    const today = new Date().toISOString().split('T')[0];
    const reportKey = `${today}_${day}`;
    return dutyReports[reportKey]?.submitted || false;
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Duty Roster Management</h2>
        <p className="text-gray-600">Assign duty days and track report submissions</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium mb-1">Week Number</label>
              <select
                value={currentWeek}
                onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded"
              >
                {[1, 2, 3, 4].map(week => (
                  <option key={week} value={week}>Week {week}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {teachers.length} teachers available for duty
            </div>
          </div>
          <button
            onClick={generateDutyRoster}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            🔄 Generate Duty Roster
          </button>
        </div>
      </div>

      {/* Today's Duty Display */}
      {getTodayDuty() && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">📢 Today's Duty</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-yellow-700 font-semibold">
                Duty Master: <span className="text-red-600">{getTodayDuty().teacherName}</span>
              </p>
              <p className="text-yellow-600 text-sm">
                Role: {getTodayDuty().teacherRole} • Please write report after duty - IT'S COMPULSORY
              </p>
            </div>
            <div className="text-right">
              <p className="text-yellow-700 text-sm">Duty Prefect: To be assigned</p>
              <p className="text-yellow-600 text-xs">Report submission required</p>
            </div>
          </div>
        </div>
      )}

      {/* Duty Roster Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Weekly Duty Roster - Week {currentWeek}</h3>
        </div>

        <div className="divide-y">
          {days.map(day => {
            const duty = dutyRoster[day];
            const hasReport = getReportStatus(day);
            
            return (
              <div key={day} className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-lg">{day}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    hasReport ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {hasReport ? '✅ Report Submitted' : '⏳ Pending Report'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">Duty Master</p>
                    <p className="text-blue-600">{duty?.teacherName || 'Not Assigned'}</p>
                    <p className="text-blue-500 text-sm">{duty?.teacherRole || ''}</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">Duty Prefect</p>
                    <p className="text-green-600">To be assigned by Duty Master</p>
                    <p className="text-green-500 text-sm">Student leader</p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-purple-800">Actions</p>
                    {duty ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => markReportSubmitted(day, duty.teacherId)}
                          disabled={hasReport}
                          className={`w-full px-3 py-2 text-sm rounded ${
                            hasReport 
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {hasReport ? '✓ Report Marked' : 'Mark Report Submitted'}
                        </button>
                        {hasReport && (
                          <p className="text-xs text-purple-600 text-center">
                            Submitted at {new Date(dutyReports[`${new Date().toISOString().split('T')[0]}_${day}`]?.submittedAt).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-purple-600 text-sm">Assign duty first</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{teachers.length}</div>
          <div className="text-sm text-gray-600">Total Staff</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {Object.values(dutyReports).filter(r => r.submitted).length}
          </div>
          <div className="text-sm text-gray-600">Reports Submitted</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {days.filter(day => dutyRoster[day]).length}
          </div>
          <div className="text-sm text-gray-600">Days Assigned</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {days.filter(day => dutyRoster[day] && !getReportStatus(day)).length}
          </div>
          <div className="text-sm text-gray-600">Pending Reports</div>
        </div>
      </div>
    </div>
  );
}
