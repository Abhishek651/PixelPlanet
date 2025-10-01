import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const SideNavbar = () => {
    const { currentUser } = useAuth();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // No need to navigate here, AuthContext's onAuthStateChanged will trigger
            // a redirect via ProtectedRoute if the user is on a protected route.
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
        { icon: 'hub', path: '/profile', label: 'Profile' }, // Changed icon to 'hub' as in the HTML for consistency
    ];

    return (
        <nav className="hidden lg:flex flex-col items-center justify-between p-4 bg-transparent transition-all duration-300 w-20">
            <div className="flex flex-col items-center w-full space-y-6">
                <Link to="/" className="flex items-center justify-center h-12 w-12 mb-8">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="font-display text-2xl font-bold text-white">N</span>
                    </div>
                </Link>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-center p-3 rounded-full nav-item ${
                            location.pathname === item.path ? 'nav-item-active' : ''
                        }`}
                        title={item.label}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                    </Link>
                ))}
            </div>
            {currentUser && (
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center p-3 rounded-full nav-item w-full"
                    title="Logout"
                >
                    <span className="material-symbols-outlined">logout</span>
                </button>
            )}
        </nav>
    );
};

export default SideNavbar;