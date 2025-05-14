import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import BookCollection from './BookCollection';

localStorage.clear();

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/books" element={<BookCollection />} />
                    </Route>

                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/books" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;