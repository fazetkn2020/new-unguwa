import React from 'react';
import { userFilters } from './userFilters';

const UserManagementHeader = ({ users, searchTerm, setSearchTerm, onRefresh }) => {
  const allActiveUsers = userFilters.allActiveUsers(users);
  const allPendingUsers = userFilters.allPendingUsers(users);

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
      <div>
        <h3 className="text-xl sm:text-2xl font-semibold text-blue-800">
          User Management
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Total: {users.length} users | Active: {allActiveUsers.length} | Pending: {allPendingUsers.length}
        </p>
      </div>
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl bg-gray-100 border border-gray-300"
          />
          <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default UserManagementHeader;
