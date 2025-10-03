import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { motion } from 'framer-motion';

const JoinInstitutePage = () => {
    const { instituteId, role: roleFromParams } = useParams(); // Can get instituteId and role from URL
    const [instituteCode, setInstituteCode] = useState(instituteId || '');
    const [role, setRole] = useState(roleFromParams || ''); // Default to student if not specified
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { joinInstitute } = useAuth(); // Assuming this function exists in AuthContext
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (!role) {
            return setError('Please select a role (Student or Teacher)');
        }
        setLoading(true);
        try {
            await joinInstitute(instituteCode, name, email, password, role);
            navigate('/login'); // Redirect to login after successful joining
        } catch (err) {
            console.error("Joining institute failed:", err);
            setError(err.message || 'Failed to join institute. Check code and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            imageSrc="https://images.unsplash.com/photo-1510257850069-b590e0c8b056?q=80&w=2940&auto=format&fit=crop" // Another image
            heading="Join Your Institute"
            subheading="Enter your institute's code and your details to join the community."
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
                    <label htmlFor="instituteCode" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        Institute Code
                    </label>
                    <input
                        type="text"
                        id="instituteCode"
                        value={instituteCode}
                        onChange={(e) => setInstituteCode(e.target.value)}
                        required
                        className="w-full px-5 py-3 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light bg-gray-50 dark:bg-gray-700 text-text-light dark:text-text-dark placeholder-text-secondary-light/70"
                        placeholder="e.g., PIXEL123"
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        Your Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-5 py-3 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light bg-gray-50 dark:bg-gray-700 text-text-light dark:text-text-dark placeholder-text-secondary-light/70"
                        placeholder="John Doe"
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
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

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                    <label htmlFor="role" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        Your Role
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="w-full px-5 py-3 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light bg-gray-50 dark:bg-gray-700 text-text-light dark:text-text-dark placeholder-text-secondary-light/70 appearance-none pr-10"
                    >
                        <option value="">Select your role</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">arrow_drop_down</span>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
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

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
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
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                >
                    {loading ? 'Joining...' : 'Join Institute'}
                </motion.button>

                <motion.p
                    className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
                >
                    Go back to{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Login
                    </Link>
                </motion.p>
            </form>
        </AuthLayout>
    );
};

export default JoinInstitutePage;