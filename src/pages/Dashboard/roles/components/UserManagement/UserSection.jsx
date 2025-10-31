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
  onDelete
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (users.length === 0) return null;

  return (
    <div className={`${bgColor} rounded-lg border ${borderColor} overflow-hidden`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`w-full p-4 flex justify-between items-center hover:opacity-90 rounded-t-lg ${bgColor}`}
      >
        <h4 className={`text-lg font-semibold ${textColor}`}>
          {icon} {title} ({users.length})
        </h4>
        <span className={`${textColor} font-bold text-xl`}>
          {isCollapsed ? "+" : "-"}
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
