import React from 'react';

export default function StaffListSection({
  users,
  currentUser,
  loadingStates,
  setLoading,
  refreshData,
  onUsersUpdate,
  setFormMasterAssignment
}) {
  const deleteStaff = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;

    setLoading(userId, true);
    const staffToDelete = users.find(u => u.id === userId);
    
    if (staffToDelete.id === currentUser.id) {
      alert('You cannot delete your own account!');
      setLoading(userId, false);
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = allUsers.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    refreshData();
    if (onUsersUpdate) onUsersUpdate(updatedUsers);
    alert(`✅ ${staffToDelete.name} deleted successfully!`);
    setLoading(userId, false);
  };

  const toggleStaffStatus = async (userId) => {
    setLoading(userId, true);
    const staffToUpdate = users.find(u => u.id === userId);
    
    if (staffToUpdate.id === currentUser.id) {
      alert('You cannot deactivate your own account!');
      setLoading(userId, false);
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const newStatus = staffToUpdate.status === 'active' ? 'inactive' : 'active';
    
    const updatedUsers = allUsers.map(u =>
      u.id === userId ? { ...u, status: newStatus } : u
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    refreshData();
    if (onUsersUpdate) onUsersUpdate(updatedUsers);
    
    alert(`✅ ${staffToUpdate.name} ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
    setLoading(userId, false);
  };

  const promoteToAdmin = async (userId) => {
    setLoading(userId, true);
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = allUsers.map(u =>
      u.id === userId ? { ...u, role: 'Admin' } : u
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    refreshData();
    if (onUsersUpdate) onUsersUpdate(updatedUsers);
    
    const userToPromote = users.find(u => u.id === userId);
    alert(`✅ ${userToPromote.name} promoted to Admin!`);
    setLoading(userId, false);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b bg-green-50 rounded-t-lg">
        <div>
          <h3 className="text-lg font-semibold text-green-800">Staff Members</h3>
          <p className="text-sm text-gray-600">{users.length} staff members</p>
        </div>
      </div>
      
      <div className="divide-y">
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No staff members found.</div>
        ) : (
          users.map(staff => (
            <div key={staff.id} className="p-4 flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h4 className="font-semibold text-lg">{staff.name}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    staff.role === 'Admin' ? 'bg-red-100 text-red-800' :
                    staff.role === 'Principal' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {staff.role}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {staff.status || 'active'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Email: {staff.email}</p>
                {staff.assignedClasses?.length > 0 && (
                  <p className="text-xs text-gray-500">Classes: {staff.assignedClasses.join(', ')}</p>
                )}
                {staff.assignedSubjects?.length > 0 && (
                  <p className="text-xs text-gray-500">Subjects: {staff.assignedSubjects.join(', ')}</p>
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
                      staff.status === 'active' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
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
    </div>
  );
}