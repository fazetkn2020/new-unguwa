// src/data/roleMenus.js
export const roleMenus = {
  'Admin': [
    { name: "👑 Role Assignment", path: "/dashboard/admin/role-assignment" },
    { name: "👥 User Management", path: "/dashboard/admin/users" },
    { name: "⚙️ System Settings", path: "/dashboard/admin/settings" },
    { name: "📊 School Setup", path: "/dashboard/admin/setup" }
  ],
  'VP Admin': [
    { name: "👥 User Management", path: "/dashboard/admin/users" },
    { name: "📚 Subject Management", path: "/dashboard/admin/subjects" },
    { name: "🎯 Role Management", path: "/dashboard/admin/roles" },
    { name: "⚙️ System Settings", path: "/dashboard/admin/settings" },
    { name: "📊 Student Enrollment", path: "/dashboard/admin/enrollment" },
    { name: "📝 Attendance", path: "/dashboard/admin/attendance" },
    { name: "📨 Communications", path: "/dashboard/admin/communications" },
    { name: "📅 Calendar", path: "/dashboard/admin/calendar" }
  ],
  // ... rest of your existing menus
