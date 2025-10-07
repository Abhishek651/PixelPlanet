import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import AuthLayout from '../components/AuthLayout';
import { motion } from 'framer-motion';

const RegisterInstitutePage = () => {
    const [instituteName, setInstituteName] = useState('');
    const [instituteEmail, setInstituteEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { registerInstitute } = useAuth(); // Assuming this function exists in AuthContext
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setLoading(true);
        try {
            await registerInstitute(instituteName, instituteEmail, password);
            navigate('/login'); // Redirect to login after successful registration
        } catch (err) {
            console.error("Institute registration failed:", err);
            setError(err.message || 'Failed to register institute.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            imageSrc="https://images.unsplash.com/photo-1543269871-74443907e596?q=80&w=2940&auto=format&fit=crop" // Different image
            heading="Create Your Institute"
            subheading="Start your school's green journey with PixelPlanet. Register your institute and become an admin."
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
                    <label htmlFor="instituteName" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        Institute Name
                    </label>
                    <input
                        type="text"
                        id="instituteName"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                        required
                        className="w-full px-5 py-3 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light bg-gray-50 dark:bg-gray-700 text-text-light dark:text-text-dark placeholder-text-secondary-light/70"
                        placeholder="Greenwood High School"
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <label htmlFor="instituteEmail" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        Institute Admin Email
                    </label>
                    <input
                        type="email"
                        id="instituteEmail"
                        value={instituteEmail}
                        onChange={(e) => setInstituteEmail(e.target.value)}
                        required
                        className="w-full px-5 py-3 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light bg-gray-50 dark:bg-gray-700 text-text-light dark:text-text-dark placeholder-text-secondary-light/70"
                        placeholder="admin@greenwood.edu"
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
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

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-5 py-3 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light bg-gray-50 dark:bg-gray-700 text-text-light dark:text-text-dark placeholder-text-secondary-light/70"
                        placeholder="••••••••"
                    />
                </motion.div>

                <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-lg hover:bg-primary-light transition-colors shadow-soft-md disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                >
                    {loading ? 'Registering...' : 'Register Institute'}
                </motion.button>

                <motion.p
                    className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                >
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Log In
                    </Link>
                </motion.p>
            </form>
        </AuthLayout>
    );
};

export default RegisterInstitutePage;