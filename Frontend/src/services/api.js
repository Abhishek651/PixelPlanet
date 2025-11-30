import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token if available
api.interceptors.request.use(
    async (config) => {
        // You might need to import auth from firebase service here if you want to get the token
        // Or rely on the fact that firebase auth state is handled elsewhere.
        // However, for protected routes, we usually need to send the token.

        // Dynamic import to avoid circular dependencies if any, or just import auth
        const { auth } = await import('./firebase');

        if (auth.currentUser) {
            const token = await auth.currentUser.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
