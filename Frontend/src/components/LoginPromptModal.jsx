import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPromptModal = ({ isOpen, onClose, title = "Join the Eco Community!" }) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
        onClose();
    };

    const handleSignup = () => {
        navigate('/signup');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl p-6 max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                            <button onClick={onClose} className="p-1">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        
                        <p className="text-gray-600 mb-6 text-sm">
                            Login to track your progress, compete with friends, and unlock exclusive eco-challenges!
                        </p>
                        
                        <div className="space-y-3">
                            <button
                                onClick={handleLogin}
                                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-light transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={handleSignup}
                                className="w-full border border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary/10 transition-colors"
                            >
                                Sign Up
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoginPromptModal;