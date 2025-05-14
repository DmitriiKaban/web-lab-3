import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import { useAuth } from './AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    // Get the intended destination from the location state or default to books
    const from = location.state?.from?.pathname || '/books';

    // Clear any existing authentication data on mount
    useEffect(() => {
        console.log('Login component mounted');
        // Clear localStorage to start fresh on the login page
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('tokenExpiration');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Attempting login with:', username);
            const response = await fetch('http://localhost:8016/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error('Invalid username or password');
            }

            const data = await response.json();
            console.log('Login successful, received data:', data);

            // Calculate expiration time
            const expiresIn = data.expiresIn || 3600; // Default to 1 hour if not provided
            const expirationTime = new Date().getTime() + expiresIn * 1000;

            // Store token and user info in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.fullName);
            localStorage.setItem('tokenExpiration', expirationTime);

            console.log('Login - Token:', data.token);
            console.log('Login - Full Name:', data.fullName);
            console.log('Login - Token expires at:', new Date(expirationTime).toLocaleString());

            // Update the AuthContext state
            login({
                token: data.token,
                fullName: data.fullName
            });

            console.log('Login - AuthContext updated, redirecting to', from);
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <h2>Book Collection Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;