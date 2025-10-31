import React from 'react';
import { userFilters } from './userFilters';
import StatisticsSection from './StatisticsSection';
import UserSection from './UserSection';

const AllUsersTab = ({ users, loadingStates, onDeleteUser, onApproveUser, onApproveStudent }) => {
  const pendingStaff = userFilters.pendingStaff(users);
  const pendingStudents = userFilters.pendingStudents(users);
  const activeStaff = userFilters.activeStaff(users);
  const activeStudents = userFilters.activeStudents(users);

  return (
    <div className="space-y-6">
      <StatisticsSection users={users} />

      <UserSection
        title="Pending Staff"
        users={pendingStaff}
        type="pending"
        icon="⏳"
        bgColor="bg-yellow-50"
        borderColor="border-yellow-200"
        textColor="text-yellow-800"
        loadingStates={loadingStates}
        onApprove={onApproveUser}
        onDelete={onDeleteUser}
      />

      <UserSection
        title="Pending Students"
        users={pendingStudents}
        type="pending"
        icon="🎓"
        bgColor="bg-orange-50"
        borderColor="border-orange-200"
        textColor="text-orange-800"
        loadingStates={loadingStates}
        onApprove={onApproveStudent}
        onDelete={onDeleteUser}
      />

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

      {users.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-700">No Users Found</h3>
          <p className="text-gray-500 mt-2">There are no users in the system yet.</p>
        </div>
      )}
    </div>
  );
};

export default AllUsersTab;
