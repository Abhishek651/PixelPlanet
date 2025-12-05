// API Configuration
// This file centralizes all API calls to the backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Debug: Log the API URL being used (remove in production)
console.log('🔧 API_URL configured as:', API_URL);

// Validate API_URL format
if (!API_URL.startsWith('http://') && !API_URL.startsWith('https://')) {
    console.error('❌ VITE_API_URL must start with http:// or https://');
    console.error('Current value:', API_URL);
}

/**
 * Make a request to the backend API
 * @param {string} endpoint - API endpoint (e.g., '/api/ecobot/chat')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
};

/**
 * EcoBot API
 */
export const ecoBotAPI = {
    sendMessage: async (message) => {
        return apiRequest('/api/ecobot/chat', {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
    },
};

/**
 * Leaderboard API
 */
export const leaderboardAPI = {
    getInstitute: async (token) => {
        return apiRequest('/api/leaderboard/institute', {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
    getGlobal: async (token) => {
        return apiRequest('/api/leaderboard/global', {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};

/**
 * Admin API
 */
export const adminAPI = {
    updateSettings: async (token, settings) => {
        return apiRequest('/api/admin/settings', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(settings),
        });
    },
    getSettings: async (token) => {
        return apiRequest('/api/admin/settings', {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};

/**
 * Generic HTTP methods
 */
const api = {
    get: async (endpoint, token = null) => {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = `${API_URL}${endpoint}`;
        const response = await fetch(url, { headers });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw { response: { status: response.status, data: errorData } };
        }
        return response.json();
    },
    post: async (endpoint, data, token = null) => {
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const url = `${API_URL}${endpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw { response: { status: response.status, data: errorData } };
        }
        return response.json();
    },
    put: async (endpoint, data, token = null) => {
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const url = `${API_URL}${endpoint}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw { response: { status: response.status, data: errorData } };
        }
        return response.json();
    },
    delete: async (endpoint, token = null) => {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = `${API_URL}${endpoint}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers,
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw { response: { status: response.status, data: errorData } };
        }
        return response.json();
    },
    apiRequest,
    ecoBotAPI,
    leaderboardAPI,
    adminAPI,
};

export default api;
