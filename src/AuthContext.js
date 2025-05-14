import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on component mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Function to check auth status from localStorage
    const checkAuthStatus = () => {
        const token = localStorage.getItem('authToken');
        const expiration = localStorage.getItem('tokenExpiration');
        const username = localStorage.getItem('username');

        if (token && expiration && new Date().getTime() < parseInt(expiration)) {
            setIsAuthenticated(true);
            setUser({ fullName: username });
        } else {
            // Clear invalid auth data
            logout();
        }
        setLoading(false);
    };

    // Login function to update context state
    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('tokenExpiration');
        setIsAuthenticated(false);
        setUser(null);
    };

    // Auth context value
    const value = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        checkAuthStatus
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};