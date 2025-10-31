import React from 'react';
import { userFilters } from './userFilters';
import UserSection from './UserSection';

const PendingApprovalTab = ({ users, loadingStates, onDeleteUser, onApproveUser, onApproveStudent }) => {
  const pendingStaff = userFilters.pendingStaff(users);
  const pendingStudents = userFilters.pendingStudents(users);
  const allPendingUsers = userFilters.allPendingUsers(users);

  if (allPendingUsers.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-yellow-200">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-yellow-700">No Pending Approvals</h3>
        <p className="text-yellow-600 mt-2">All users have been approved!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserSection
          title="Pending Staff"
          users={pendingStaff}
          type="pending"
          icon="👨‍💼"
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
      </div>
    </div>
  );
};

export default PendingApprovalTab;
