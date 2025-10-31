export const userFilters = {
  // Original working filters
  pendingStaff: (users) => users.filter(
    (user) =>
      user.role === "pending" &&
      (!user.userType || user.userType !== "student")
  ),

  pendingStudents: (users) => users.filter((user) => {
    return (
      (user.role === "pending" && user.userType === "student") ||
      (user.role === "pending" && (user.studentId || user.class || user.formClass)) ||
      (user.status === "pending" && (user.studentId || user.class))
    );
  }),

  activeStaff: (users) => users.filter(user => 
    user.status === 'active' && 
    ['Subject Teacher', 'Form Master', 'Senior Master', 'Principal', 'VP Academic', 'VP Admin', 'Exam Officer', 'Admin'].includes(user.role)
  ),

  activeStudents: (users) => users.filter(user => 
    user.status === 'active' && user.role === 'Student'
  ),

  allActiveUsers: (users) => users.filter(user => user.status === 'active'),
  
  allPendingUsers: (users) => users.filter(user => user.status === 'pending' || user.role === 'pending')
};
