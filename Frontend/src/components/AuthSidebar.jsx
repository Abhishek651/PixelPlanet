import React from 'react';
import { Link } from 'react-router-dom';

const AuthSidebar = () => {
    return (
        <aside className="hidden xl:flex flex-col w-80 p-6 space-y-6">
            <div className="glassmorphism p-6 rounded-2xl shadow-soft-lg text-center flex-grow flex flex-col justify-center">
                <h3 className="text-2xl font-bold font-display text-text-light dark:text-text-dark">Ready to Start?</h3>
                <p className="mt-2 mb-6 text-text-secondary-light dark:text-text-secondary-dark">Join a community of eco-warriors and make a difference.</p>
                <div className="space-y-4">
                    <Link 
                        to="/register/institute"
                        className="w-full block py-3 px-6 bg-primary text-white font-semibold rounded-full hover:bg-primary-light transition shadow-soft"
                    >
                        Register Institute
                    </Link>
                    <button 
                        // This would open your InstituteCodeModal
                        // We will pass the function to open it as a prop
                        className="w-full py-3 px-6 bg-surface-light dark:bg-surface-dark border border-primary/20 text-primary font-semibold rounded-full hover:bg-primary/10 transition"
                    >
                        Join with Code
                    </button>
                </div>
                <div className="mt-8 text-sm">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">Already have an account? </span>
                    <Link to="/login" className="font-semibold text-primary hover:underline">
                        Log In
                    </Link>
                </div>
            </div>
        </aside>
    );
};

export default AuthSidebar;