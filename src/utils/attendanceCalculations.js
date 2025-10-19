// Utility functions for attendance calculations and statistics
import { getAttendanceSettings } from './attendanceStorage';

export const calculateStatus = (arrivalTime, threshold = null) => {
  if (!arrivalTime) return 'absent';
  
  const settings = threshold || getAttendanceSettings()?.lateThreshold || "08:00";
  const lateThreshold = threshold || settings;
  
  const [arrivalHours, arrivalMinutes] = arrivalTime.split(':').map(Number);
  const [thresholdHours, thresholdMinutes] = lateThreshold.split(':').map(Number);
  
  const arrivalTotal = arrivalHours * 60 + arrivalMinutes;
  const thresholdTotal = thresholdHours * 60 + thresholdMinutes;
  
  return arrivalTotal <= thresholdTotal ? 'present' : 'late';
};

export const getAttendanceStats = (staffRecords, period = 'all') => {
  const records = Object.values(staffRecords);
  if (records.length === 0) {
    return { present: 0, late: 0, absent: 0, total: 0, percentage: 0 };
  }
  
  let filteredRecords = records;
  
  if (period !== 'all') {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (period) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'term':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      default:
        break;
    }
    
    filteredRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= cutoffDate;
    });
  }
  
  const present = filteredRecords.filter(r => r.status === 'present').length;
  const late = filteredRecords.filter(r => r.status === 'late').length;
  const absent = filteredRecords.filter(r => r.status === 'absent').length;
  const total = filteredRecords.length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  
  return { present, late, absent, total, percentage };
};

export const getGeneralStats = (attendanceRecords) => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceRecords[today] || {};
  
  const allStaff = Object.values(todayRecords);
  const present = allStaff.filter(staff => staff.status === 'present').length;
  const late = allStaff.filter(staff => staff.status === 'late').length;
  const absent = allStaff.filter(staff => staff.status === 'absent').length;
  const total = allStaff.length;
  
  return { present, late, absent, total };
};

export const getDateRangeStats = (attendanceRecords, days = 7) => {
  const dates = Object.keys(attendanceRecords)
    .sort()
    .slice(-days);
  
  return dates.map(date => {
    const dayRecords = attendanceRecords[date] || {};
    const allStaff = Object.values(dayRecords);
    const present = allStaff.filter(staff => staff.status === 'present').length;
    const late = allStaff.filter(staff => staff.status === 'late').length;
    const absent = allStaff.filter(staff => staff.status === 'absent').length;
    
    return {
      date,
      present,
      late,
      absent,
      total: allStaff.length
    };
  });
};
