import React from 'react';
import { userFilters } from './userFilters';
import UserSection from './UserSection';

const ActiveUsersTab = ({ users, loadingStates, onDeleteUser }) => {
  const activeStaff = userFilters.activeStaff(users);
  const activeStudents = userFilters.activeStudents(users);
  const allActiveUsers = userFilters.allActiveUsers(users);

  if (allActiveUsers.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-green-200">
        <div className="text-4xl mb-4">👥</div>
        <h3 className="text-xl font-semibold text-green-700">No Active Users</h3>
        <p className="text-green-600 mt-2">No users have been approved yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserSection
          title="Active Staff"
          users={activeStaff}
          type="active"
          icon="👨‍🏫"
          bgColor="bg-green-50"
          borderColor="border-green-200"
          textColor="text-green-800"
          loadingStates={loadingStates}
          onDelete={onDeleteUser}
        />

        <UserSection
          title="Active Students"
          users={activeStudents}
          type="active"
          icon="🎒"
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
          textColor="text-blue-800"
          loadingStates={loadingStates}
          onDelete={onDeleteUser}
        />
      </div>
    </div>
  );
};

export default ActiveUsersTab;
