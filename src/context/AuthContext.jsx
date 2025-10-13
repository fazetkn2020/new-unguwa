// src/context/AuthContext.jsx (The file that needs correcting)

import React, { createContext, useContext, useState, useEffect } from 'react';

// Initialize context with null user and dummy functions
const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
});

// Hook for components to use
export const useAuth = () => useContext(AuthContext);

// ----------------------------------------------------
// THE PROVIDER COMPONENT
// ----------------------------------------------------

export const AuthProvider = ({ children }) => {
    // 🌟 1. INITIALIZE STATE: Try to load the user immediately on context creation.
    // If localStorage has 'currentUser', start with that; otherwise, start with null.
    const [user, setUserState] = useState(() => {
        try {
            const savedUser = localStorage.getItem("currentUser");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Failed to load user from localStorage:", error);
            return null;
        }
    });

    // 2. CREATE WRAPPER FUNCTION for saving user and updating state
    const setUser = (userData) => {
        setUserState(userData);
        if (userData) {
            // Save user data to Local Storage
            localStorage.setItem("currentUser", JSON.stringify(userData));
        } else {
            // Remove user data on set null
            localStorage.removeItem("currentUser");
        }
    };

    // 3. LOGOUT FUNCTION
    const logout = () => {
        // Clear state and storage
        setUser(null);
    };

    // 🌟 REMOVE THE INITIAL useEffect that attempts to load user.
    // The useState initializer (Step 1) handles the initial load seamlessly.
    
    // We can use an effect to handle storage updates if needed, 
    // but the setUser function handles persistence now.
    
    // If you prefer the useEffect method, use this instead of the useState initializer:
    /*
    const [user, setUserState] = useState(null);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("currentUser");
            if (savedUser) {
                setUserState(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Failed to load user from localStorage:", error);
        }
    }, []); 
    */


    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
