import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { getUserFriendlyError, getValidationError } from '../utils/errorMessages';
import { logAuthEvent, logError, logUserAction } from '../utils/logger';
import { useNotification } from '../components/base/NotificationModal';

// ============================================
// PAGE: RegisterPage
// Multi-step registration form for new users
// Creates global user account
// ============================================

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signup } = useAuth();
    const { showNotification, NotificationComponent } = useNotification();

    const totalSteps = 4;

    // Handle next step with validation
    const handleNext = () => {
        // Step-specific validation
        if (step === 1 && (!formData.firstName || !formData.lastName)) {
            setError(getValidationError('name', 'required'));
            return;
        }
        if (step === 2 && !formData.email) {
            setError(getValidationError('email', 'required'));
            return;
        }
        if (step === 3 && !formData.password) {
            setError(getValidationError('password', 'required'));
            return;
        }

        setError('');
        if (step < totalSteps) {
            setStep(step + 1);
            logUserAction('Registration step completed', { step });
        }
    };

    // Handle back to previous step
    const handleBack = () => {
        setError('');
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Handle final registration submission
    const handleSubmit = async () => {
        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError(getValidationError('passwords', 'match'));
            return;
        }
        
        // Validate password length
        if (formData.password.length < 6) {
            setError(getValidationError('password', 'min', 6));
            return;
        }

        setError('');
        setLoading(true);

        logUserAction('Registration attempt', { email: formData.email });

        try {
            const fullName = `${formData.firstName} ${formData.lastName}`;
            await signup(formData.email, formData.password, fullName);
            
            logAuthEvent('Registration successful', { email: formData.email });
            
            // Show success notification
            showNotification({
                title: 'Welcome to EcoLearn!',
                message: `Your account has been created successfully. Start your eco-journey now, ${formData.firstName}!`,
                type: 'success',
                confirmText: 'Get Started',
                onConfirm: () => {
                    navigate('/');
                }
            });
            
            // Wait for auth state to update, then redirect
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            logError('RegisterPage', 'Registration failed', err);
            setError(getUserFriendlyError(err, 'register'));
            
            // Show error notification
            showNotification({
                title: 'Registration Failed',
                message: getUserFriendlyError(err, 'register'),
                type: 'error',
                confirmText: 'Try Again'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setError('');
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    const [direction, setDirection] = useState(0);

    const paginate = (newDirection) => {
        setDirection(newDirection);
    };

    return (
        <>
            {NotificationComponent}
            <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4 relative overflow-hidden">
            <style>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-text-fill-color: white !important;
                    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
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
                {/* Progress Indicator */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex justify-between mb-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`h-1 flex-1 mx-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-white' : 'bg-white bg-opacity-30'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-white text-opacity-80 text-sm text-center">
                        Step {step} of {totalSteps}
                    </p>
                </div>

                {/* Form Content */}
                <div className="px-8 pb-8 min-h-[400px] flex flex-col">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="flex-1 flex flex-col"
                        >
                            {/* Step 1: Name */}
                            {step === 1 && (
                                <div className="flex flex-col h-full">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                                        What's your name?
                                    </h2>

                                    <div className="space-y-6 flex-1">
                                        <div>
                                            <label className="block text-white text-opacity-90 text-sm font-medium mb-2 uppercase tracking-wide">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                className="w-full bg-transparent border-b-2 border-white border-opacity-50 focus:border-opacity-100 text-white text-lg py-3 px-0 outline-none transition-all placeholder-white placeholder-opacity-40"
                                                placeholder="John"
                                                autoFocus
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white text-opacity-90 text-sm font-medium mb-2 uppercase tracking-wide">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                className="w-full bg-transparent border-b-2 border-white border-opacity-50 focus:border-opacity-100 text-white text-lg py-3 px-0 outline-none transition-all placeholder-white placeholder-opacity-40"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Email */}
                            {step === 2 && (
                                <div className="flex flex-col h-full">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                                        And, your email?
                                    </h2>

                                    <div className="flex-1">
                                        <label className="block text-white text-opacity-90 text-sm font-medium mb-2 uppercase tracking-wide">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full bg-transparent border-b-2 border-white border-opacity-50 focus:border-opacity-100 text-white text-lg py-3 px-0 outline-none transition-all placeholder-white placeholder-opacity-40"
                                            placeholder="john.doe@example.com"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Password */}
                            {step === 3 && (
                                <div className="flex flex-col h-full">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                                        Create a password
                                    </h2>

                                    <div className="flex-1">
                                        <label className="block text-white text-opacity-90 text-sm font-medium mb-2 uppercase tracking-wide">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className="w-full bg-transparent border-b-2 border-white border-opacity-50 focus:border-opacity-100 text-white text-lg py-3 px-0 outline-none transition-all placeholder-white placeholder-opacity-40"
                                            placeholder="••••••••"
                                            autoFocus
                                        />
                                        <p className="text-white text-opacity-70 text-xs mt-2">
                                            Must be at least 6 characters
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Confirm Password */}
                            {step === 4 && (
                                <div className="flex flex-col h-full">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                                        Confirm your password
                                    </h2>

                                    <div className="flex-1">
                                        <label className="block text-white text-opacity-90 text-sm font-medium mb-2 uppercase tracking-wide">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            className="w-full bg-transparent border-b-2 border-white border-opacity-50 focus:border-opacity-100 text-white text-lg py-3 px-0 outline-none transition-all placeholder-white placeholder-opacity-40"
                                            placeholder="••••••••"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-300 rounded-lg text-white text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-8">
                        {step > 1 ? (
                            <button
                                onClick={() => {
                                    handleBack();
                                    paginate(-1);
                                }}
                                className="w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                        ) : (
                            <div className="w-12"></div>
                        )}

                        <button
                            onClick={() => {
                                if (step === totalSteps) {
                                    handleSubmit();
                                } else {
                                    handleNext();
                                    paginate(1);
                                }
                            }}
                            disabled={loading}
                            className="w-16 h-16 rounded-full bg-white hover:bg-opacity-90 flex items-center justify-center transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <ChevronRight className="w-8 h-8 text-teal-600" />
                            )}
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-white text-opacity-80 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="font-semibold underline hover:text-opacity-100 transition-all"
                            >
                                Log In
                            </button>
                        </p>
                    </div>
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
        </>
    );
};

export default RegisterPage;
