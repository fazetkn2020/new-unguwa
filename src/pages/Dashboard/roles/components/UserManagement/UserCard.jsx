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
  const [isExpanded, setIsExpanded] = useState(false);

  const isStaffUser = !user.formClass && !user.class && !user.studentId;

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

  const showEditActions = isActive && isStaffUser && user.role !== 'Student' && user.role !== 'pending';

  // Mobile-first small button
  const baseButtonStyle = "w-full px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={`bg-white border-b border-gray-200 transition-all duration-300 ${isExpanded ? 'shadow-md bg-gray-50' : 'hover:bg-gray-50'}`}>
      
      {/* Header: Name + Expand/Collapse */}
      <div 
        className="flex items-center justify-between p-3 sm:p-4 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-medium text-xs sm:text-sm border border-gray-300 flex-shrink-0">
            {(user.fullName || user.name).charAt(0).toUpperCase()}
          </div>
          <h4 className="font-medium text-gray-800 text-sm break-words">
            {user.fullName || user.name}
          </h4>
        </div>

        {/* Expand/Collapse - Always fits */}
        <span className="text-gray-500 hover:text-gray-700 text-xs font-medium whitespace-nowrap ml-2">
          {isExpanded ? '▲ Collapse' : '▼ Expand'}
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-0 space-y-4">
          
          {/* User Info */}
          <div className="text-xs sm:text-sm space-y-1 text-gray-700">
            <p><strong>Role:</strong> <span className="font-semibold text-blue-600">{user.role || 'N/A'}</span></p>
            <p><strong>Email:</strong> <span className="break-all">{user.email || 'N/A'}</span></p>
            {user.studentId && <p><strong>Student ID:</strong> {user.studentId}</p>}
            {user.class && <p><strong>Class:</strong> {user.class}</p>}
            {isPending && (
              <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium mt-1">
                Pending Approval
              </span>
            )}
          </div>
          
          {/* Action Grid: 2 cols mobile, 4 cols desktop */}
          <div className="grid grid-cols-2 gap-2">
            
            {isPending ? (
              <>
                {isStaffUser && (
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="col-span-2 border border-gray-300 rounded-md p-2 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Role</option>
                    {allRoles.filter(r => r !== 'Student').map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                )}
                <button
                  onClick={handleApprove}
                  disabled={loadingStates[user.id] || (isStaffUser && !selectedRole)}
                  className={`${baseButtonStyle} ${loadingStates[user.id] ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  {loadingStates[user.id] ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loadingStates[user.id]}
                  className={`${baseButtonStyle} ${loadingStates[user.id] ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white`}
                >
                  {loadingStates[user.id] ? "Deleting..." : "Reject"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  className={`${baseButtonStyle} bg-red-600 hover:bg-red-700 text-white`}
                >
                  Remove
                </button>
                
                {showEditActions && (
                  <>
                    <button
                      onClick={() => { setIsEditingRole(true); setIsEditingFunctions(false); }}
                      className={`${baseButtonStyle} bg-blue-600 hover:bg-blue-700 text-white`}
                    >
                      Change Role
                    </button>
                    <button
                      onClick={() => { setIsEditingFunctions(true); setIsEditingRole(false); }}
                      className={`${baseButtonStyle} bg-indigo-600 hover:bg-indigo-700 text-white`}
                    >
                      Edit Functions
                    </button>
                    <div className="col-span-1"></div> {/* Invisible spacer to force 2x2 */}
                  </>
                )}
              </>
            )}
          </div>

          {/* Edit Panels */}
          {(isEditingRole || isEditingFunctions) && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              
              {isEditingRole && (
                <div className="space-y-3">
                  <h5 className="font-semibold text-blue-700 text-xs sm:text-sm border-b pb-1">Update Role</h5>
                  <select
                    value={editedRole}
                    onChange={(e) => applyRoleTemplate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-xs sm:text-sm bg-white focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    {allRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleRoleUpdate}
                      disabled={!editedRole || editedRole === user.role}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {isEditingFunctions && (
                <div className="space-y-3">
                  <h5 className="font-semibold text-indigo-700 text-xs sm:text-sm border-b pb-1">Permissions</h5>
                  <div className="max-h-40 overflow-y-auto p-2 bg-white rounded border space-y-1">
                    {Object.entries(FUNCTION_DEFINITIONS).map(([key, func]) => (
                      <label key={key} className="flex items-center space-x-2 text-xs p-1 hover:bg-indigo-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editedFunctions.includes(key)}
                          onChange={() => toggleFunction(key)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3 w-3"
                        />
                        <span className="break-words">{func.name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleFunctionsUpdate}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
        </div>
      )}
    </div>
  );
};

export default UserCard;
