import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [financeAccessEnabled, setFinanceAccessEnabled] = useState(false);

  // Load auth state and finance access from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedFinanceAccess = localStorage.getItem('financeAccessEnabled');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedFinanceAccess) {
      setFinanceAccessEnabled(JSON.parse(savedFinanceAccess));
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const toggleFinanceAccess = (enabled) => {
    setFinanceAccessEnabled(enabled);
    localStorage.setItem('financeAccessEnabled', JSON.stringify(enabled));
  };

  const value = {
    user,
    login, // This is what Login component expects
    logout,
    loading,
    financeAccessEnabled,
    toggleFinanceAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
