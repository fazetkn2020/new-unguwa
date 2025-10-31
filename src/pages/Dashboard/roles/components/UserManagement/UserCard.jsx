import React from 'react';

const UserCard = ({ user, type, onApprove, onDelete, loadingStates }) => {
  const isPending = type === 'pending';
  
  const handleApprove = () => {
    console.log("UserCard: Approving user", user.id); // DEBUG
    onApprove(user.id);
  };

  const handleDelete = () => {
    console.log("UserCard: Deleting user", user.id); // DEBUG
    onDelete(user.id);
  };

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
            {user.role && <div>👤 Role: {user.role}</div>}
            {user.status && <div>📊 Status: {user.status}</div>}
            {user.registeredAt && (
              <div className="text-xs text-gray-500 mt-1">
                Registered: {new Date(user.registeredAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          {isPending ? (
            <>
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
        </div>
      )}
    </div>
  );
};

export default UserCard;
