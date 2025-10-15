import React from "react";
import { Link, useLocation } from "react-router-dom";
import { roleMenus } from "../../data/roleMenus"; // Make sure this path is correct
import { roleMenus } from '../../data/roleMenus';

export default function DashboardSidebar({ user }) {
  const location = useLocation();

// In your DashboardSidebar component, add Exam Bank navigation

// Use the roleMenus to dynamically generate navigation links
{roleMenus[user?.role]?.map((item) => (
  <Link
    key={item.name}
    to={item.path}
    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded ${
      location.pathname === item.path ? 'bg-blue-100 text-blue-600' : ''
    }`}
  >
    {item.name}
  </Link>
))}


  // Merge all menu items from all roles
  const mergedMenu = [];
  if (user?.roles && user.roles.length) {
    user.roles.forEach((role) => {
      const items = roleMenus[role] || [];
      items.forEach((item) => {
        // Avoid duplicate paths
        if (!mergedMenu.find((m) => m.path === item.path)) {
          mergedMenu.push(item);
        }
      });
    });
  }

  return (
    <div className="w-64 bg-white shadow-md min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <nav className="flex flex-col gap-2">
        {mergedMenu.map((item) => (
          <Link
            key={item.path}
            to={`/dashboard/${item.path}`}
            className={`px-3 py-2 rounded hover:bg-gray-100 ${
              location.pathname.includes(item.path)
                ? "bg-gray-200 font-semibold"
                : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
