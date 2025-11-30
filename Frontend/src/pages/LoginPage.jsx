import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { ChevronRight } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await login(email, password);
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }
            navigate('/');
        } catch (_err) {
            setError('Failed to log in. Please check your credentials.');
        }
        setLoading(false);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const { sendPasswordResetEmail } = await import('firebase/auth');
            const { auth } = await import('../services/firebase');
            await sendPasswordResetEmail(auth, email);
            setSuccess('Password reset email sent! Check your inbox.');
            setTimeout(() => setShowForgotPassword(false), 3000);
        } catch (_err) {
            setError('Failed to send reset email. Please check your email address.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4 relative overflow-hidden">
            <style>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-text-fill-color: white;
                    -webkit-box-shadow: 0 0 0px 1000px transparent inset;
                    transition: background-color 5000s ease-in-out 0s;
                }
            `}</style>
            {/* Subtle forest/nature background pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="trees" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                            <path d="M100 20 L120 80 L80 80 Z M100 40 L115 90 L85 90 Z M100 60 L110 100 L90 100 Z"
                                fill="currentColor" opacity="0.3" />
                            <rect x="95" y="100" width="10" height="30" fill="currentColor" opacity="0.3" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#trees)" />
                </svg>
            </div>

            {/* Main Card Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl shadow-2xl overflow-hidden relative"
            >
                {/* Form Content */}
                <div className="px-8 py-8 min-h-[450px] flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex-1 flex flex-col"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Welcome back!
                        </h2>
                        <p className="text-white text-opacity-80 mb-8">
                            Sign in to continue your eco-journey
                        </p>

                        <form onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-6 flex-1 flex flex-col">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-500 bg-opacity-20 border border-red-300 rounded-lg text-white text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-green-500 bg-opacity-20 border border-green-300 rounded-lg text-white text-sm"
                                >
                                    {success}
                                </motion.div>
                            )}

                            <div className="space-y-6 flex-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <label className="block text-white text-opacity-90 text-sm font-medium mb-2 uppercase tracking-wide">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border border-white border-opacity-20 bg-white bg-opacity-5 text-white text-lg outline-none transition-shadow duration-150 placeholder-white/60 focus:shadow-lg focus:shadow-white/10 focus:border-opacity-50 focus:outline-none"
                                        placeholder="your.email@example.com"
                                        required
                                        autoFocus
                                    />
                                </motion.div>

                                {!showForgotPassword && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <label className="block text-white text-opacity-90 text-sm font-medium mb-2 uppercase tracking-wide">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl border border-white border-opacity-20 bg-white bg-opacity-5 text-white text-lg outline-none transition-shadow duration-150 placeholder-white/60 focus:shadow-lg focus:shadow-white/10 focus:border-opacity-50 focus:outline-none"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </motion.div>
                                )}

                                {!showForgotPassword && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex items-center justify-between"
                                    >
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="w-4 h-4 rounded border-white border-opacity-30 bg-white bg-opacity-10 text-teal-600 focus:ring-2 focus:ring-white focus:ring-opacity-30"
                                            />
                                            <span className="ml-2 text-white text-opacity-80 text-sm">Remember me</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="text-white text-opacity-80 text-sm hover:text-opacity-100 underline transition-all"
                                        >
                                            Forgot password?
                                        </button>
                                    </motion.div>
                                )}

                                {showForgotPassword && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center"
                                    >
                                        <p className="text-white text-opacity-90 text-sm mb-4">
                                            Enter your email address and we'll send you a link to reset your password.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(false)}
                                            className="text-white text-opacity-80 text-sm hover:text-opacity-100 underline transition-all"
                                        >
                                            Back to login
                                        </button>
                                    </motion.div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end items-center mt-8">
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="w-16 h-16 rounded-full bg-white hover:bg-opacity-90 flex items-center justify-center transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-3 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : showForgotPassword ? (
                                        <span className="material-symbols-outlined text-teal-600 text-3xl">send</span>
                                    ) : (
                                        <ChevronRight className="w-8 h-8 text-teal-600" />
                                    )}
                                </motion.button>
                            </div>

                            {/* Register Link */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="text-center mt-6"
                            >
                                <p className="text-white text-opacity-80 text-sm">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        className="font-semibold underline hover:text-opacity-100 transition-all"
                                    >
                                        Sign Up
                                    </Link>
                                </p>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>

                {/* Decorative bottom gradient */}
                <div className="h-32 bg-gradient-to-t from-emerald-800 to-transparent opacity-20 absolute bottom-0 left-0 right-0 pointer-events-none">
                    {/* Subtle tree silhouettes */}
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0 L50,80 L100,0 L150,90 L200,0 L250,70 L300,0 L350,85 L400,0 L450,75 L500,0 L550,80 L600,0 L650,90 L700,0 L750,70 L800,0 L850,85 L900,0 L950,75 L1000,0 L1050,80 L1100,0 L1150,90 L1200,0 L1200,120 L0,120 Z"
                            fill="currentColor" opacity="0.3" />
                    </svg>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
