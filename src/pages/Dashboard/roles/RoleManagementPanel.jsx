import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function RoleManagementPanel({ users: propUsers, onUsersUpdate }) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newRole, setNewRole] = useState('');
  const [loadingStates, setLoadingStates] = useState({});
  const [formMasterAssignment, setFormMasterAssignment] = useState({ 
    userId: null, show: false, userName: '' 
  });
  const [collapsedSections, setCollapsedSections] = useState({
    roleAssignment: false,
    staffList: false,
    statistics: false
  });

  // Define classes - ONLY SS1, SS2, SS3
  const CLASSES = ["SS1", "SS2", "SS3"];

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, [propUsers]);

  const loadUsers = () => {
    if (propUsers && propUsers.length > 0) {
      const staffUsers = propUsers.filter(u => u.role !== 'Student' && u.role !== 'pending');
      setUsers(staffUsers);
    } else {
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const staffUsers = savedUsers.filter(u => u.role !== 'Student' && u.role !== 'pending');
      setUsers(staffUsers);
    }
  };

  const loadRoles = () => {
    const availableRoles = [
      'Admin', 'Principal', 'VP Academic', 'VP Admin',
      'Form Master', 'Exam Officer', 'Subject Teacher', 'Senior Master'
    ];
    setRoles(availableRoles);
  };

  // Toggle collapsible sections
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Set loading state
  const setLoading = (id, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [id]: isLoading
    }));
  };

  // Delete staff member - INSTANT FIX
  const deleteStaff = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      return;
    }

    setLoading(userId, true);

    const staffToDelete = users.find(u => u.id === userId);
    if (!staffToDelete) {
      alert('Staff member not found');
      setLoading(userId, false);
      return;
    }

    // Prevent deleting yourself
    if (staffToDelete.id === currentUser.id) {
      alert('You cannot delete your own account!');
      setLoading(userId, false);
      return;
    }

    try {
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = allUsers.filter(u => u.id !== userId);

      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // INSTANT UPDATE: Update local state immediately
      const updatedStaffUsers = users.filter(u => u.id !== userId);
      setUsers(updatedStaffUsers);

      // Call parent update if provided
      if (onUsersUpdate) {
        onUsersUpdate(updatedUsers); // Pass the updated users array
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      alert(`✅ Staff member ${staffToDelete.name} deleted successfully!`);
    } catch (error) {
      alert('Error deleting staff member');
    } finally {
      setLoading(userId, false);
    }
  };

  // Toggle staff status (activate/deactivate) - INSTANT FIX
  const toggleStaffStatus = async (userId) => {
    setLoading(userId, true);

    const staffToUpdate = users.find(u => u.id === userId);
    if (!staffToUpdate) {
      alert('Staff member not found');
      setLoading(userId, false);
      return;
    }

    // Prevent deactivating yourself
    if (staffToUpdate.id === currentUser.id) {
      alert('You cannot deactivate your own account!');
      setLoading(userId, false);
      return;
    }

    try {
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      const newStatus = staffToUpdate.status === 'active' ? 'inactive' : 'active';
      
      const updatedUsers = allUsers.map(u =>
        u.id === userId ? { ...u, status: newStatus } : u
      );

      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // INSTANT UPDATE: Update local state immediately
      const updatedStaffUsers = users.map(u =>
        u.id === userId ? { ...u, status: newStatus } : u
      );
      setUsers(updatedStaffUsers);

      if (onUsersUpdate) {
        onUsersUpdate(updatedUsers); // Pass the updated users array
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      alert(`✅ Staff member ${staffToUpdate.name} ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      alert('Error updating staff status');
    } finally {
      setLoading(userId, false);
    }
  };

  // FORM MASTER CLASS ASSIGNMENT
  const openFormMasterAssignment = (userId, userName) => {
    setFormMasterAssignment({ userId, show: true, userName });
  };

  const assignFormMasterWithClass = async (className) => {
    if (!formMasterAssignment.userId) return;
    
    setLoading(formMasterAssignment.userId, true);

    try {
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = allUsers.map(u =>
        u.id === formMasterAssignment.userId
          ? { 
              ...u, 
              role: 'Form Master',
              status: 'active',
              assignedClasses: [className],
              approvedAt: new Date().toISOString()
            }
          : u
      );

      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Update local state
      const updatedStaffUsers = users.map(u =>
        u.id === formMasterAssignment.userId
          ? { 
              ...u, 
              role: 'Form Master',
              status: 'active',
              assignedClasses: [className]
            }
          : u
      );
      setUsers(updatedStaffUsers);

      if (onUsersUpdate) {
        onUsersUpdate(updatedUsers);
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      alert(`✅ ${formMasterAssignment.userName} assigned as Form Master for ${className}!`);
    } catch (error) {
      alert('Error assigning Form Master');
    } finally {
      setLoading(formMasterAssignment.userId, false);
      setFormMasterAssignment({ userId: null, show: false, userName: '' });
    }
  };

  const updateUserRole = async () => {
    if (!selectedUser || !newRole) {
      alert('Please select both user and role');
      return;
    }

    // If Form Master is selected, open class assignment modal
    if (newRole === 'Form Master') {
      const userToUpdate = users.find(u => u.id === selectedUser);
      if (userToUpdate) {
        openFormMasterAssignment(selectedUser, userToUpdate.name);
      }
      return;
    }

    setLoading(selectedUser, true);

    const userToUpdate = users.find(u => u.id === selectedUser);
    if (!userToUpdate) {
      alert('User not found');
      setLoading(selectedUser, false);
      return;
    }

    try {
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = allUsers.map(u =>
        u.id === selectedUser ? { ...u, role: newRole } : u
      );

      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Update local state
      const updatedStaffUsers = users.map(u =>
        u.id === selectedUser ? { ...u, role: newRole } : u
      );
      setUsers(updatedStaffUsers);

      if (onUsersUpdate) {
        onUsersUpdate(updatedUsers);
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      alert(`✅ Role updated successfully! ${userToUpdate.name} is now ${newRole}`);
      setSelectedUser('');
      setNewRole('');
    } catch (error) {
      alert('Error updating role');
    } finally {
      setLoading(selectedUser, false);
    }
  };

  const promoteToAdmin = async (userId) => {
    setLoading(userId, true);

    const userToPromote = users.find(u => u.id === userId);
    if (!userToPromote) {
      alert('User not found');
      setLoading(userId, false);
      return;
    }

    if (userToPromote.role === 'Admin') {
      alert('User is already an Admin');
      setLoading(userId, false);
      return;
    }

    try {
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = allUsers.map(u =>
        u.id === userId ? { ...u, role: 'Admin' } : u
      );

      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Update local state
      const updatedStaffUsers = users.map(u =>
        u.id === userId ? { ...u, role: 'Admin' } : u
      );
      setUsers(updatedStaffUsers);

      if (onUsersUpdate) {
        onUsersUpdate(updatedUsers);
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      alert(`✅ ${userToPromote.name} promoted to Admin successfully!`);
    } catch (error) {
      alert('Error promoting user');
    } finally {
      setLoading(userId, false);
    }
  };

  const staffUsers = users.filter(u => u && u.role && u.role !== 'Student') || [];

  return (
    <div className="space-y-4 p-4">
      {/* Form Master Assignment Modal */}
      {formMasterAssignment.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md border-2 border-yellow-400 shadow-xl">
            <h3 className="text-xl font-bold mb-3 text-yellow-600">
              🎯 Assign Form Master Class
            </h3>
            <p className="text-gray-700 mb-2">
              Assigning: <span className="font-semibold">{formMasterAssignment.userName}</span>
            </p>
            <p className="text-gray-600 text-sm mb-6">
              Select the class this Form Master will manage:
            </p>
            <div className="space-y-3 mb-6">
              {CLASSES.map(className => (
                <button
                  key={className}
                  onClick={() => assignFormMasterWithClass(className)}
                  className="w-full p-4 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white font-semibold text-lg transition-colors duration-200 shadow-md"
                >
                  {className}
                </button>
              ))}
            </div>
            <button
              onClick={() => setFormMasterAssignment({ userId: null, show: false, userName: '' })}
              className="w-full p-3 bg-gray-500 hover:bg-gray-600 rounded-lg text-white font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Role Assignment - COLLAPSIBLE */}
      <div className="bg-white rounded-lg shadow">
        <button
          onClick={() => toggleSection('roleAssignment')}
          className="w-full p-4 flex justify-between items-center bg-blue-50 hover:bg-blue-100 rounded-t-lg border-b"
        >
          <h2 className="text-xl font-bold text-blue-800">Staff Role Management</h2>
          <span className="text-blue-600 font-bold text-lg">
            {collapsedSections.roleAssignment ? '+' : '-'}
          </span>
        </button>
        
        {!collapsedSections.roleAssignment && (
          <div className="p-6">
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
                  disabled={!selectedUser || !newRole || loadingStates[selectedUser]}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {loadingStates[selectedUser] ? '⏳ Updating...' : 'Assign Role'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Staff Overview - COLLAPSIBLE */}
      <div className="bg-white rounded-lg shadow">
        <button
          onClick={() => toggleSection('staffList')}
          className="w-full p-4 flex justify-between items-center bg-green-50 hover:bg-green-100 rounded-t-lg border-b"
        >
          <div>
            <h3 className="text-lg font-semibold text-green-800">Staff Members</h3>
            <p className="text-sm text-gray-600">{staffUsers.length} staff members</p>
          </div>
          <span className="text-green-600 font-bold text-lg">
            {collapsedSections.staffList ? '+' : '-'}
          </span>
        </button>
        
        {!collapsedSections.staffList && (
          <div className="divide-y">
            {staffUsers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No staff members found.
              </div>
            ) : (
              staffUsers.map(staff => (
                <div key={staff.id} className="p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h4 className="font-semibold text-lg">{staff.name}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        staff.role === 'Admin'
                          ? 'bg-red-100 text-red-800'
                          : staff.role === 'Principal'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {staff.role}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        staff.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {staff.status || 'active'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Email: {staff.email}</p>
                    {staff.assignedClasses && staff.assignedClasses.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Classes: {staff.assignedClasses.join(', ')}
                      </p>
                    )}
                    {staff.assignedSubjects && staff.assignedSubjects.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Subjects: {staff.assignedSubjects.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {staff.role !== 'Admin' && (
                      <button
                        onClick={() => promoteToAdmin(staff.id)}
                        disabled={loadingStates[staff.id]}
                        className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:bg-gray-400"
                      >
                        {loadingStates[staff.id] ? '...' : 'Make Admin'}
                      </button>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStaffStatus(staff.id)}
                        disabled={loadingStates[staff.id] || staff.id === currentUser.id}
                        className={`px-3 py-1 text-sm rounded ${
                          staff.status === 'active'
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white disabled:bg-gray-400`}
                      >
                        {loadingStates[staff.id] ? '...' : staff.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteStaff(staff.id)}
                        disabled={loadingStates[staff.id] || staff.id === currentUser.id}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
                      >
                        {loadingStates[staff.id] ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Role Statistics - COLLAPSIBLE */}
      <div className="bg-white rounded-lg shadow">
        <button
          onClick={() => toggleSection('statistics')}
          className="w-full p-4 flex justify-between items-center bg-purple-50 hover:bg-purple-100 rounded-t-lg border-b"
        >
          <h3 className="text-lg font-semibold text-purple-800">Role Statistics</h3>
          <span className="text-purple-600 font-bold text-lg">
            {collapsedSections.statistics ? '+' : '-'}
          </span>
        </button>
        
        {!collapsedSections.statistics && (
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg shadow p-4 text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {staffUsers.filter(u => u.role === 'Admin').length}
                </div>
                <div className="text-sm text-gray-600">Admins</div>
              </div>
              <div className="bg-green-50 rounded-lg shadow p-4 text-center border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  {staffUsers.filter(u => ['Principal', 'VP Academic', 'VP Admin'].includes(u.role)).length}
                </div>
                <div className="text-sm text-gray-600">Leadership</div>
              </div>
              <div className="bg-purple-50 rounded-lg shadow p-4 text-center border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">
                  {staffUsers.filter(u => ['Form Master', 'Subject Teacher'].includes(u.role)).length}
                </div>
                <div className="text-sm text-gray-600">Teachers</div>
              </div>
              <div className="bg-orange-50 rounded-lg shadow p-4 text-center border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">
                  {staffUsers.length}
                </div>
                <div className="text-sm text-gray-600">Total Staff</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
