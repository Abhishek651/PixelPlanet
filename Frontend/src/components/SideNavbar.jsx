import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import logo from '../assets/images/android-chrome-192x192.png';

// ============================================
// COMPONENT: SideNavbar
// Desktop sidebar navigation with role-based menu items
// Expands on hover to show labels
// ============================================

const SideNavbar = () => {
    const { currentUser, userRole } = useAuth();
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);

    // Handle user logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('rememberMe');
            window.location.href = '/';
        } catch (error) {
            console.error('[SideNavbar] Logout error:', error);
            alert('Failed to log out. Please try again.');
        }
    };

    // Role-based navigation items with appropriate icons
    let navItems = [];
    
    if (userRole === 'student') {
        navItems = [
            { icon: 'home', path: '/dashboard/student', label: 'Home' },
            { icon: 'emoji_events', path: '/challenges', label: 'Challenges' },
            { icon: 'eco', path: '/green-feed', label: 'Green Feed' },
            { icon: 'sports_esports', path: '/games', label: 'Games' },
            { icon: 'person', path: '/profile', label: 'Profile' },
            { icon: 'apps', path: '/menu', label: 'Menu' },
        ];
    } else if (userRole === 'teacher') {
        navItems = [
            { icon: 'dashboard', path: '/dashboard/teacher', label: 'Dashboard' },
            { icon: 'school', path: '/teacher/classroom', label: 'Classroom' },
            { icon: 'assignment', path: '/challenges', label: 'Challenges' },
            { icon: 'grading', path: '/teacher/submissions', label: 'Submissions' },
            { icon: 'analytics', path: '/teacher/analytics', label: 'Analytics' },
            { icon: 'eco', path: '/green-feed', label: 'Green Feed' },
            { icon: 'person', path: '/profile', label: 'Profile' },
        ];
    } else if (userRole === 'hod') {
        navItems = [
            { icon: 'admin_panel_settings', path: '/dashboard/institute-admin', label: 'Dashboard' },
            { icon: 'people', path: '/hod/teachers', label: 'Teachers' },
            { icon: 'school', path: '/hod/students', label: 'Students' },
            { icon: 'assignment', path: '/challenges', label: 'Challenges' },
            { icon: 'bar_chart', path: '/hod/analytics', label: 'Analytics' },
            { icon: 'eco', path: '/green-feed', label: 'Green Feed' },
            { icon: 'person', path: '/profile', label: 'Profile' },
            { icon: 'apps', path: '/menu', label: 'Menu' },
        ];
    } else if (userRole === 'admin') {
        navItems = [
            { icon: 'admin_panel_settings', path: '/dashboard/admin', label: 'Dashboard' },
            { icon: 'people', path: '/admin/users', label: 'User Management' },
            { icon: 'business', path: '/admin/institutes', label: 'Institutes' },
            { icon: 'public', path: '/admin/challenges', label: 'Global Challenges' },
            { icon: 'bar_chart', path: '/admin/analytics', label: 'Analytics' },
            { icon: 'settings', path: '/admin/settings', label: 'Settings' },
        ];
    } else if (userRole === 'sub-admin') {
        navItems = [
            { icon: 'dashboard', path: '/dashboard/sub-admin', label: 'Dashboard' },
            { icon: 'people', path: '/admin/users', label: 'Users' },
            { icon: 'business', path: '/admin/institutes', label: 'Institutes' },
            { icon: 'bar_chart', path: '/admin/analytics', label: 'Analytics' },
            { icon: 'person', path: '/profile', label: 'Profile' },
        ];
    } else if (userRole === 'creator') {
        navItems = [
            { icon: 'dashboard', path: '/dashboard/creator', label: 'Dashboard' },
            { icon: 'add_circle', path: '/create-challenge', label: 'Create Challenge' },
            { icon: 'public', path: '/creator/challenges', label: 'My Challenges' },
            { icon: 'analytics', path: '/creator/analytics', label: 'Analytics' },
            { icon: 'person', path: '/profile', label: 'Profile' },
        ];
    } else if (userRole === 'global') {
        navItems = [
            { icon: 'home', path: '/dashboard', label: 'Home' },
            { icon: 'emoji_events', path: '/challenges', label: 'Challenges' },
            { icon: 'eco', path: '/green-feed', label: 'Green Feed' },
            { icon: 'sports_esports', path: '/games', label: 'Games' },
            { icon: 'person', path: '/profile', label: 'Profile' },
            { icon: 'apps', path: '/menu', label: 'Menu' },
        ];
    } else {
        // Default items for unauthenticated users
        navItems = [
            { icon: 'home', path: '/', label: 'Home' },
            { icon: 'sports_esports', path: '/games', label: 'Games' },
            { icon: 'leaderboard', path: '/leaderboard', label: 'Leaderboard' },
            { icon: 'info', path: '/about', label: 'About' },
            { icon: 'login', path: '/login', label: 'Login' },
        ];
    }

    return (
        <nav
            className={`hidden lg:flex flex-col items-center justify-between p-4 transition-all duration-300 bg-white dark:bg-gray-800 border-r ${isExpanded ? 'w-56' : 'w-20'} h-full`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Top section with logo and navigation items */}
            <div className="flex flex-col items-center w-full space-y-6">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center h-12 w-12 mb-8">
                    <img src={logo} alt="EcoTrack Logo" className="w-10 h-10" />
                </Link>
                
                {/* Navigation items */}
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-start p-3 rounded-lg w-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            location.pathname.startsWith(item.path) 
                                ? 'bg-primary text-white' 
                                : 'text-gray-600 dark:text-gray-300'
                        }`}
                        title={item.label}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        {isExpanded && <span className="ml-4">{item.label}</span>}
                    </Link>
                ))}
            </div>
            
            {/* Logout button (only for authenticated users) */}
            {currentUser && (
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-start p-3 rounded-lg w-full transition-colors hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
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