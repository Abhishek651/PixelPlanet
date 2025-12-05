import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import LoginPromptModal from './LoginPromptModal';

// ============================================
// COMPONENT: BottomNavbar
// Mobile navigation bar with role-based menu items
// ============================================

const BottomNavbar = () => {
    const { userRole, currentUser } = useAuth();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Role-based navigation items with appropriate icons
    let navItems = [];
    if (currentUser) {
        // Student navigation
        if (userRole === 'student') {
            navItems = [
                { icon: 'home', path: '/dashboard/student', label: 'Home' },
                { icon: 'emoji_events', path: '/challenges', label: 'Challenges' },
                { icon: 'eco', path: '/green-feed', label: 'Feed' },
                { icon: 'sports_esports', path: '/games', label: 'Games' },
                { icon: 'apps', path: '/menu', label: 'Menu' },
            ];
        } 
        // Teacher navigation
        else if (userRole === 'teacher') {
            navItems = [
                { icon: 'dashboard', path: '/dashboard/teacher', label: 'Dashboard' },
                { icon: 'assignment', path: '/challenges', label: 'Challenges' },
                { icon: 'analytics', path: '/teacher/analytics', label: 'Analytics' },
                { icon: 'eco', path: '/green-feed', label: 'Feed' },
                { icon: 'apps', path: '/menu', label: 'Menu' },
            ];
        } 
        // HOD navigation
        else if (userRole === 'hod') {
            navItems = [
                { icon: 'admin_panel_settings', path: '/dashboard/institute-admin', label: 'Admin' },
                { icon: 'people', path: '/hod/teachers', label: 'Teachers' },
                { icon: 'school', path: '/hod/students', label: 'Students' },
                { icon: 'bar_chart', path: '/hod/analytics', label: 'Analytics' },
                { icon: 'apps', path: '/menu', label: 'Menu' },
            ];
        }
        // Admin navigation
        else if (userRole === 'admin') {
            navItems = [
                { icon: 'admin_panel_settings', path: '/dashboard/admin', label: 'Admin' },
                { icon: 'people', path: '/admin/users', label: 'Users' },
                { icon: 'business', path: '/admin/institutes', label: 'Institutes' },
                { icon: 'settings', path: '/admin/settings', label: 'Settings' },
            ];
        }
        // Sub-admin navigation
        else if (userRole === 'sub-admin') {
            navItems = [
                { icon: 'dashboard', path: '/dashboard/sub-admin', label: 'Dashboard' },
                { icon: 'people', path: '/admin/users', label: 'Users' },
                { icon: 'analytics', path: '/admin/analytics', label: 'Analytics' },
                { icon: 'settings', path: '/admin/settings', label: 'Settings' },
            ];
        }
        // Creator navigation
        else if (userRole === 'creator') {
            navItems = [
                { icon: 'dashboard', path: '/dashboard/creator', label: 'Dashboard' },
                { icon: 'add_circle', path: '/create-challenge', label: 'Create' },
                { icon: 'public', path: '/creator/challenges', label: 'Challenges' },
                { icon: 'analytics', path: '/creator/analytics', label: 'Analytics' },
            ];
        }
        // Global user navigation (same as student)
        else if (userRole === 'global') {
            navItems = [
                { icon: 'home', path: '/dashboard', label: 'Home' },
                { icon: 'emoji_events', path: '/challenges', label: 'Challenges' },
                { icon: 'eco', path: '/green-feed', label: 'Feed' },
                { icon: 'sports_esports', path: '/games', label: 'Games' },
                { icon: 'apps', path: '/menu', label: 'Menu' },
            ];
        }
    } else {
        // Public/unauthenticated navigation
        navItems = [
            { icon: 'home', path: '/', label: 'Home', public: true },
            { icon: 'sports_esports', path: '/games', label: 'Games', public: false },
            { icon: 'info', path: '/about', label: 'About', public: true },
            { icon: 'eco', path: '/green-feed', label: 'Feed', public: false },
            { icon: 'login', path: '/login', label: 'Login', public: true },
        ];
    }

    // Handle navigation click - show login modal if not authenticated
    const handleNavClick = (item, e) => {
        if (!currentUser && !item.public) {
            e.preventDefault();
            setShowLoginModal(true);
        }
    };

    return (
        <>
            {/* Mobile bottom navigation - reduced height with better spacing */}
            <nav className="fixed bottom-3 left-3 right-3 lg:hidden z-50">
                <div className="flex justify-around items-center rounded-2xl shadow-2xl bg-white/90 backdrop-blur-3xl border-2 border-white/60 py-2 px-3"
                    style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.1)'
                    }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={(e) => handleNavClick(item, e)}
                                onTouchStart={() => setActiveItem(item.path)}
                                onTouchEnd={() => setActiveItem(null)}
                                onMouseDown={() => setActiveItem(item.path)}
                                onMouseUp={() => setActiveItem(null)}
                                onMouseLeave={() => setActiveItem(null)}
                                className={`relative p-1.5 flex flex-col items-center transition-all duration-300 ease-out rounded-xl min-w-[45px] ${isActive
                                        ? 'text-green-600 bg-green-500/40 shadow-lg transform scale-105 backdrop-blur-sm'
                                        : 'text-gray-800 hover:text-green-500 hover:bg-white/50'
                                    } ${activeItem === item.path ? 'transform scale-95 bg-white/60' : ''
                                    }`}
                                style={isActive ? {
                                    background: 'rgba(34, 197, 94, 0.35)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    boxShadow: '0 6px 24px rgba(34, 197, 94, 0.4)'
                                } : {}}
                            >
                                {/* Icon with subtle animation */}
                                <div className={`transition-all duration-300 ${isActive ? 'transform -translate-y-0.5' : ''}`}>
                                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                </div>
                                {/* Label - smaller text */}
                                <span className={`text-[10px] mt-0.5 transition-all duration-300 ${isActive ? 'font-semibold opacity-100' : 'opacity-70'}`}>
                                    {item.label}
                                </span>
                                {/* Active indicator dot */}
                                {isActive && (
                                    <div
                                        className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"
                                        style={{
                                            boxShadow: '0 0 6px rgba(34, 197, 94, 0.9)',
                                            animation: 'pulse 2s infinite'
                                        }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
            {/* Login prompt modal for unauthenticated users */}
            <LoginPromptModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                title="Login Required"
            />
        </>
    );
};

export default BottomNavbar;