import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import AuthLayout from '../components/AuthLayout';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [loginMode, setLoginMode] = useState('email'); // 'email' or 'code'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [instituteCode, setInstituteCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            // Redirection is handled by MainRedirect in App.jsx
        } catch (err) {
            console.error("Login failed:", err);
            setError('Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleCodeLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Navigate to join institute page with the code
            navigate(`/join-institute/${instituteCode}/student`);
        } catch (err) {
            console.error("Code login failed:", err);
            setError('Invalid institute code.');
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
            <div className="flex flex-col space-y-6 flex-grow">
                {/* Login Mode Toggle */}
                <motion.div
                    className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <button
                        type="button"
                        onClick={() => setLoginMode('email')}
                        className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${loginMode === 'email'
                                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        Email Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginMode('code')}
                        className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${loginMode === 'code'
                                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        Institute Code
                    </button>
                </motion.div>

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

                {/* Email Login Form */}
                {loginMode === 'email' && (
                    <form onSubmit={handleEmailLogin} className="flex flex-col space-y-5">
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
                    </form>
                )}

                {/* Institute Code Login Form */}
                {loginMode === 'code' && (
                    <form onSubmit={handleCodeLogin} className="flex flex-col space-y-5">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                            <label htmlFor="instituteCode" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                                Institute Code
                            </label>
                            <input
                                type="text"
                                id="instituteCode"
                                value={instituteCode}
                                onChange={(e) => setInstituteCode(e.target.value)}
                                required
                                className="w-full px-5 py-3 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light bg-gray-50 dark:bg-gray-700 text-text-light dark:text-text-dark placeholder-text-secondary-light/70 text-center text-2xl tracking-widest font-mono uppercase"
                                placeholder="ABC123"
                                maxLength={10}
                            />
                            <p className="mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">
                                Enter the code provided by your institute
                            </p>
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-lg hover:bg-primary-light transition-colors shadow-soft-md disabled:opacity-50 disabled:cursor-not-allowed"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                        >
                            {loading ? 'Verifying...' : 'Continue with Code'}
                        </motion.button>
                    </form>
                )}

                <motion.p
                    className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                >
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-semibold hover:underline">
                        Sign Up
                    </Link>
                </motion.p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;