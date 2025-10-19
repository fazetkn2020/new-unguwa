// Auto-Attendance Engine
// Automatically calculates status and marks absences
import universalTime from './universalTime.js';
import { getAttendanceRecords, saveAttendanceRecord, getAllStaff } from './attendanceStorage.jsx';

class AutoAttendance {
  constructor() {
    this.checkInterval = null;
    this.lastCheck = null;
  }

  // Initialize auto-attendance system
  init() {
    // Check every minute for auto-actions
    this.checkInterval = setInterval(() => {
      this.performAutoActions();
    }, 60000); // 1 minute
    
    // Perform initial check
    this.performAutoActions();
    
    console.log('Auto-attendance system initialized');
  }

  // Stop auto-attendance system
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Perform all automatic attendance actions
  performAutoActions() {
    const now = universalTime.getNigerianTime();
    const currentTime = universalTime.getCurrentTime();
    
    // Only run on school days during school hours
    if (!universalTime.isSchoolDay() || !universalTime.isSchoolHours()) {
      return;
    }

    // Morning actions (before 10 AM)
    if (currentTime < '10:00') {
      this.autoCalculateMorningStatus();
    }

    // Auto-absent marking (after 10 AM)
    if (currentTime >= '10:00' && currentTime <= '10:05') {
      // Only run once between 10:00-10:05
      if (!this.lastCheck || this.lastCheck < '10:00') {
        this.autoMarkAbsent();
        this.lastCheck = currentTime;
      }
    }
  }

  // Automatically calculate present/late status for morning arrivals
  autoCalculateMorningStatus() {
    const today = universalTime.getTodayDate();
    const currentTime = universalTime.getCurrentTime();
    const records = getAttendanceRecords();
    const todayRecords = records[today] || {};
    
    const allStaff = getAllStaff();
    let updated = false;

    allStaff.forEach(staff => {
      const staffRecord = todayRecords[staff.id];
      
      // Only process if staff has arrival time but no status yet
      if (staffRecord?.arrivalTime && !staffRecord.autoStatus) {
        const status = this.calculateStatus(staffRecord.arrivalTime);
        
        if (status !== staffRecord.status) {
          todayRecords[staff.id] = {
            ...staffRecord,
            status: status,
            autoStatus: true,
            statusTime: currentTime,
            timestamp: universalTime.generateTimestampHash()
          };
          updated = true;
        }
      }
    });

    if (updated) {
      saveAttendanceRecord(today, todayRecords);
      console.log('Auto-calculated morning status for staff');
    }
  }

  // Automatically mark absent staff after 10 AM
  autoMarkAbsent() {
    const today = universalTime.getTodayDate();
    const currentTime = universalTime.getCurrentTime();
    const records = getAttendanceRecords();
    const todayRecords = records[today] || {};
    
    const allStaff = getAllStaff();
    let updated = false;

    allStaff.forEach(staff => {
      // Mark absent if no arrival time recorded
      if (!todayRecords[staff.id] || !todayRecords[staff.id].arrivalTime) {
        todayRecords[staff.id] = {
          arrivalTime: null,
          status: 'absent',
          autoStatus: true,
          statusTime: currentTime,
          absentType: 'unauthorized',
          timestamp: universalTime.generateTimestampHash(),
          notes: 'Automatically marked absent at 10:00 AM'
        };
        updated = true;
      }
    });

    if (updated) {
      saveAttendanceRecord(today, todayRecords);
      console.log('Auto-marked absent staff at 10:00 AM');
    }
  }

  // Calculate status based on arrival time
  calculateStatus(arrivalTime) {
    if (!arrivalTime) return 'absent';
    
    const periods = universalTime.getSchoolPeriods();
    return universalTime.isBefore(periods.morningArrival) ? 'present' : 'late';
  }

  // Manual mark present with current time
  markPresent(staffId) {
    const today = universalTime.getTodayDate();
    const currentTime = universalTime.getCurrentTime();
    const records = getAttendanceRecords();
    const todayRecords = records[today] || {};
    
    const timestamp = universalTime.generateTimestampHash();
    
    todayRecords[staffId] = {
      arrivalTime: currentTime,
      status: this.calculateStatus(currentTime),
      manualEntry: true,
      entryTime: currentTime,
      timestamp: timestamp,
      entryBy: 'vp_admin' // Would be current user in real implementation
    };

    saveAttendanceRecord(today, todayRecords);
    
    return {
      success: true,
      arrivalTime: currentTime,
      status: todayRecords[staffId].status,
      timestamp: timestamp
    };
  }

  // Manual mark absent with type
  markAbsent(staffId, absentType = 'unauthorized', reason = '') {
    const today = universalTime.getTodayDate();
    const currentTime = universalTime.getCurrentTime();
    const records = getAttendanceRecords();
    const todayRecords = records[today] || {};
    
    const timestamp = universalTime.generateTimestampHash();
    
    todayRecords[staffId] = {
      arrivalTime: null,
      status: 'absent',
      absentType: absentType,
      manualEntry: true,
      entryTime: currentTime,
      timestamp: timestamp,
      reason: reason,
      entryBy: 'vp_admin'
    };

    saveAttendanceRecord(today, todayRecords);
    
    return {
      success: true,
      absentType: absentType,
      timestamp: timestamp
    };
  }

  // Get today's auto-status summary
  getAutoStatusSummary() {
    const today = universalTime.getTodayDate();
    const records = getAttendanceRecords();
    const todayRecords = records[today] || {};
    
    const summary = {
      totalStaff: getAllStaff().length,
      autoMarked: 0,
      manuallyMarked: 0,
      pending: 0,
      lastAutoRun: this.lastCheck
    };

    Object.values(todayRecords).forEach(record => {
      if (record.autoStatus) {
        summary.autoMarked++;
      } else if (record.manualEntry) {
        summary.manuallyMarked++;
      }
    });

    summary.pending = summary.totalStaff - (summary.autoMarked + summary.manuallyMarked);
    
    return summary;
  }
}

// Create singleton instance
const autoAttendance = new AutoAttendance();

// Export singleton
export default autoAttendance;
