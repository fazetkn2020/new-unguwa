// Utility to fix user roles in localStorage
export const fixUserRoles = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  let fixed = false;
  
  const roleMap = {
    'admin': 'Admin',
    'principal': 'Principal',
    'vp admin': 'VP Admin', 
    'vp-admin': 'VP Admin',
    'vp academic': 'VP Academic',
    'vp-academic': 'VP Academic',
    'senior master': 'Senior Master',
    'senior-master': 'Senior Master',
    'exam officer': 'Exam Officer',
    'exam-officer': 'Exam Officer',
    'form master': 'Form Master',
    'form-master': 'Form Master',
    'subject teacher': 'Subject Teacher',
    'subject-teacher': 'Subject Teacher',
    'teacher': 'Subject Teacher'
  };

  const fixedUsers = users.map(user => {
    if (roleMap[user.role]) {
      console.log(`🔄 Fixing role: ${user.role} → ${roleMap[user.role]}`);
      fixed = true;
      return { ...user, role: roleMap[user.role] };
    }
    return user;
  });

  if (fixed) {
    localStorage.setItem("users", JSON.stringify(fixedUsers));
    console.log("✅ User roles have been fixed");
  }
  
  return fixed;
};

// Also ensure admin user exists
export const ensureAdminUser = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const adminExists = users.some(user => user.role === "Admin");

  if (!adminExists) {
    const adminUser = {
      id: "admin-001",
      role: "Admin",
      fullName: "System Administrator",
      name: "System Administrator",
      email: "admin@school.edu",
      password: "admin123",
      createdAt: new Date().toISOString(),
      status: "active"
    };

    users.push(adminUser);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("✅ Default admin user created: admin@school.edu / admin123");
    return true;
  }
  
  return false;
};
