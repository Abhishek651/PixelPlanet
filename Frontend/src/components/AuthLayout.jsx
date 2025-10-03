
import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ imageSrc, heading, subheading, children }) => {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-end md:justify-center bg-gray-100 dark:bg-dark-green">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src={imageSrc} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content Card */}
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-md bg-background-light dark:bg-brunswick-green rounded-t-5xl md:rounded-3xl shadow-soft-xl p-8"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-text-light dark:text-text-dark font-display">{heading}</h1>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">{subheading}</p>
                </div>
                {children}
            </motion.div>
        </div>
    );
};

export default AuthLayout;
