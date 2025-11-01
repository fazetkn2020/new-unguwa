import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { rolePermissions } from '../../../utils/rolePermissions';

export default function RoleAssignmentPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(allUsers);
  };

  // Only Admin and Principal can assign high-level roles
  const canAssignRoles = ['Admin', 'Principal'].includes(user?.role);

  const assignRole = (userId, newRole) => {
    if (!canAssignRoles) {
      alert('Only Admin and Principal can assign roles.');
      return;
    }

    if (!rolePermissions.canAssignRole(user.role, newRole)) {
      alert(`You cannot assign ${newRole} role.`);
      return;
    }

    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadUsers();
    alert(`Role updated to ${newRole} successfully!`);
  };

  const getAssignableRoles = () => {
    return rolePermissions.roleCreation[user.role] || [];
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true;
    return u.role === filter;
  });

  if (!canAssignRoles) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p>Only Admin and Principal can access role assignment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Role Assignment Center</h2>
        <p className="text-gray-600">
          Assign and manage staff roles across the school
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Filter by Role:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Roles</option>
              <option value="Teacher">Teachers</option>
              <option value="Form Master">Form Masters</option>
              <option value="Subject Teacher">Subject Teachers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            Staff Members ({filteredUsers.length})
          </h3>
        </div>

        <div className="divide-y">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No users found matching your filters.
            </div>
          ) : (
            filteredUsers.map(staff => (
              <div key={staff.id} className="p-6 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-lg">{staff.name}</h4>
                  <div className="text-sm text-gray-600">
                    {staff.email} • {staff.phone}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Current role: <span className="font-medium">{staff.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    staff.role === 'Teacher' ? 'bg-blue-100 text-blue-800' :
                    staff.role === 'Form Master' ? 'bg-green-100 text-green-800' :
                    staff.role === 'Subject Teacher' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {staff.role}
                  </span>

                  <select
                    value={staff.role}
                    onChange={(e) => assignRole(staff.id, e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value={staff.role}>Keep {staff.role}</option>
                    {getAssignableRoles().map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
