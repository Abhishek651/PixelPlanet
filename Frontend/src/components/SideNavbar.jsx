import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import logo from '../assets/images/android-chrome-192x192.png';

const SideNavbar = () => {
    const { currentUser, userRole } = useAuth(); // Get userRole from AuthContext
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('rememberMe');
            window.location.href = '/'; // Redirect to landing page
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Failed to log out.");
        }
    };

    // Define navItems based on userRole
    let navItems = [];
    if (userRole === 'student') {
        navItems = [
            { icon: 'home', path: '/dashboard/student', label: 'Home' },
            { icon: 'shield', path: '/challenges', label: 'Challenges' },
            { icon: 'dynamic_feed', path: '/green-feed', label: 'Feed' },
            { icon: 'videogame_asset', path: '/games', label: 'Games' },
            { icon: 'menu', path: '/menu', label: 'Menu' },
        ];
    } else if (userRole === 'teacher') {
        navItems = [
            { icon: 'dashboard', path: '/dashboard/teacher', label: 'Dashboard' },
            { icon: 'shield', path: '/challenges', label: 'Challenges' },
            { icon: 'add_circle', path: '/create-challenge', label: 'Create Challenge' },
            { icon: 'dynamic_feed', path: '/green-feed', label: 'Feed' },
            { icon: 'videogame_asset', path: '/games', label: 'Games' },
            { icon: 'menu', path: '/menu', label: 'Menu' },
        ];
    } else if (userRole === 'hod') {
        navItems = [
            { icon: 'dashboard', path: '/dashboard/institute-admin', label: 'Admin' },
            { icon: 'group', path: '/hod/teachers', label: 'Teachers' },
            { icon: 'dynamic_feed', path: '/green-feed', label: 'Feed' },
            { icon: 'analytics', path: '/hod/analytics', label: 'Analytics' },
            { icon: 'menu', path: '/menu', label: 'Menu' },
        ];
    } else if (userRole === 'admin') {
        navItems = [
            { icon: 'dashboard', path: '/dashboard/main-admin', label: 'Dashboard' },
            { icon: 'settings', path: '/admin/settings', label: 'Site Settings' },
            { icon: 'person', path: '/profile', label: 'Profile' },
        ];
    } else {
        // Default items for guests
        navItems = [
            { icon: 'home', path: '/', label: 'Home' },
            { icon: 'videogame_asset', path: '/games', label: 'Games' },
            { icon: 'leaderboard', path: '/leaderboard', label: 'Leaderboard' },
            { icon: 'info', path: '/about', label: 'About' },
        ];
    }

    return (
        <nav
            className={`hidden lg:flex flex-col items-center justify-between p-4 transition-all duration-300 bg-white dark:bg-gray-800 border-r ${isExpanded ? 'w-56' : 'w-20'} h-full`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex flex-col items-center w-full space-y-6">
                <Link to="/" className="flex items-center justify-center h-12 w-12 mb-8">
                    <img src={logo} alt="Logo" className="w-10 h-10" />
                </Link>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-start p-3 rounded-lg w-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${location.pathname.startsWith(item.path) ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300'}`}
                        title={item.label}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        {isExpanded && <span className="ml-4">{item.label}</span>}
                    </Link>
                ))}
            </div>
            {currentUser && (
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-start p-3 rounded-lg w-full transition-colors hover:bg-red-100 text-red-600"
                    title="Logout"
                >
                    <span className="material-symbols-outlined">logout</span>
                    {isExpanded && <span className="ml-4">Logout</span>}
                </button>
            )}
        </nav>
    );
};

export default SideNavbar;