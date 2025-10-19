// Utility functions for attendance data storage and retrieval
import { getStaffMembers, getVPAdmins, setAttendancePassword } from '../data/attendanceConfig.js';

export const getAttendanceSettings = () => {
  const settings = localStorage.getItem('attendanceSettings');
  return settings ? JSON.parse(settings) : null;
};

export const updateAttendanceSettings = (newSettings) => {
  localStorage.setItem('attendanceSettings', JSON.stringify(newSettings));
};

export const getAttendanceRecords = () => {
  const records = localStorage.getItem('attendanceRecords');
  return records ? JSON.parse(records) : {};
};

export const saveAttendanceRecord = (date, records) => {
  const allRecords = getAttendanceRecords();
  allRecords[date] = records;
  localStorage.setItem('attendanceRecords', JSON.stringify(allRecords));
};

export const getTodaysAttendance = () => {
  const today = new Date().toISOString().split('T')[0];
  const records = getAttendanceRecords();
  return records[today] || {};
};

export const getStaffAttendance = (staffId) => {
  const records = getAttendanceRecords();
  const staffRecords = {};
  
  Object.keys(records).forEach(date => {
    if (records[date][staffId]) {
      staffRecords[date] = {
        ...records[date][staffId],
        date: date
      };
    }
  });
  
  return staffRecords;
};

export const getAllStaff = () => {
  return getStaffMembers();
};

export const getStaffById = (staffId) => {
  const staff = getStaffMembers();
  return staff.find(staff => staff.id === staffId);
};

export const getCurrentUserStaff = (currentUser) => {
  if (!currentUser) return null;
  return getStaffById(currentUser.id);
};

export const authenticateStaff = (staffId, password) => {
  const staff = getStaffById(staffId);
  if (!staff) return false;
  
  // Try attendance password first, then login password
  return staff.password === password;
};

export const authenticateVP = (password, currentUser) => {
  if (!currentUser) return false;
  
  // Check if current user is VP Admin
  const vpAdmins = getVPAdmins();
  const isVP = vpAdmins.some(vp => vp.id === currentUser.id);
  
  if (!isVP) return false;
  
  // Authenticate with user's password
  return currentUser.password === password;
};

export const setStaffAttendancePassword = (userId, password) => {
  return setAttendancePassword(userId, password);
};
