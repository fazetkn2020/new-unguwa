import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout() {
  const { user } = useAuth() || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Top-left: Profile (plain link/text) */}
          <div>
            <Link
              to="/dashboard/profile"
              className="text-sm font-medium text-gray-700 hover:underline"
            >
              Profile
            </Link>
          </div>

          {/* Top-right: profile picture placeholder */}
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600">
            {/* optional initials */}
            {user?.fullName
              ? user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              : "U"}
          </div>
        </div>
      </header>

      {/* Main content area (no sidebar) */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-3xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
