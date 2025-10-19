// Default attendance settings and configuration
export const attendanceSettings = {
  lateThreshold: "08:00",
  schoolName: "Nigerian Secondary School",
  workHours: {
    start: "07:30",
    end: "15:00"
  }
};

// Get staff members from registered users
export const getStaffMembers = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  
  // Filter staff roles (exclude students if any)
  const staffRoles = ["principal", "vp admin", "vp academic", "senior master", 
                     "exam officer", "form master", "teacher", "admin"];
  
  const staffMembers = users
    .filter(user => staffRoles.includes(user.role?.toLowerCase()))
    .map(user => ({
      id: user.id,
      name: user.fullName || user.name,
      role: user.role,
      email: user.email,
      // Use login password for attendance by default
      // Users can set separate attendance password later if needed
      password: user.attendancePassword || user.password
    }));
  
  return staffMembers;
};

// Get VP Admin users
export const getVPAdmins = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users.filter(user => user.role?.toLowerCase() === "vp admin");
};

// Set attendance password for user
export const setAttendancePassword = (userId, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].attendancePassword = password;
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  }
  return false;
};

// Initialize attendance data in localStorage if not exists
export const initializeAttendanceData = () => {
  if (!localStorage.getItem('attendanceSettings')) {
    localStorage.setItem('attendanceSettings', JSON.stringify(attendanceSettings));
  }
  
  if (!localStorage.getItem('attendanceRecords')) {
    localStorage.setItem('attendanceRecords', JSON.stringify({}));
  }
};

// Export default for backward compatibility
export default {
  attendanceSettings,
  getStaffMembers,
  getVPAdmins,
  setAttendancePassword,
  initializeAttendanceData
};
