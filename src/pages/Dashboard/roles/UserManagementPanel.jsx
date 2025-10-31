// src/pages/Dashboard/roles/UserManagementPanel.jsx - MODULAR VERSION
import React from "react";
import UserManagementHeader from './components/UserManagement/UserManagementHeader';
import UserManagementTabs from './components/UserManagement/UserManagementTabs';
import AllUsersTab from './components/UserManagement/AllUsersTab';
import PendingApprovalTab from './components/UserManagement/PendingApprovalTab';
import ActiveUsersTab from './components/UserManagement/ActiveUsersTab';
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
    approveStudent
  } = useUserManagement(propUsers, onUsersUpdate);

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

      {/* Render Active Tab */}
      {activeTab === "all" && (
        <AllUsersTab 
          users={users}
          loadingStates={loadingStates}
          onDeleteUser={deleteUser}
          onApproveUser={approveUser}
          onApproveStudent={approveStudent}
        />
      )}

      {activeTab === "pending" && (
        <PendingApprovalTab 
          users={users}
          loadingStates={loadingStates}
          onDeleteUser={deleteUser}
          onApproveUser={approveUser}
          onApproveStudent={approveStudent}
        />
      )}

      {activeTab === "active" && (
        <ActiveUsersTab 
          users={users}
          loadingStates={loadingStates}
          onDeleteUser={deleteUser}
        />
      )}
    </div>
  );
}

export default UserManagementPanel;
