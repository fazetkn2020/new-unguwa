// src/data/roleMenus.js - ONLY for admin navigation
// All other users will get menus from their assigned functions
export const roleMenus = {
  'Admin': [
    { name: "👥 User Management", path: "/dashboard/admin/users" },
    { name: "🎯 Role Templates", path: "/dashboard/admin/templates" },
    { name: "💰 Finance Control", path: "/dashboard/admin/finance" },
    { name: "⚙️ System Settings", path: "/dashboard/admin/settings" }
  ]
  // No other roles here - they use function-based menus
};
