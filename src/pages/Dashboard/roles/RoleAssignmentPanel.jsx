import React, { useState } from "react";

export default function RoleAssignmentPanel({ users, setUsers }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");

  const handleAssignRole = () => {
    if (!selectedUser || !role) return alert("Select user and role first!");

    const updatedUsers = users.map((u) =>
      u.email === selectedUser.email ? { ...u, role } : u
    );

    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    alert(`${selectedUser.name}'s role updated to ${role}`);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-3">Role Management</h3>

      <select
        className="border rounded p-2 w-full mb-3"
        onChange={(e) =>
          setSelectedUser(
            users.find((u) => u.email === e.target.value) || null
          )
        }
      >
        <option value="">Select User</option>
        {users.map((u) => (
          <option key={u.email} value={u.email}>
            {u.name} ({u.role || "no role"})
          </option>
        ))}
      </select>

      <select
        className="border rounded p-2 w-full mb-3"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Select Role</option>
        <option value="formMaster">Form Master</option>
        <option value="subjectTeacher">Subject Teacher</option>
        <option value="examOfficer">Exam Officer</option>
        <option value="principal">Principal</option>
        <option value="vpAcademic">VP Academic</option>
        <option value="vpAdmin">VP Admin</option>
        <option value="seniorMaster">Senior Master</option>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>

      <button
        onClick={handleAssignRole}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Assign Role
      </button>
    </div>
  );
}
