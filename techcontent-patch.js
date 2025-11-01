// 🧩 Admin modules
case 'users':
  return <UserManagementPanel users={dashboardData.users} />;

// ✅ ADD ROLE ASSIGNMENT 
case 'role-assignment':
  if (user.role === 'Admin' || user.role === 'admin') {
    return <RoleAssignmentPanel />;
  }
  break;

// ✅ ADD SUBJECTS MODULE CASE
case 'subjects':
