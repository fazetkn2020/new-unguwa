import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth() || {};

  return (
    <header className="bg-white shadow p-4 mb-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        Welcome, {user?.fullName || "User"}
      </h1>
      <span className="text-gray-600">{user?.role}</span>
    </header>
  );
}
