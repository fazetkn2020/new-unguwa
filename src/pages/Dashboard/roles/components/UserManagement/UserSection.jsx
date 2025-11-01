import React, { useState } from 'react';
import UserCard from './UserCard';

const UserSection = ({
  title,
  users,
  type,
  icon,
  bgColor,
  borderColor,
  textColor,
  loadingStates,
  onApprove,
  onDelete,
  onUpdateRole
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Start expanded

  if (users.length === 0) return null;

  return (
    <div className={`${bgColor} rounded-lg border ${borderColor} overflow-hidden mb-4 shadow-sm`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`w-full p-4 flex justify-between items-center hover:bg-opacity-80 transition-all rounded-t-lg ${bgColor} cursor-pointer border-0`}
      >
        <h4 className={`text-lg font-semibold ${textColor}`}>
          {icon} {title} ({users.length})
        </h4>
        <span className={`${textColor} font-bold text-lg transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
          ▼
        </span>
      </button>
      
      {!isCollapsed && (
        <div className={`p-4 border-t ${borderColor}`}>
          <div className="grid gap-3">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                type={type}
                onApprove={onApprove}
                onDelete={onDelete}
                onUpdateRole={onUpdateRole}
                loadingStates={loadingStates}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSection;
