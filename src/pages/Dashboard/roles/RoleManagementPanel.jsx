import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ClassManagementSection from './sections/ClassManagementSection';
import RoleAssignmentSection from './sections/RoleAssignmentSection';
import StaffListSection from './sections/StaffListSection';
import StatisticsSection from './sections/StatisticsSection';

export default function RoleManagementPanel({ users: propUsers, onUsersUpdate }) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [existingClasses, setExistingClasses] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [formMasterAssignment, setFormMasterAssignment] = useState({ 
    userId: null, show: false, userName: '' 
  });

  useEffect(() => {
    loadUsers();
    loadExistingClasses();
  }, [propUsers]);

  const loadUsers = () => {
    if (propUsers && propUsers.length > 0) {
      const staffUsers = propUsers.filter(u => u.role !== 'Student' && u.role !== 'pending');
      setUsers(staffUsers);
    } else {
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const staffUsers = savedUsers.filter(u => u.role !== 'Student' && u.role !== 'pending');
      setUsers(staffUsers);
    }
  };

  const loadExistingClasses = () => {
    const classesData = JSON.parse(localStorage.getItem('schoolClasses')) || [];
    setExistingClasses(classesData);
  };

  const setLoading = (id, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [id]: isLoading }));
  };

  const refreshData = () => {
    loadUsers();
    loadExistingClasses();
  };

  const staffUsers = users.filter(u => u && u.role && u.role !== 'Student') || [];

  return (
    <div className="space-y-4 p-4">
      <ClassManagementSection
        existingClasses={existingClasses}
        setExistingClasses={setExistingClasses}
      />

      <RoleAssignmentSection
        users={staffUsers}
        existingClasses={existingClasses}
        formMasterAssignment={formMasterAssignment}
        setFormMasterAssignment={setFormMasterAssignment}
        loadingStates={loadingStates}
        setLoading={setLoading}
        refreshData={refreshData}
        onUsersUpdate={onUsersUpdate}
      />

      <StaffListSection
        users={staffUsers}
        currentUser={currentUser}
        loadingStates={loadingStates}
        setLoading={setLoading}
        refreshData={refreshData}
        onUsersUpdate={onUsersUpdate}
        setFormMasterAssignment={setFormMasterAssignment}
      />

      <StatisticsSection users={staffUsers} />
    </div>
  );
}