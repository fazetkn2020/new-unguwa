export const userFilters = {
  // Pending staff: users with role "pending" and not students
  pendingStaff: (users) => users.filter(
    (user) =>
      (user.role === "pending" || user.status === "pending") &&
      (!user.userType || user.userType !== "student") &&
      !user.class &&
      !user.formClass &&
      !user.studentId
  ),

  // Pending students: users with student indicators
  pendingStudents: (users) => users.filter((user) => {
    return (
      (user.role === "pending" && user.userType === "student") ||
      (user.role === "pending" && (user.studentId || user.class || user.formClass)) ||
      (user.status === "pending" && (user.studentId || user.class)) ||
      (user.studentId && !user.role || user.role === 'pending')
    );
  }),

  // Active staff: any user with staff role (check both status and role)
  activeStaff: (users) => users.filter(user =>
    (user.status === 'active' || 
     ['Subject Teacher', 'Form Master', 'Senior Master', 'Principal', 'VP Academic', 'VP Admin', 'Exam Officer', 'Admin', 'Teacher'].includes(user.role)) &&
    user.role !== 'Student' &&
    user.role !== 'pending' &&
    !user.class &&
    !user.formClass &&
    !user.studentId
  ),

  // Active students: students with active status or Student role
  activeStudents: (users) => users.filter(user =>
    (user.role === 'Student' && user.status !== 'pending') ||
    (user.class && user.status === 'active') ||
    (user.formClass && user.status === 'active')
  ),

  // All active users: any user not pending
  allActiveUsers: (users) => users.filter(user => 
    user.status === 'active' || 
    (user.role !== 'pending' && user.status !== 'pending')
  ),

  // All pending users
  allPendingUsers: (users) => users.filter(user => 
    user.status === 'pending' || user.role === 'pending'
  ),

  // All staff (any user with staff role or no student indicators)
  allStaff: (users) => users.filter(user =>
    ['Subject Teacher', 'Form Master', 'Senior Master', 'Principal', 'VP Academic', 'VP Admin', 'Exam Officer', 'Admin', 'Teacher'].includes(user.role) ||
    (user.role === 'pending' && !user.class && !user.formClass && !user.studentId) ||
    (!user.class && !user.formClass && !user.studentId && user.role !== 'Student')
  ),

  // All students (any user with student indicators)
  allStudents: (users) => users.filter(user => 
    user.role === 'Student' || 
    user.class || 
    user.formClass ||
    user.studentId
  )
};
