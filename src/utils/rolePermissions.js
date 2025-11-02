// Role creation and permission hierarchy
export const rolePermissions = {
  // Who can create which roles
  roleCreation: {
    'Admin': ['Principal', 'VP Admin', 'VP Academic', 'Senior Master', 'Exam Officer', 'Subject Teacher', 'Student'],
    'Principal': ['VP Admin', 'VP Academic', 'Senior Master', 'Exam Officer', 'Form Master', 'Subject Teacher'],
    'VP Admin': ['Form Master', 'Subject Teacher'],
    'Senior Master': ['Form Master', 'Subject Teacher'],
    'VP Academic': [] // Cannot create users
  },

  // Dashboard access permissions - UPDATED with finance
  dashboardAccess: {
    'Admin': ['users', 'roles', 'settings', 'system', 'reports', 'finance'],
    'VP Admin': ['staff', 'students', 'enrollment', 'attendance', 'communications'],
    'VP Academic': ['subjects', 'classes', 'assignments', 'timetable', 'academic-reports'],
    'Principal': ['overview', 'staff', 'analytics', 'reports', 'messages', 'finance'],
    'Senior Master': ['staff', 'attendance', 'duty-roster'],
    'Exam Officer': ['exams', 'reports', 'submissions', 'question-bank'],
    'Form Master': ['students', 'attendance', 'scores', 'class-management'],
    'Subject Teacher': ['scores', 'attendance', 'subjects', 'students'],
    'Student': ['scores', 'attendance', 'subjects']
  },

  // Finance access permissions - ADDED
  financeAccess: {
    'Admin': true,
    'Principal': true,
    'VP Admin': false,
    'VP Academic': false,
    'Senior Master': false,
    'Exam Officer': false,
    'Form Master': false,
    'Subject Teacher': false,
    'Student': false
  },

  // Can assign roles to others
  canAssignRole: (currentUserRole, targetRole) => {
    return rolePermissions.roleCreation[currentUserRole]?.includes(targetRole) || false;
  },

  // Check if user can access a module
  canAccessModule: (userRole, module) => {
    return rolePermissions.dashboardAccess[userRole]?.includes(module) || false;
  },

  // Check if user can access finance - ADDED
  canAccessFinance: (userRole) => {
    return rolePermissions.financeAccess[userRole] || false;
  }
};
