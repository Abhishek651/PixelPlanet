
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import AuthLayout from '../components/AuthLayout';

const RegisterInstitutePage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [instituteName, setInstituteName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setError('');
        setLoading(true);
        try {
            await signup(email, password, { instituteName, role: 'hod' });
            navigate('/');
        } catch (_err) { // eslint-disable-line no-unused-vars
            setError('Failed to create an account. Please try again.');
        }
        setLoading(false);
    };

    const inputVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
    };

    return (
        <AuthLayout
            imageSrc="https://images.unsplash.com/photo-1562774053-62433891549d?q=80&w=2400&auto=format&fit=crop"
            heading="Register Your Institute"
            subheading="Create an admin account to get started."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <motion.p
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 text-center text-red-800 bg-red-100 rounded-lg"
                    >
                        {error}
                    </motion.p>
                )}
                <motion.div variants={inputVariants} transition={{ delay: 0.1 }}>
                    <input
                        type="text"
                        placeholder="Institute Name"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </motion.div>
                <motion.div variants={inputVariants} transition={{ delay: 0.2 }}>
                    <input
                        type="email"
                        placeholder="Admin Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </motion.div>
                <motion.div variants={inputVariants} transition={{ delay: 0.3 }}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </motion.div>
                <motion.div variants={inputVariants} transition={{ delay: 0.4 }}>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </motion.div>
                <motion.div variants={inputVariants} transition={{ delay: 0.5 }}>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-4 font-bold text-white bg-primary rounded-xl hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </motion.div>
                <p className="text-center text-text-secondary-light dark:text-text-secondary-dark">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Log in here
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default RegisterInstitutePage;
