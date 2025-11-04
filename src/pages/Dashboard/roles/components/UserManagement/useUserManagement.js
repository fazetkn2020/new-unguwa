import { useState, useEffect } from 'react';
import { loadRoleTemplates } from '../../../../../data/functionDefinitions';

export const useUserManagement = (propUsers, onUsersUpdate) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    loadUsers();
  }, [propUsers]);

  const loadUsers = () => {
    if (propUsers && propUsers.length > 0) {
      setUsers(propUsers);
    } else {
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      setUsers(savedUsers);
    }
  };

  const setLoading = (id, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [id]: isLoading }));
  };

  const deleteUser = (userId) => {
    setLoading(userId, true);
    
    setTimeout(() => {
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = savedUsers.filter(user => user.id !== userId);
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      if (onUsersUpdate) {
        onUsersUpdate(updatedUsers);
      }
      
      setLoading(userId, false);
    }, 500);
  };

  const approveUser = (userId, selectedRole) => {
    setLoading(userId, true);
    
    setTimeout(() => {
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = savedUsers.map(user => {
        if (user.id === userId) {
          // Apply role template functions when approving user
          const roleTemplates = loadRoleTemplates();
          const templateFunctions = roleTemplates[selectedRole] || [];
          
          return {
            ...user,
            role: selectedRole,
            functions: templateFunctions,
            status: 'active',
            approvedAt: new Date().toISOString()
          };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      if (onUsersUpdate) {
        onUsersUpdate(updatedUsers);
      }
      
      setLoading(userId, false);
    }, 500);
  };

  const approveStudent = (userId) => {
    setLoading(userId, true);
    
    setTimeout(() => {
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = savedUsers.map(user => {
        if (user.id === userId) {
          // Apply student template functions
          const roleTemplates = loadRoleTemplates();
          const templateFunctions = roleTemplates['Student'] || [];
          
          return {
            ...user,
            role: 'Student',
            functions: templateFunctions,
            status: 'active',
            approvedAt: new Date().toISOString()
          };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      if (onUsersUpdate) {
        onUsersUpdate(updatedUsers);
      }
      
      setLoading(userId, false);
    }, 500);
  };

  const updateUserRole = (userId, newRole) => {
    setLoading(userId, true);
    
    setTimeout(() => {
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = savedUsers.map(user => {
        if (user.id === userId) {
          // Apply role template functions when role changes
          const roleTemplates = loadRoleTemplates();
          const templateFunctions = roleTemplates[newRole] || [];
          
          return {
            ...user,
            role: newRole,
            functions: templateFunctions
          };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      if (onUsersUpdate) {
        onUsersUpdate(updatedUsers);
      }
      
      setLoading(userId, false);
    }, 500);
  };

  const updateUserFunctions = (userId, newFunctions) => {
    setLoading(userId, true);
    
    setTimeout(() => {
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = savedUsers.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            functions: newFunctions
          };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      if (onUsersUpdate) {
        onUsersUpdate(updatedUsers);
      }
      
      setLoading(userId, false);
    }, 500);
  };

  return {
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
    updateUserRole,
    updateUserFunctions
  };
};
