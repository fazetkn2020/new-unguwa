import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [financeAccessEnabled, setFinanceAccessEnabled] = useState(false);

  // Load auth state and finance access from localStorage
  useEffect(() => {
    console.log('🔄 AuthContext: Loading from localStorage...');
    
    const savedUser = localStorage.getItem('currentUser');
    const savedFinanceAccess = localStorage.getItem('financeAccessEnabled');

    console.log('📁 Saved user from localStorage:', savedUser);
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('✅ AuthContext: User loaded:', userData);
        setUser(userData);
      } catch (error) {
        console.error('❌ AuthContext: Error parsing user data:', error);
        localStorage.removeItem('currentUser');
      }
    } else {
      console.log('ℹ️ AuthContext: No saved user found');
    }

    if (savedFinanceAccess) {
      setFinanceAccessEnabled(JSON.parse(savedFinanceAccess));
    }

    console.log('🏁 AuthContext: Loading complete');
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('🔐 AuthContext: Logging in user:', userData);
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('🚪 AuthContext: Logging out');
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const toggleFinanceAccess = (enabled) => {
    setFinanceAccessEnabled(enabled);
    localStorage.setItem('financeAccessEnabled', JSON.stringify(enabled));
  };

  const value = {
    user,
    login,
    logout,
    loading,
    financeAccessEnabled,
    toggleFinanceAccess
  };

  console.log('🎯 AuthContext: Providing value:', { user, loading });

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
