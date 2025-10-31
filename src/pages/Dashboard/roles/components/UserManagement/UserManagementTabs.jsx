import React from 'react';
import { userFilters } from './userFilters';

const UserManagementTabs = ({ activeTab, setActiveTab, users }) => {
  const allActiveUsers = userFilters.allActiveUsers(users);
  const allPendingUsers = userFilters.allPendingUsers(users);

  return (
    <div className="flex border-b border-gray-300 mb-6 overflow-x-auto">
      <button
        onClick={() => setActiveTab("all")}
        className={`px-4 py-2 font-medium whitespace-nowrap ${
          activeTab === "all"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        All Users ({users.length})
      </button>
      <button
        onClick={() => setActiveTab("pending")}
        className={`px-4 py-2 font-medium whitespace-nowrap ${
          activeTab === "pending"
            ? "border-b-2 border-yellow-500 text-yellow-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Pending Approval ({allPendingUsers.length})
      </button>
      <button
        onClick={() => setActiveTab("active")}
        className={`px-4 py-2 font-medium whitespace-nowrap ${
          activeTab === "active"
            ? "border-b-2 border-green-500 text-green-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Active Users ({allActiveUsers.length})
      </button>
    </div>
  );
};

export default UserManagementTabs;
