import React, { useState } from 'react';
import FormMasterAssignmentModal from '../modals/FormMasterAssignmentModal';

const ROLES = [
  'Admin', 'Principal', 'VP Academic', 'VP Admin',
  'Form Master', 'Exam Officer', 'Subject Teacher', 'Senior Master'
];

export default function RoleAssignmentSection({
  users,
  existingClasses,
  formMasterAssignment,
  setFormMasterAssignment,
  loadingStates,
  setLoading,
  refreshData,
  onUsersUpdate
}) {
  const [selectedUser, setSelectedUser] = useState('');
  const [newRole, setNewRole] = useState('');

  const updateUserRole = async () => {
    if (!selectedUser || !newRole) {
      alert('Please select both user and role');
      return;
    }

    if (newRole === 'Form Master') {
      const userToUpdate = users.find(u => u.id === selectedUser);
      if (userToUpdate) {
        setFormMasterAssignment({ userId: selectedUser, show: true, userName: userToUpdate.name });
      }
      return;
    }

    setLoading(selectedUser, true);
    await assignRoleToUser(selectedUser, newRole);
    setLoading(selectedUser, false);
  };

  const assignRoleToUser = async (userId, role) => {
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = allUsers.map(u =>
      u.id === userId ? { 
        ...u, 
        role: role,
        ...(role !== 'Form Master' && { assignedClasses: [] })
      } : u
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    refreshData();
    if (onUsersUpdate) onUsersUpdate(updatedUsers);
    
    const userToUpdate = users.find(u => u.id === userId);
    alert(`✅ ${userToUpdate.name} is now ${role}`);
    setSelectedUser('');
    setNewRole('');
  };

  return (
    <>
      <FormMasterAssignmentModal
        formMasterAssignment={formMasterAssignment}
        setFormMasterAssignment={setFormMasterAssignment}
        existingClasses={existingClasses}
        setLoading={setLoading}
        refreshData={refreshData}
        onUsersUpdate={onUsersUpdate}
        users={users}
      />

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b bg-blue-50 rounded-t-lg">
          <h2 className="text-xl font-bold text-blue-800">Role Assignment</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staff Member</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose staff...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose role...</option>
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={updateUserRole}
                disabled={!selectedUser || !newRole || loadingStates[selectedUser]}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loadingStates[selectedUser] ? '⏳ Updating...' : 'Assign Role'}
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> Form Masters require class assignment. Other roles are assigned directly.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}