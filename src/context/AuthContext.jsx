// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [user, setUserState] = useState(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
      return null;
    }
  });

  // Set user and persist to localStorage
  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("currentUser", JSON.stringify(userData));
    } else {
      localStorage.removeItem("currentUser");
    }
  };

  // Logout function
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
