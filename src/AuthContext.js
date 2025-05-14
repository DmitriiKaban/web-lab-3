import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on component mount and set up token monitoring
    useEffect(() => {
        checkAuthStatus();

        // Set up interval to check token expiration every minute
        const tokenCheckInterval = setInterval(() => {
            checkTokenExpiration();
        }, 60000); // Check every minute

        return () => clearInterval(tokenCheckInterval);
    }, []);

    // Function to check if token is expired
    const isTokenExpired = () => {
        const expiration = localStorage.getItem('tokenExpiration');
        return !expiration || new Date().getTime() >= parseInt(expiration);
    };

    // Function to check token expiration and logout if expired
    const checkTokenExpiration = () => {
        if (isTokenExpired()) {
            console.log('Token expired, logging out');
            logout();

            // Don't redirect if already on login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
    };

    // Function to check auth status from localStorage
    const checkAuthStatus = () => {
        console.log('Checking auth status');
        const token = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');
        const expiration = localStorage.getItem('tokenExpiration');

        console.log('Token exists:', !!token);
        console.log('Token expiration:', expiration ? new Date(parseInt(expiration)).toLocaleString() : 'none');
        console.log('Token expired:', isTokenExpired());

        if (token && !isTokenExpired() && username) {
            console.log('Valid authentication found');
            setIsAuthenticated(true);
            setUser({ fullName: username });
        } else {
            console.log('No valid authentication found');
            // Clear invalid auth data
            clearAuthData();
            setIsAuthenticated(false);
            setUser(null);
        }
        setLoading(false);
    };

    // Helper to clear auth data without setting state
    const clearAuthData = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('tokenExpiration');
    };

    // Login function to update context state
    const login = (userData) => {
        console.log('Login called in AuthContext:', userData);
        setIsAuthenticated(true);
        setUser(userData);
    };

    // Logout function
    const logout = () => {
        console.log('Logging out');
        clearAuthData();
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
        checkAuthStatus,
        isTokenExpired,
        // Add a convenient method to check and handle expiration
        checkAndHandleExpiration: () => {
            if (isTokenExpired()) {
                console.log('Token expired in checkAndHandleExpiration');
                logout();
                return false;
            }
            return true;
        }
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};