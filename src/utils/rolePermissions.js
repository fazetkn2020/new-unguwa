// Role creation and permission hierarchy
export const rolePermissions = {
  // Who can create which roles
  roleCreation: {
    'Admin': ['Principal', 'VP Admin', 'VP Academic', 'Senior Master', 'Exam Officer', 'Form Master', 'Subject Teacher', 'Student'],
    'Principal': ['VP Admin', 'VP Academic', 'Senior Master', 'Exam Officer', 'Form Master', 'Subject Teacher'],
    'VP Admin': ['Form Master', 'Subject Teacher'],
    'Senior Master': ['Form Master', 'Subject Teacher'],
    'VP Academic': [] // Cannot create users
  },

  // Dashboard access permissions
  dashboardAccess: {
    'Admin': ['users', 'roles', 'settings', 'system', 'reports'],
    'VP Admin': ['staff', 'students', 'enrollment', 'attendance', 'communications'],
    'VP Academic': ['subjects', 'classes', 'assignments', 'timetable', 'academic-reports'],
    'Principal': ['overview', 'staff', 'analytics', 'reports', 'messages'],
    'Senior Master': ['staff', 'attendance', 'duty-roster'],
    'Exam Officer': ['exams', 'reports', 'submissions', 'question-bank'],
    'Form Master': ['students', 'attendance', 'scores', 'class-management'],
    'Subject Teacher': ['scores', 'attendance', 'subjects', 'students'],
    'Student': ['scores', 'attendance', 'subjects']
  },

  // Can assign roles to others
  canAssignRole: (currentUserRole, targetRole) => {
    return rolePermissions.roleCreation[currentUserRole]?.includes(targetRole) || false;
  },

  // Check if user can access a module
  canAccessModule: (userRole, module) => {
    return rolePermissions.dashboardAccess[userRole]?.includes(module) || false;
  }
};
