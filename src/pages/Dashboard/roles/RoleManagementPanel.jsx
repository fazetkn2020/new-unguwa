import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function RoleManagementPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
    // Only show staff users, not students
    const staffUsers = savedUsers.filter(u => u.role !== 'Student');
    setUsers(staffUsers);
  };

  const loadRoles = () => {
    // Define available roles (excluding Student)
    const availableRoles = [
      'Admin',
      'Principal', 
      'VP Academic',
      'VP Admin',
      'Form Master',
      'Exam Officer',
      'Subject Teacher',
      'Senior Master'
      // REMOVED: 'Student'
    ];
    setRoles(availableRoles);
  };

  const updateUserRole = () => {
    if (!selectedUser || !newRole) {
      alert('Please select both user and role');
      return;
    }

    if (!users || users.length === 0) {
      alert('No users found');
      return;
    }

    const userToUpdate = users.find(u => u.id === selectedUser);
    if (!userToUpdate) {
      alert('User not found');
      return;
    }

    const updatedUsers = users.map(u =>
      u.id === selectedUser ? { ...u, role: newRole } : u
    );

    setUsers(updatedUsers);
    
    // Update in main users storage
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const finalUsers = allUsers.map(u => 
      u.id === selectedUser ? { ...u, role: newRole } : u
    );
    
    localStorage.setItem('users', JSON.stringify(finalUsers));
    
    alert(`Role updated successfully! ${userToUpdate.name} is now ${newRole}`);
    setSelectedUser('');
    setNewRole('');
    loadUsers(); // Reload to reflect changes
  };

  const promoteToAdmin = (userId) => {
    const userToPromote = users.find(u => u.id === userId);
    if (!userToPromote) {
      alert('User not found');
      return;
    }

    if (userToPromote.role === 'Admin') {
      alert('User is already an Admin');
      return;
    }

    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, role: 'Admin' } : u
    );

    setUsers(updatedUsers);
    
    // Update in main users storage
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const finalUsers = allUsers.map(u => 
      u.id === userId ? { ...u, role: 'Admin' } : u
    );
    
    localStorage.setItem('users', JSON.stringify(finalUsers));
    alert(`${userToPromote.name} promoted to Admin successfully!`);
    loadUsers(); // Reload to reflect changes
  };

  // Only staff users (students are filtered out)
  const staffUsers = users.filter(u => u && u.role && u.role !== 'Student') || [];

  return (
    <div className="space-y-6">
      {/* Role Assignment */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Staff Role Management</h2>
        <p className="text-gray-600 mb-4">Manage roles for teaching staff and administrators</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Staff Member
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose staff member...</option>
              {staffUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose role...</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={updateUserRole}
              disabled={!selectedUser || !newRole}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Assign Role
            </button>
          </div>
        </div>
      </div>

      {/* Staff Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Staff Members</h3>
          <p className="text-sm text-gray-600">{staffUsers.length} staff members</p>
        </div>
        
        <div className="divide-y">
          {staffUsers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No staff members found.
            </div>
          ) : (
            staffUsers.map(staff => (
              <div key={staff.id} className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{staff.name}</h4>
                  <p className="text-sm text-gray-600">
                    Current Role: <span className="font-medium">{staff.role}</span>
                  </p>
                  {staff.assignedClasses && (
                    <p className="text-xs text-gray-500">
                      Classes: {staff.assignedClasses.join(', ')}
                    </p>
                  )}
                  {staff.assignedSubjects && (
                    <p className="text-xs text-gray-500">
                      Subjects: {staff.assignedSubjects.join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {staff.role !== 'Admin' && (
                    <button
                      onClick={() => promoteToAdmin(staff.id)}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                    >
                      Make Admin
                    </button>
                  )}
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    staff.role === 'Admin' 
                      ? 'bg-red-100 text-red-800'
                      : staff.role === 'Principal'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {staff.role}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {staffUsers.filter(u => u.role === 'Admin').length}
          </div>
          <div className="text-sm text-gray-600">Admins</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {staffUsers.filter(u => ['Principal', 'VP Academic', 'VP Admin'].includes(u.role)).length}
          </div>
          <div className="text-sm text-gray-600">Leadership</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {staffUsers.filter(u => ['Form Master', 'Subject Teacher'].includes(u.role)).length}
          </div>
          <div className="text-sm text-gray-600">Teachers</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {staffUsers.length}
          </div>
          <div className="text-sm text-gray-600">Total Staff</div>
        </div>
      </div>
    </div>
  );
}
