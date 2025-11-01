import React from 'react';
import { userFilters } from './userFilters';

const UserManagementTabs = ({ activeTab, setActiveTab, users }) => {
  const allActiveUsers = userFilters.allActiveUsers(users);
  const allPendingUsers = userFilters.allPendingUsers(users);

  const tabs = [
    { id: "all", label: "All Users", count: users.length, emoji: "👥" },
    { id: "pending", label: "Pending", count: allPendingUsers.length, emoji: "⏳" },
    { id: "active", label: "Active", count: allActiveUsers.length, emoji: "✅" },
    { id: "bulk", label: "Bulk Add", count: null, emoji: "📥" }
  ];

  return (
    <div className="flex overflow-x-auto gap-1 mb-4 pb-2 scrollbar-hide">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap min-w-max transition-all ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="text-base">{tab.emoji}</span>
          <span className="text-sm">{tab.label}</span>
          {tab.count !== null && (
            <span className={`px-2 py-1 rounded-full text-xs font-bold min-w-6 text-center ${
              activeTab === tab.id 
                ? 'bg-white text-blue-600' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default UserManagementTabs;
