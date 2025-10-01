import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const BottomNavbar = () => {
    const { currentUser } = useAuth();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Failed to log out.");
        }
    };

    const navItems = [
        { icon: 'public', path: '/dashboard/student', label: 'Home' },
        { icon: 'shield', path: '/challenges', label: 'Challenges' },
        { icon: 'trending_up', path: '/leaderboard', label: 'Leaders' },
        { icon: 'category', path: '/games', label: 'Games' },
        { icon: 'person', path: '/profile', label: 'Profile' }, // Using 'person' for mobile profile to match common patterns
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 p-2 flex justify-around items-center shadow-t-lg lg:hidden glassmorphism z-50">
            {navItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`p-2 flex flex-col items-center ${
                        location.pathname === item.path ? 'text-primary' : 'text-text-light/70 dark:text-text-dark/70'
                    }`}
                >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                </Link>
            ))}
            {currentUser && (
                 <button
                    onClick={handleLogout}
                    className="p-2 flex flex-col items-center text-red-500 hover:text-red-700"
                    title="Logout"
                >
                    <span className="material-symbols-outlined">logout</span>
                    <span className="text-xs">Logout</span>
                </button>
            )}
        </div>
    );
};

export default BottomNavbar;