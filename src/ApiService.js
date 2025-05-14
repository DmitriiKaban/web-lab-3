// ApiService.js
const API_BASE_URL = 'http://localhost:8016';

const getHeaders = () => {
    // Check token expiration before using it
    if (isTokenExpired()) {
        // Handle expired token
        handleExpiredToken();
        // Still return basic headers for the current request
        return {
            'Content-Type': 'application/json'
        };
    }

    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// Function to check if token is expired
const isTokenExpired = () => {
    const expiration = localStorage.getItem('tokenExpiration');
    return !expiration || new Date().getTime() >= parseInt(expiration);
};

// Handle expired token
const handleExpiredToken = () => {
    console.log('Token expired, clearing authentication data');
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('tokenExpiration');

    // Redirect to login only if we're not already on the login page
    if (!window.location.pathname.includes('/login')) {
        console.log('Redirecting to login page due to expired token');
        window.location.href = '/login';
    }
};

const handleResponse = async (response) => {
    if (!response.ok) {
        // If response is 401 Unauthorized, clear local storage and force reload
        if (response.status === 401) {
            handleExpiredToken();
            throw new Error('Authentication expired. Please log in again.');
        } else if (response.status === 403) {
            throw new Error('Access denied. You must be an admin to perform this action.');
        }

        const error = await response.json().catch(() => ({
            message: 'An unknown error occurred'
        }));
        throw new Error(error.message || `API error: ${response.status}`);
    }

    return response.json();
};

const apiService = {
    auth: {
        login: async (credentials) => {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            return handleResponse(response);
        }
    },
    books: {
        getAll: async (page = 0, size = 30) => {
            // Check token before making request
            if (isTokenExpired()) {
                handleExpiredToken();
                throw new Error('Authentication expired. Please log in again.');
            }

            const response = await fetch(`${API_BASE_URL}/books?page=${page}&size=${size}`, {
                headers: getHeaders()
            });
            return handleResponse(response);
        },
        get: async (id) => {
            // Check token before making request
            if (isTokenExpired()) {
                handleExpiredToken();
                throw new Error('Authentication expired. Please log in again.');
            }

            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                headers: getHeaders()
            });
            return handleResponse(response);
        },
        add: async (book) => {
            // Check token before making request
            if (isTokenExpired()) {
                handleExpiredToken();
                throw new Error('Authentication expired. Please log in again.');
            }

            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({book})
            });
            return handleResponse(response);
        },
        update: async (book) => {
            // Debug: Log the book object
            console.log('Updating book:', book);

            // Check token before making request
            if (isTokenExpired()) {
                handleExpiredToken();
                throw new Error('Authentication expired. Please log in again.');
            }

            try {
                const response = await fetch(`${API_BASE_URL}/books`, {
                    method: 'PATCH',
                    headers: getHeaders(),
                    body: JSON.stringify({book})
                });

                // Debug: Log the response status
                console.log('Update response status:', response.status);

                // If not 2xx status, log the response body for debugging
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response body:', errorText);
                    return handleResponse(response); // This will throw the error
                }

                return handleResponse(response);
            } catch (error) {
                console.error('Update request failed:', error);
                throw error;
            }
        },
        delete: async ({ id }) => {
            // Check token before making request
            if (isTokenExpired()) {
                handleExpiredToken();
                throw new Error('Authentication expired. Please log in again.');
            }

            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            return handleResponse(response);
        }
    }
};

export default apiService;