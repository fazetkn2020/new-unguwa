<<<<<<< HEAD
// src/pages/Dashboard/roles/RoleManagementPanel.jsx
=======
// src/pages/Dashboard/roles/RoleManagementPanel.jsx - MOBILE OPTIMIZED VERSION
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
import React, { useState } from "react";

export default function RoleManagementPanel({ users, onUsersUpdate }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [newRole, setNewRole] = useState("");
  const [formClass, setFormClass] = useState("");
  const [formTicker, setFormTicker] = useState("");

  const availableRoles = [
    "Principal",
    "VP Admin",
    "VP Academic",
    "Form Master",
    "Subject Teacher",
    "Senior Master",
    "Exam Officer",
    "admin",
  ];

  const handleAssignRole = () => {
    if (!selectedUser || !newRole) {
      alert("Please select both a user and a role");
      return;
    }

<<<<<<< HEAD
    // 🔒 Prevent duplicate Form Master assignment for the same class
=======
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
    if (newRole === "Form Master") {
      if (!formClass) {
        alert("Please select the class (SS1, SS2, SS3) for the Form Master");
        return;
      }

      const fullFormClass = `${formClass}${formTicker || ""}`;
      const existingMaster = users.find(
        (u) => u.role === "Form Master" && u.formClass === fullFormClass
      );

      if (existingMaster && existingMaster.email !== selectedUser) {
        alert(
<<<<<<< HEAD
          `❌ ${existingMaster.name} is already assigned as Form Master of ${fullFormClass}. 
Please unassign them first before reassigning this class.`
=======
          `❌ ${existingMaster.name} is already assigned as Form Master of ${fullFormClass}. Please unassign them first before reassigning this class.`
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
        );
        return;
      }
    }

    const fullFormClass =
      newRole === "Form Master" && formClass
        ? `${formClass}${formTicker || ""}`
        : null;

    const updatedUsers = users.map((user) =>
      user.email === selectedUser
        ? {
            ...user,
            role: newRole,
            ...(newRole === "Form Master" && { formClass: fullFormClass }),
          }
        : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    onUsersUpdate();

    const userName = users.find((u) => u.email === selectedUser)?.name;
    const message =
      newRole === "Form Master"
        ? `✅ Assigned ${userName} as Form Master of ${fullFormClass}`
        : `✅ Successfully assigned ${newRole} role to ${userName}`;
    alert(message);

<<<<<<< HEAD
    // Reset all fields
=======
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
    setSelectedUser("");
    setNewRole("");
    setFormClass("");
    setFormTicker("");
  };

  const selectedUserData = users.find((user) => user.email === selectedUser);

  return (
<<<<<<< HEAD
    <div className="p-6 bg-[#0e1420] rounded-2xl shadow-lg border border-gray-800">
      <h3 className="text-xl font-semibold mb-6 text-cyan-400 tracking-wide">
        Role Management
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* User Selection */}
=======
    <div className="p-4 sm:p-6 bg-[#0e1420] rounded-2xl shadow-lg border border-gray-800">
      <h3 className="text-lg sm:text-xl font-semibold mb-6 text-cyan-400 tracking-wide text-center sm:text-left">
        Role Management
      </h3>

      {/* User + Role Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select User
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
<<<<<<< HEAD
            className="w-full bg-[#1a2233] border border-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
=======
            className="w-full bg-[#1a2233] border border-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
          >
            <option value="">Choose a user...</option>
            {users.map((user) => (
              <option key={user.email} value={user.email}>
<<<<<<< HEAD
                {user.name} ({user.email}) — Current: {user.role}
=======
                {user.name} ({user.email}) — {user.role}
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Assign Role
          </label>
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
<<<<<<< HEAD
            className="w-full bg-[#1a2233] border border-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
=======
            className="w-full bg-[#1a2233] border border-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
          >
            <option value="">Choose a role...</option>
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

<<<<<<< HEAD
      {/* Show extra inputs if Form Master selected */}
      {newRole === "Form Master" && (
        <div className="mb-6 bg-[#152033] border border-cyan-700/40 rounded-lg p-4">
          <h4 className="font-medium text-cyan-300 mb-3">
            Form Master Class Assignment
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
=======
      {/* Extra inputs for Form Master */}
      {newRole === "Form Master" && (
        <div className="mb-6 bg-[#152033] border border-cyan-700/40 rounded-lg p-3 sm:p-4">
          <h4 className="font-medium text-cyan-300 mb-3 text-center sm:text-left">
            Form Master Class Assignment
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Choose Class
              </label>
              <select
                value={formClass}
                onChange={(e) => setFormClass(e.target.value)}
<<<<<<< HEAD
                className="w-full bg-[#1a2233] border border-gray-700 text-gray-200 rounded px-2 py-2"
=======
                className="w-full bg-[#1a2233] border border-gray-700 text-gray-200 rounded px-2 py-2 text-sm"
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
              >
                <option value="">Select class...</option>
                <option value="SS1">SS1</option>
                <option value="SS2">SS2</option>
                <option value="SS3">SS3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Optional Ticker (A–O)
              </label>
              <select
                value={formTicker}
                onChange={(e) => setFormTicker(e.target.value)}
<<<<<<< HEAD
                className="w-full bg-[#1a2233] border border-gray-700 text-gray-200 rounded px-2 py-2"
=======
                className="w-full bg-[#1a2233] border border-gray-700 text-gray-200 rounded px-2 py-2 text-sm"
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
              >
                <option value="">None</option>
                {Array.from("ABCDEFGHIJKLMNO").map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
<<<<<<< HEAD
          <p className="text-xs text-gray-400 mt-2">
            Example: Selecting SS1 + A becomes <strong>SS1A</strong>.
          </p>
        </div>
      )}

      {/* User Preview */}
      {selectedUserData && (
        <div className="bg-[#152033] border border-cyan-700/40 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-cyan-300 mb-2">User Preview</h4>
          <p className="text-gray-200">
            <strong>Name:</strong> {selectedUserData.name}
          </p>
          <p className="text-gray-200">
            <strong>Email:</strong> {selectedUserData.email}
          </p>
          <p className="text-gray-200">
            <strong>Current Role:</strong> {selectedUserData.role}
          </p>
          {selectedUserData.formClass && (
            <p className="text-gray-200">
              <strong>Form Class:</strong> {selectedUserData.formClass}
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleAssignRole}
        disabled={!selectedUser || !newRole}
        className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed shadow-md"
      >
        Assign Role
      </button>

      {/* Role Statistics */}
      <div className="mt-8">
        <h4 className="font-semibold mb-4 text-gray-200">Role Distribution</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
=======
          <p className="text-xs text-gray-400 mt-2 text-center sm:text-left">
            Example: Selecting SS1 + A becomes <strong>SS1A</strong>.
          </p>
        </div>
      )}

      {/* User Preview */}
      {selectedUserData && (
        <div className="bg-[#152033] border border-cyan-700/40 rounded-lg p-3 sm:p-4 mb-6">
          <h4 className="font-medium text-cyan-300 mb-2 text-center sm:text-left">
            User Preview
          </h4>
          <div className="text-gray-200 text-sm space-y-1">
            <p><strong>Name:</strong> {selectedUserData.name}</p>
            <p><strong>Email:</strong> {selectedUserData.email}</p>
            <p><strong>Current Role:</strong> {selectedUserData.role}</p>
            {selectedUserData.formClass && (
              <p><strong>Form Class:</strong> {selectedUserData.formClass}</p>
            )}
          </div>
        </div>
      )}

      {/* Assign Button */}
      <div className="flex justify-center sm:justify-start">
        <button
          onClick={handleAssignRole}
          disabled={!selectedUser || !newRole}
          className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed shadow-md text-sm"
        >
          Assign Role
        </button>
      </div>

      {/* Role Statistics */}
      <div className="mt-8">
        <h4 className="font-semibold mb-4 text-gray-200 text-center sm:text-left">
          Role Distribution
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
          {availableRoles.map((role) => {
            const roleUsers = users.filter((u) => u.role === role);
            return (
              <div
                key={role}
<<<<<<< HEAD
                className="bg-[#1b2738] border border-gray-700 rounded-lg p-3 text-center hover:border-cyan-600 transition-all"
              >
                <div className="text-2xl font-bold text-cyan-400">
                  {roleUsers.length}
                </div>
                <div className="text-sm text-gray-400 capitalize mb-1">
                  {role}
                </div>
                {roleUsers.length > 0 && (
                  <div className="text-xs text-gray-500 max-h-16 overflow-y-auto">
=======
                className="bg-[#1b2738] border border-gray-700 rounded-lg p-3 text-center hover:border-cyan-600 transition-all text-sm"
              >
                <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                  {roleUsers.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400 capitalize mb-1">
                  {role}
                </div>
                {roleUsers.length > 0 && (
                  <div className="text-xs text-gray-500 max-h-16 overflow-y-auto break-words">
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
                    {roleUsers
                      .map((u) =>
                        role === "Form Master" && u.formClass
                          ? `${u.name} (${u.formClass})`
                          : u.name
                      )
                      .join(", ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
