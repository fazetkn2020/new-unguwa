// src/context/AuthContext.jsx - UPDATED
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
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if current user is admin
    setIsAdmin(user?.role === "admin");
  }, [user]);

  const setUser = (userData) => {
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