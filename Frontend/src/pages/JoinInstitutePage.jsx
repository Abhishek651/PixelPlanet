import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import api from '../services/api';

const JoinInstitutePage = () => {
    const { instituteId, role } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '', // For teachers
        admissionNumber: '', // For students
        class: '', // For students
        section: '' // For students
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        setError('');
        setLoading(true);

        try {
            let endpoint = '';
            let payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                instituteId: instituteId
            };

            if (role === 'teacher') {
                endpoint = '/api/auth/register-teacher';
                payload.department = formData.department;
            } else if (role === 'student') {
                endpoint = '/api/auth/register-student';
                payload.admissionNumber = formData.admissionNumber;
                payload.class = formData.class;
                payload.section = formData.section;
            } else {
                throw new Error('Invalid role specified.');
            }

            const response = await api.post(endpoint, payload);

            if (response.status === 201) {
                alert('Registration successful! Please log in.');
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to join institute. Please try again.');
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
            imageSrc="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2400&auto=format&fit=crop"
            heading={`Join as a ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            subheading={`You have been invited to join an institute.`}
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
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </motion.div>

                <motion.div variants={inputVariants} transition={{ delay: 0.15 }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </motion.div>

                {role === 'teacher' && (
                    <motion.div variants={inputVariants} transition={{ delay: 0.2 }}>
                        <input
                            type="text"
                            name="department"
                            placeholder="Department (e.g., Science, Math)"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </motion.div>
                )}

                {role === 'student' && (
                    <>
                        <motion.div variants={inputVariants} transition={{ delay: 0.2 }}>
                            <input
                                type="text"
                                name="admissionNumber"
                                placeholder="Admission Number"
                                value={formData.admissionNumber}
                                onChange={handleChange}
                                className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </motion.div>
                        <div className="flex gap-4">
                            <motion.div variants={inputVariants} transition={{ delay: 0.25 }} className="flex-1">
                                <input
                                    type="text"
                                    name="class"
                                    placeholder="Class (e.g., 10)"
                                    value={formData.class}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </motion.div>
                            <motion.div variants={inputVariants} transition={{ delay: 0.25 }} className="flex-1">
                                <input
                                    type="text"
                                    name="section"
                                    placeholder="Section (e.g., A)"
                                    value={formData.section}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </motion.div>
                        </div>
                    </>
                )}

                <motion.div variants={inputVariants} transition={{ delay: 0.3 }}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Create a Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </motion.div>

                <motion.div variants={inputVariants} transition={{ delay: 0.35 }}>
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

                <motion.div variants={inputVariants} transition={{ delay: 0.4 }}>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-4 font-bold text-white bg-primary rounded-xl hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Join and Create Account'}
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

export default JoinInstitutePage;
