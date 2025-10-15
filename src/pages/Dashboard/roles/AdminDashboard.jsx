import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import RoleAssignmentPanel from "./RoleAssignmentPanel";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Get users list from localStorage (simulating a small DB)
    const savedUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
    setUsers(savedUsers);
  }, []);

  if (user?.role !== "admin") {
    return <p className="text-red-500 p-4">Access Denied. Admins Only.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <RoleAssignmentPanel users={users} setUsers={setUsers} />
    </div>
  );
}
