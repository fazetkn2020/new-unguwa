// src/pages/Dashboard/roles/AttendanceViewer.jsx
import React, { useState, useEffect } from 'react';

export default function AttendanceViewer({ class: className }) {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadAttendanceData();
  }, [className, selectedDate]);

  const loadAttendanceData = () => {
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    setAttendanceData(attendanceRecords[className] || {});
  };

  const getAttendanceForDate = (date) => {
    return attendanceData[date] || {};
  };

  const getMonthlySummary = () => {
    const currentMonth = selectedDate.substring(0, 7); // YYYY-MM
    const monthlyData = Object.entries(attendanceData)
      .filter(([date]) => date.startsWith(currentMonth))
      .map(([date, data]) => ({
        date,
        present: Object.values(data).filter(a => a.status === 'present').length,
        total: Object.values(data).length
      }));
    
    return monthlyData;
  };

  const currentAttendance = getAttendanceForDate(selectedDate);
  const monthlySummary = getMonthlySummary();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Attendance View - {className}</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-semibold text-green-800">Present</h3>
          <p className="text-2xl font-bold text-green-600">
            {Object.values(currentAttendance).filter(a => a.status === 'present').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded">
          <h3 className="font-semibold text-red-800">Absent</h3>
          <p className="text-2xl font-bold text-red-600">
            {Object.values(currentAttendance).filter(a => a.status === 'absent').length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold text-blue-800">Total Marked</h3>
          <p className="text-2xl font-bold text-blue-600">
            {Object.values(currentAttendance).length}
          </p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <h3 className="bg-gray-50 px-4 py-3 font-semibold">Attendance for {selectedDate}</h3>
        <div className="divide-y">
          {Object.entries(currentAttendance).map(([studentId, record]) => (
            <div key={studentId} className="flex justify-between items-center px-4 py-3">
              <span>{record.studentName || studentId}</span>
              <span className={`px-2 py-1 rounded text-sm ${
                record.status === 'present' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {record.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
