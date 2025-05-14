import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading, isTokenExpired } = useAuth();
    const navigate = useNavigate();

    // Check token expiration on component mount and navigation
    useEffect(() => {
        // If token is expired but still marked as authenticated, logout and redirect
        if (isAuthenticated && isTokenExpired()) {
            console.log('Token expired in protected route');
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, isTokenExpired, navigate]);

    if (loading) {
        return <div className="loading-spinner">Checking authentication...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;