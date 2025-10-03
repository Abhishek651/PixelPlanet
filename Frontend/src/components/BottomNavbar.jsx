import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const BottomNavbar = () => {
    const { currentUser, userRole } = useAuth();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await signOut(auth);
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
            { icon: 'person', path: '/profile', label: 'Profile' },
        ];
    } else if (userRole === 'teacher') {
        navItems = [
            { icon: 'dashboard', path: '/dashboard/teacher', label: 'Dashboard' },
            { icon: 'book', path: '/teacher/curriculum', label: 'Curriculum' },
            { icon: 'task_alt', path: '/teacher/quests', label: 'Quests' },
            { icon: 'assessment', path: '/teacher/reports', label: 'Reports' },
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
        // Default items for guests (should not be visible on dashboards, but good for fallback)
        navItems = [
            { icon: 'home', path: '/', label: 'Home' },
            { icon: 'videogame_asset', path: '/games', label: 'Games' },
            { icon: 'leaderboard', path: '/leaderboard', label: 'Leaderboard' },
            { icon: 'info', path: '/about', label: 'About' },
        ];
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 flex justify-around items-center rounded-2xl shadow-lg bg-surface-light dark:bg-surface-dark backdrop-blur-xl p-4 lg:hidden z-50">
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
