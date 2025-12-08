import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIVerificationLoader = ({ isOpen }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { icon: '📤', title: 'Uploading Image', duration: 2000, tip: 'Tip: Clear photos get better results!' },
        { icon: '🔍', title: 'Analyzing Image', duration: 2500, tip: 'AI is examining your photo...' },
        { icon: '🤖', title: 'AI Verification', duration: 3000, tip: 'Checking authenticity and quality...' },
        { icon: '✨', title: 'Validating Challenge', duration: 2500, tip: 'Matching with challenge requirements...' },
        { icon: '🎯', title: 'Final Review', duration: 2000, tip: 'Almost done! Finalizing results...' }
    ];

    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(0);
            return;
        }

        let timeoutId;
        if (currentStep < steps.length - 1) {
            timeoutId = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, steps[currentStep].duration);
        }

        return () => clearTimeout(timeoutId);
    }, [isOpen, currentStep]);

    if (!isOpen) return null;

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4"
                >
                    {/* Animated Icon */}
                    <motion.div
                        key={currentStep}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="text-7xl text-center mb-6"
                    >
                        {steps[currentStep].icon}
                    </motion.div>

                    {/* Step Title */}
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-2xl font-bold text-gray-800 text-center mb-2"
                        >
                            {steps[currentStep].title}
                            <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                ...
                            </motion.span>
                        </motion.h2>
                    </AnimatePresence>

                    {/* Step Counter */}
                    <p className="text-center text-gray-500 text-sm mb-6">
                        Step {currentStep + 1} of {steps.length}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                            <span>Progress</span>
                            <span className="font-semibold">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full relative"
                            >
                                <motion.div
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex justify-center gap-2 mb-6">
                        {steps.map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.8 }}
                                animate={{
                                    scale: index === currentStep ? 1.2 : 1,
                                    backgroundColor: index <= currentStep ? '#10b981' : '#e5e7eb'
                                }}
                                className="w-2 h-2 rounded-full"
                            />
                        ))}
                    </div>

                    {/* Tip */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center"
                        >
                            <p className="text-sm text-green-800">
                                {steps[currentStep].tip}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AIVerificationLoader;
