import React from 'react';
import { userFilters } from './userFilters';

const UserManagementTabs = ({ activeTab, setActiveTab, users }) => {
  const allActiveUsers = userFilters.allActiveUsers(users);
  const allPendingUsers = userFilters.allPendingUsers(users);

  const tabs = [
    { id: "all", label: "All", count: users.length, emoji: "👥" },
    { id: "pending", label: "Pending", count: allPendingUsers.length, emoji: "⏳" },
    { id: "active", label: "Active", count: allActiveUsers.length, emoji: "✅" },
    { id: "bulk", label: "Bulk", count: null, emoji: "📥" }
  ];

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`p-2 rounded-lg transition-all duration-200 border min-h-[60px] ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white border-blue-700 shadow-md'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-400'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-sm">{tab.emoji}</span>
              <span className="font-semibold text-xs whitespace-nowrap">{tab.label}</span>
            </div>
            {tab.count !== null && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {tab.count}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default UserManagementTabs;
