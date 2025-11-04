import React, { useState } from 'react';
import { FUNCTION_DEFINITIONS, loadRoleTemplates } from '../../../../../data/functionDefinitions';

const UserCard = ({ user, type, onApprove, onDelete, loadingStates, onUpdateRole, onUpdateFunctions }) => {
  const isPending = type === 'pending';
  const isActive = type === 'active' || type === 'all';
  const [selectedRole, setSelectedRole] = useState('');
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [editedRole, setEditedRole] = useState(user.role || '');
  const [isEditingFunctions, setIsEditingFunctions] = useState(false);
  const [editedFunctions, setEditedFunctions] = useState(user.functions || []);

  // Staff detection: users without class/formClass/studentId
  const isStaffUser = !user.formClass && !user.class && !user.studentId;

  // All available roles
  const allRoles = [
    'Principal',
    'VP Academic', 
    'VP Admin',
    'Senior Master',
    'Exam Officer',
    'Form Master',
    'Subject Teacher',
    'Student'
  ];

  const handleApprove = () => {
    onApprove(user.id, selectedRole);
  };

  const handleDelete = () => {
    onDelete(user.id);
  };

  const handleRoleUpdate = () => {
    if (editedRole && editedRole !== user.role) {
      // Apply role template functions when role changes
      const roleTemplates = loadRoleTemplates();
      const templateFunctions = roleTemplates[editedRole] || [];
      
      onUpdateRole(user.id, editedRole);
      onUpdateFunctions(user.id, templateFunctions);
      setIsEditingRole(false);
    }
  };

  const handleFunctionsUpdate = () => {
    onUpdateFunctions(user.id, editedFunctions);
    setIsEditingFunctions(false);
  };

  const toggleFunction = (functionKey) => {
    const newFunctions = editedFunctions.includes(functionKey)
      ? editedFunctions.filter(f => f !== functionKey)
      : [...editedFunctions, functionKey];
    setEditedFunctions(newFunctions);
  };

  const applyRoleTemplate = (role) => {
    const roleTemplates = loadRoleTemplates();
    const templateFunctions = roleTemplates[role] || [];
    setEditedFunctions(templateFunctions);
    setEditedRole(role);
  };

  const handleCancelEdit = () => {
    setEditedRole(user.role);
    setEditedFunctions(user.functions || []);
    setIsEditingRole(false);
    setIsEditingFunctions(false);
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

            {/* Role Editing */}
            {isEditingRole ? (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <select
                    value={editedRole}
                    onChange={(e) => applyRoleTemplate(e.target.value)}
                    className="border border-gray-300 rounded p-1 text-sm"
                  >
                    <option value="">Select Role</option>
                    {allRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleRoleUpdate}
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                  >
                    ✅ Save Role
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                  >
                    ❌ Cancel
                  </button>
                </div>
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

            {/* Functions Display */}
            {!isEditingRole && !isEditingFunctions && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <span>🎯 Functions: {user.functions?.length || 0}</span>
                  {showEditButton && (
                    <button
                      onClick={() => setIsEditingFunctions(true)}
                      className="text-blue-600 hover:text-blue-800 text-xs underline"
                    >
                      ✨ Edit Functions
                    </button>
                  )}
                </div>
                {user.functions?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.functions.slice(0, 3).map(funcKey => (
                      <span key={funcKey} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {FUNCTION_DEFINITIONS[funcKey]?.name || funcKey}
                      </span>
                    ))}
                    {user.functions.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        +{user.functions.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Functions Editing */}
            {isEditingFunctions && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Select Functions:</h5>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {Object.entries(FUNCTION_DEFINITIONS).map(([key, func]) => (
                    <label key={key} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editedFunctions.includes(key)}
                        onChange={() => toggleFunction(key)}
                        className="rounded"
                      />
                      <span>{func.name}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleFunctionsUpdate}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    💾 Save Functions
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    ❌ Cancel
                  </button>
                </div>
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
                  {allRoles.filter(role => role !== 'Student').map(role => (
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
