// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage on initial load
    useEffect(() => {
        try {
            const savedUser = JSON.parse(localStorage.getItem("currentUser"));
            if (savedUser) setUser(savedUser);
        } catch (error) {
            console.error("Error parsing currentUser from localStorage:", error);
            localStorage.removeItem("currentUser"); // Clear potentially corrupt data
        }
    }, []);

    // Save user to localStorage whenever 'user' state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
        } else {
            localStorage.removeItem("currentUser");
        }
    }, [user]);

    const logout = () => {
        setUser(null);
        localStorage.removeItem("currentUser");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
