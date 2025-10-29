import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      if (!savedUser) return null;
      
      const userData = JSON.parse(savedUser);
      // FIX: Normalize role to Title Case
      if (userData.role) {
        userData.role = userData.role === 'admin' ? 'Admin' : 
                       userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
      }
      return userData;
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // FIX: Consistent role checking
    setIsAdmin(user?.role === "Admin");
  }, [user]);

  const setUser = (userData) => {
    // FIX: Normalize role when setting new user
    if (userData && userData.role) {
      userData.role = userData.role === 'admin' ? 'Admin' : 
                     userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
    }
    
    setUserState(userData);
    if (userData) {
      localStorage.setItem("currentUser", JSON.stringify(userData));
    } else {
      localStorage.removeItem("currentUser");
    }
  };

  const logout = () => {
    setUserState(null);
    setIsAdmin(false);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};