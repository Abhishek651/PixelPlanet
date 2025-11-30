import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import api from '../services/api';

const RegisterInstitutePage = () => {
    const [formData, setFormData] = useState({
        instituteName: '',
        instituteType: 'School',
        instituteLocation: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.adminPassword !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/api/auth/register-institute', {
                instituteName: formData.instituteName,
                instituteType: formData.instituteType,
                instituteLocation: formData.instituteLocation,
                adminName: formData.adminName,
                adminEmail: formData.adminEmail,
                adminPassword: formData.adminPassword
            });

            if (response.status === 201) {
                alert('Institute registered successfully! Please log in.');
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to register institute. Please try again.');
        } finally {
            setLoading(false);
        }
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
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto px-2">
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
                        name="instituteName"
                        placeholder="Institute Name"
                        value={formData.instituteName}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </motion.div>

                <motion.div variants={inputVariants} transition={{ delay: 0.15 }}>
                    <select
                        name="instituteType"
                        value={formData.instituteType}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="School">School</option>
                        <option value="College">College</option>
                        <option value="University">University</option>
                        <option value="Other">Other</option>
                    </select>
                </motion.div>

                <motion.div variants={inputVariants} transition={{ delay: 0.2 }}>
                    <input
                        type="text"
                        name="instituteLocation"
                        placeholder="Location (City, Country)"
                        value={formData.instituteLocation}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </motion.div>

                <motion.div variants={inputVariants} transition={{ delay: 0.25 }}>
                    <input
                        type="text"
                        name="adminName"
                        placeholder="Administrator Name"
                        value={formData.adminName}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </motion.div>

                <motion.div variants={inputVariants} transition={{ delay: 0.3 }}>
                    <input
                        type="email"
                        name="adminEmail"
                        placeholder="Admin Email Address"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </motion.div>

                <motion.div variants={inputVariants} transition={{ delay: 0.35 }}>
                    <input
                        type="password"
                        name="adminPassword"
                        placeholder="Password"
                        value={formData.adminPassword}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </motion.div>

                <motion.div variants={inputVariants} transition={{ delay: 0.4 }}>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                        {loading ? 'Creating Account...' : 'Register Institute'}
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
