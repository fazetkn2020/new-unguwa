// src/pages/Dashboard/roles/UserManagementPanel.jsx - MODULAR VERSION
import React from "react";
import UserManagementHeader from './components/UserManagement/UserManagementHeader';
import UserManagementTabs from './components/UserManagement/UserManagementTabs';
import AllUsersTab from './components/UserManagement/AllUsersTab';
import PendingApprovalTab from './components/UserManagement/PendingApprovalTab';
import ActiveUsersTab from './components/UserManagement/ActiveUsersTab';
import BulkRegistration from './components/UserManagement/BulkRegistration';
import { useUserManagement } from './components/UserManagement/useUserManagement';

function UserManagementPanel({ users: propUsers, onUsersUpdate }) {
  const {
    users,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    loadingStates,
    setLoading,
    loadUsers,
    deleteUser,
    approveUser,
    approveStudent,
    updateUserRole
  } = useUserManagement(propUsers, onUsersUpdate);

  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
        return (
          <AllUsersTab
            users={users}
            loadingStates={loadingStates}
            onDeleteUser={deleteUser}
            onApproveUser={approveUser}
            onApproveStudent={approveStudent}
            onUpdateRole={updateUserRole}
          />
        );
      case "pending":
        return (
          <PendingApprovalTab
            users={users}
            loadingStates={loadingStates}
            onDeleteUser={deleteUser}
            onApproveUser={approveUser}
            onApproveStudent={approveStudent}
          />
        );
      case "active":
        return (
          <ActiveUsersTab
            users={users}
            loadingStates={loadingStates}
            onDeleteUser={deleteUser}
            onUpdateRole={updateUserRole}
          />
        );
      case "bulk":
        return <BulkRegistration onUsersAdded={loadUsers} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <UserManagementHeader
        users={users}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefresh={loadUsers}
      />

      <UserManagementTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        users={users}
      />

      <div className="mt-4">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default UserManagementPanel;
