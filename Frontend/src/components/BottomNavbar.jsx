import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import LoginPromptModal from './LoginPromptModal';

const BottomNavbar = () => {
    const { userRole, currentUser } = useAuth();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    let navItems = [];
    if (currentUser) {
        if (userRole === 'student') {
            navItems = [
                { icon: 'home', path: '/dashboard/student', label: 'Home' },
                { icon: 'shield', path: '/challenges', label: 'Challenges' },
                { icon: 'dynamic_feed', path: '/green-feed', label: 'Feed' },
                { icon: 'videogame_asset', path: '/games', label: 'Games' },
                { icon: 'menu', path: '/dashboard/mobile', label: 'Menu' },
            ];
        } else if (userRole === 'teacher') {
            navItems = [
                { icon: 'dashboard', path: '/dashboard/teacher', label: 'Dashboard' },
                { icon: 'shield', path: '/challenges', label: 'Challenges' },
                { icon: 'dynamic_feed', path: '/green-feed', label: 'Feed' },
                { icon: 'videogame_asset', path: '/games', label: 'Games' },
                { icon: 'menu', path: '/dashboard/mobile', label: 'Menu' },
            ];
        } else if (userRole === 'hod') {
            navItems = [
                { icon: 'dashboard', path: '/dashboard/institute-admin', label: 'Admin' },
                { icon: 'group', path: '/hod/teachers', label: 'Teachers' },
                { icon: 'dynamic_feed', path: '/green-feed', label: 'Feed' },
                { icon: 'analytics', path: '/hod/analytics', label: 'Analytics' },
                { icon: 'menu', path: '/dashboard/mobile', label: 'Menu' },
            ];
        }
    } else {
        navItems = [
            { icon: 'home', path: '/student-dashboard', label: 'Home', public: true },
            { icon: 'shield', path: '/challenges', label: 'Challenges', public: true },
            { icon: 'dynamic_feed', path: '/green-feed', label: 'Feed', public: false },
            { icon: 'videogame_asset', path: '/games', label: 'Games', public: false },
            { icon: 'login', path: '/login', label: 'Login', public: true },
        ];
    }

    const handleNavClick = (item, e) => {
        if (!currentUser && !item.public) {
            e.preventDefault();
            setShowLoginModal(true);
        }
    };

    return (
        <>
            <nav className="fixed bottom-4 left-4 right-4 lg:hidden z-50">
                <div className="flex justify-around items-center rounded-3xl shadow-2xl bg-white/25 backdrop-blur-3xl border border-white/40 p-4" 
                     style={{
                         background: 'rgba(255, 255, 255, 0.25)',
                         backdropFilter: 'blur(20px)',
                         WebkitBackdropFilter: 'blur(20px)',
                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
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
                                className={`relative p-2 flex flex-col items-center transition-all duration-300 ease-out rounded-xl min-w-[50px] ${
                                    isActive 
                                        ? 'text-green-600 bg-green-500/30 shadow-lg transform scale-105 backdrop-blur-sm' 
                                        : 'text-gray-700 hover:text-green-500 hover:bg-white/30'
                                } ${
                                    activeItem === item.path ? 'transform scale-95 bg-white/40' : ''
                                }`}
                                style={isActive ? {
                                    background: 'rgba(34, 197, 94, 0.25)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)'
                                } : {}}
                            >
                                <div className={`transition-all duration-300 ${
                                    isActive ? 'transform -translate-y-1' : ''
                                }`}>
                                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                </div>
                                <span className={`text-xs mt-1 transition-all duration-300 ${
                                    isActive ? 'font-semibold opacity-100' : 'opacity-70'
                                }`}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <div 
                                        className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"
                                        style={{
                                            boxShadow: '0 0 8px rgba(34, 197, 94, 0.9)',
                                            animation: 'pulse 2s infinite'
                                        }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
            <LoginPromptModal 
                isOpen={showLoginModal} 
                onClose={() => setShowLoginModal(false)}
                title="Login Required"
            />
        </>
    );
};

export default BottomNavbar;