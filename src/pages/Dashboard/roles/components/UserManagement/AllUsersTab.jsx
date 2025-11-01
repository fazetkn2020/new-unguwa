import React from 'react';
import { userFilters } from './userFilters';
import UserSection from './UserSection';

const AllUsersTab = ({ users, loadingStates, onDeleteUser, onApproveUser, onApproveStudent, onUpdateRole }) => {
  const allStaff = userFilters.allStaff(users);
  const allStudents = userFilters.allStudents(users);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserSection
          title="All Staff"
          users={allStaff}
          type="all"
          icon="👨‍🏫"
          bgColor="bg-purple-50"
          borderColor="border-purple-200"
          textColor="text-purple-800"
          loadingStates={loadingStates}
          onApprove={onApproveUser}
          onDelete={onDeleteUser}
          onUpdateRole={onUpdateRole}
        />

        <UserSection
          title="All Students"
          users={allStudents}
          type="all"
          icon="🎒"
          bgColor="bg-indigo-50"
          borderColor="border-indigo-200"
          textColor="text-indigo-800"
          loadingStates={loadingStates}
          onApprove={onApproveStudent}
          onDelete={onDeleteUser}
        />
      </div>
    </div>
  );
};

export default AllUsersTab;
