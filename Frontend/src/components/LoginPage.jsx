import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            // Redirection is handled by MainRedirect in App.jsx
            // or by ProtectedRoute if user tries to access a protected route
        } catch (err) {
            console.error("Login failed:", err);
            setError('Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            imageSrc="https://images.unsplash.com/photo-1582234032483-fa4c0d1645e7?q=80&w=2940&auto=format&fit=crop"
            heading="Welcome Back!"
            subheading="Sign in to continue your eco-journey and track your impact."
        >
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6 flex-grow">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {error}</span>
                    </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-5 py-3 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light bg-gray-50 dark:bg-gray-700 text-text-light dark:text-text-dark placeholder-text-secondary-light/70"
                        placeholder="your.email@example.com"
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <label htmlFor="password" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-5 py-3 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light bg-gray-50 dark:bg-gray-700 text-text-light dark:text-text-dark placeholder-text-secondary-light/70"
                        placeholder="••••••••"
                    />
                </motion.div>

                <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-lg hover:bg-primary-light transition-colors shadow-soft-md disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </motion.button>

                <motion.p
                    className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                >
                    Don't have an account?{' '}
                    <Link to="/register/institute" className="text-primary font-semibold hover:underline">
                        Register Institute
                    </Link>
                    {' or '}
                    <Link to="/join-institute/code" className="text-primary font-semibold hover:underline">
                        Join with Code
                    </Link>
                </motion.p>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;