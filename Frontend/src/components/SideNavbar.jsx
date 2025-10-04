import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import logo from '../assets/images/android-chrome-192x192.png';

const SideNavbar = () => {
    const { currentUser, userRole } = useAuth(); // Get userRole from AuthContext
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

    // Define navItems based on userRole
    let navItems = [];
    if (userRole === 'student') {
        navItems = [
            { icon: 'public', path: '/dashboard/student', label: 'Home' },
            { icon: 'shield', path: '/challenges', label: 'Challenges' },
            { icon: 'trending_up', path: '/leaderboard', label: 'Leaders' },
            { icon: 'category', path: '/games', label: 'Games' },
            { icon: 'hub', path: '/profile', label: 'Profile' },
        ];
    } else if (userRole === 'teacher') {
        navItems = [
            { icon: 'dashboard', path: '/dashboard/teacher', label: 'Dashboard Home' },
            { icon: 'shield', path: '/challenges', label: 'Challenges' },
            { icon: 'book', path: '/teacher/curriculum', label: 'Curriculum' },
            { icon: 'task_alt', path: '/teacher/quests', label: 'Quests Overview' },
            { icon: 'assessment', path: '/teacher/reports', label: 'Reports' },
            { icon: 'public', path: '/teacher/impact-map', label: 'Impact Map' },
            { icon: 'person', path: '/profile', label: 'Profile' },
        ];
    } else if (userRole === 'hod') {
        navItems = [
            { icon: 'dashboard', path: '/dashboard/institute-admin', label: 'Admin' },
            { icon: 'group', path: '/hod/teachers', label: 'Teachers' },
            { icon: 'school', path: '/hod/students', label: 'Students' },
            { icon: 'analytics', path: '/hod/analytics', label: 'Analytics' },
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
        <nav className="hidden lg:flex flex-col items-center justify-between p-4 transition-all duration-300 w-20 m-6 rounded-2xl shadow-lg bg-white/50 dark:bg-black/20">
            <div className="flex flex-col items-center w-full space-y-6">
                <Link to="/" className="flex items-center justify-center h-12 w-12 mb-8">
                    <img src={logo} alt="Logo" className="w-10 h-10" />
                </Link>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-center p-3 rounded-full nav-item ${
                            location.pathname.startsWith(item.path) ? 'nav-item-active' : '' // Use startsWith for broader path matching
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