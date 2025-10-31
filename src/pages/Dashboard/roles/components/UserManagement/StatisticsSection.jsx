import React, { useState } from 'react';
import { userFilters } from './userFilters';

const StatisticsSection = ({ users }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const allActiveUsers = userFilters.allActiveUsers(users);
  const allPendingUsers = userFilters.allPendingUsers(users);
  const activeStaff = userFilters.activeStaff(users);

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full p-4 flex justify-between items-center hover:bg-blue-100 rounded-t-lg"
      >
        <h4 className="text-lg font-semibold text-blue-800">
          📊 Statistics ({users.length} users)
        </h4>
        <span className="text-blue-600 font-bold text-xl">
          {isCollapsed ? "+" : "-"}
        </span>
      </button>
      {!isCollapsed && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-blue-800">Total Users</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{allActiveUsers.length}</div>
              <div className="text-sm text-green-800">Active Users</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{allPendingUsers.length}</div>
              <div className="text-sm text-yellow-800">Pending Approval</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{activeStaff.length}</div>
              <div className="text-sm text-purple-800">Active Staff</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsSection;
