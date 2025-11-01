import React, { useState } from 'react';

const UserCard = ({ user, type, onApprove, onDelete, loadingStates, onUpdateRole }) => {
  const isPending = type === 'pending';
  const isActive = type === 'active' || type === 'all';
  const [selectedRole, setSelectedRole] = useState('');
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [editedRole, setEditedRole] = useState(user.role || '');
  
  // Staff detection: users without class/formClass/studentId
  const isStaffUser = !user.formClass && !user.class && !user.studentId;
  
  // The 5 leadership roles admin can assign
  const leadershipRoles = [
    'Principal',
    'VP Academic', 
    'VP Admin',
    'Senior Master',
    'Exam Officer'
  ];

  // All roles that can be selected (leadership + Teacher)
  const allSelectableRoles = [...leadershipRoles, 'Teacher'];

  const handleApprove = () => {
    onApprove(user.id, selectedRole);
  };

  const handleDelete = () => {
    onDelete(user.id);
  };

  const handleRoleUpdate = () => {
    if (editedRole && editedRole !== user.role) {
      onUpdateRole(user.id, editedRole);
      setIsEditingRole(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedRole(user.role);
    setIsEditingRole(false);
  };

  // Show edit button for ALL active staff users (any role except Student/pending)
  const showEditButton = isActive && isStaffUser && user.role !== 'Student' && user.role !== 'pending';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">
            {user.fullName || user.name}
          </h4>
          <div className="text-sm text-gray-600 mt-1">
            {user.email && <div>📧 {user.email}</div>}
            {user.studentId && <div>🎫 ID: {user.studentId}</div>}
            {user.class && <div>🏫 Class: {user.class}</div>}

            {isEditingRole ? (
              <div className="flex items-center gap-2 mt-2">
                <select
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value)}
                  className="border border-gray-300 rounded p-1 text-sm"
                >
                  {allSelectableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <button
                  onClick={handleRoleUpdate}
                  className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                >
                  ✅ Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                >
                  ❌ Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div>👤 Role: {user.role}</div>
                {showEditButton && (
                  <button
                    onClick={() => setIsEditingRole(true)}
                    className="text-blue-600 hover:text-blue-800 text-xs underline ml-2"
                  >
                    ✏️ Edit Role
                  </button>
                )}
              </div>
            )}

            {user.status && <div>📊 Status: {user.status}</div>}
            {user.approvedAt && (
              <div className="text-xs text-gray-500 mt-1">
                Approved: {new Date(user.approvedAt).toLocaleDateString()}
              </div>
            )}
            {user.registeredAt && !user.approvedAt && (
              <div className="text-xs text-gray-500 mt-1">
                Registered: {new Date(user.registeredAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          {isPending ? (
            <>
              {isStaffUser && (
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="border border-gray-300 rounded p-2 text-sm mb-2"
                >
                  <option value="">Approve as Teacher</option>
                  {leadershipRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              )}

              <button
                onClick={handleApprove}
                disabled={loadingStates[user.id]}
                className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400 min-w-20"
              >
                {loadingStates[user.id] ? "⏳" : "✅"} Approve
              </button>
              <button
                onClick={handleDelete}
                disabled={loadingStates[user.id]}
                className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 disabled:bg-gray-400 min-w-20"
                >
                {loadingStates[user.id] ? "⏳" : "❌"} Delete
              </button>
            </>
          ) : (
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 min-w-20"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {isPending && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
            ⏳ Pending Approval
          </span>
          {isStaffUser && (
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs ml-2">
              {selectedRole ? `Will assign as: ${selectedRole}` : 'Will assign as: Teacher'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;
