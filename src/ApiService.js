// ApiService.js
const API_BASE_URL = 'http://localhost:8016';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

const handleResponse = async (response) => {
    if (!response.ok) {
        // If response is 401 Unauthorized, clear local storage and force reload
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            localStorage.removeItem('tokenExpiration');
            window.location.href = '/login';
            throw new Error('Authentication expired. Please log in again.');
        } else if (response.status === 403) {
            throw new Error('Shit happens');
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
        },
        register: async (userData) => {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return handleResponse(response);
        }
    },
    books: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/books/getBooks`, {
                headers: getHeaders()
            });
            return handleResponse(response);
        },
        get: async (id) => {
            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                headers: getHeaders()
            });
            return handleResponse(response);
        },
        add: async (book) => {
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(book)
            });
            return handleResponse(response);
        },
        update: async (book) => {
            const response = await fetch(`${API_BASE_URL}/books/updateBook`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({book})
            });
            return handleResponse(response);
        },
        delete: async ({ id }) => {
            const response = await fetch(`${API_BASE_URL}/books/deleteBook`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ id })
            });
            return handleResponse(response);
        }
    }
};

export default apiService;