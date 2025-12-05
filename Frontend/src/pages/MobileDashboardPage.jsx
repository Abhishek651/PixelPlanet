import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getLevelFromXP, getLevelTitle } from '../utils/xpSystem';
import BottomNavbar from '../components/BottomNavbar';
import SideNavbar from '../components/SideNavbar';
import JoinInstituteModal from '../components/JoinInstituteModal';

const MobileDashboardPage = () => {
    const { currentUser, userRole } = useAuth();
    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [level, setLevel] = useState(1);
    const [xpInfo, setXpInfo] = useState({
        currentLevelXP: 0,
        xpForNextLevel: 100,
        progress: 0
    });

    // Real-time listener for XP data
    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = onSnapshot(
            doc(db, 'users', currentUser.uid),
            (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    const totalXP = data.xp || 0;
                    const levelInfo = getLevelFromXP(totalXP);
                    setLevel(levelInfo.level);
                    setXpInfo({
                        currentLevelXP: levelInfo.currentLevelXP,
                        xpForNextLevel: levelInfo.xpForNextLevel,
                        progress: levelInfo.progress
                    });
                }
            },
            (error) => {
                console.error('Error fetching XP data:', error);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <SideNavbar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-30 shadow-sm flex-shrink-0">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-800 text-lg font-medium">
                    <span className="material-symbols-outlined text-3xl">account_circle</span>
                    <span>my account</span>
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                </Link>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold text-sm">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <button className="relative p-1">
                        <span className="material-symbols-outlined text-2xl text-gray-800">notifications</span>
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 pb-20 lg:pb-4">
                {/* Profile Widget - Mobile/Tablet Only */}
                <div className="mb-6 lg:hidden">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-primary to-emerald-400"></div>
                        <div className="relative z-10 pt-8 pb-4 px-4">
                            <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 mx-auto bg-gray-200 overflow-hidden shadow-md">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${currentUser?.displayName || 'User'}&background=random`} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-2">
                                {currentUser?.displayName || 'Eco Explorer'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Level {level} • {getLevelTitle(level)}
                            </p>

                            <div className="mt-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-medium text-gray-600 dark:text-gray-300">XP Progress</span>
                                    <span className="text-primary">
                                        {xpInfo.currentLevelXP.toLocaleString()} / {xpInfo.xpForNextLevel.toLocaleString()}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative">
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full relative"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${xpInfo.progress}%` }}
                                        transition={{ 
                                            duration: 1.2, 
                                            ease: [0.4, 0, 0.2, 1],
                                            type: "spring",
                                            stiffness: 50,
                                            damping: 20
                                        }}
                                    >
                                        {/* Animated glow effect */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 rounded-full"
                                            animate={{
                                                x: ['-100%', '100%']
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                repeatDelay: 1,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Journey Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">my journey</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <Link to="/challenges" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-green-600">task_alt</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium text-sm">Challenges</span>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/activities" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-green-600">local_activity</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium text-sm">Activities</span>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/store" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-yellow-600">store</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium text-sm">Store</span>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/impact" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-blue-600">eco</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium text-sm">My Impact</span>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/leaderboard" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-purple-600">leaderboard</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium text-sm">Leaderboard</span>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/teams" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-pink-600">groups</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium text-sm">My Teams</span>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* Join Institute Banner (only for global users) */}
                {userRole === 'global' && (
                    <div className="mb-8">
                        <button
                            onClick={() => setShowJoinModal(true)}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition-shadow"
                        >
                            <div className="text-left">
                                <div className="flex items-center mb-2">
                                    <span className="material-symbols-outlined text-white mr-2">school</span>
                                    <span className="text-white text-sm font-medium">Join Your Institute</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">Connect with Your School</h3>
                                <p className="text-blue-100 text-sm">Enter your institute code to access exclusive challenges</p>
                            </div>
                            <span className="material-symbols-outlined text-white text-3xl">arrow_forward</span>
                        </button>
                    </div>
                )}

                {/* Featured Quests Banner */}
                <Link to="/quests" className="block mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center mb-1">
                                <span className="material-symbols-outlined text-yellow-500 mr-1">star</span>
                                <span className="text-gray-600 text-sm">featured</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">quests</h3>
                        </div>
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="material-symbols-outlined text-2xl text-green-600">explore</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-400 text-2xl">chevron_right</span>
                        </div>
                    </div>
                </Link>

                {/* Eco-Explore Section */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">eco-explore</h2>
                    
                    {/* Eco-Shop Banner */}
                    <Link to="/shop" className="block mb-4">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-4 flex items-center justify-between text-white">
                            <div>
                                <p className="text-sm opacity-90">eco-shop:</p>
                                <h3 className="text-xl font-bold">explore deals</h3>
                            </div>
                            <span className="material-symbols-outlined text-2xl">chevron_right</span>
                        </div>
                    </Link>

                    <div className="grid grid-cols-3 gap-4">
                        <Link to="/help" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-blue-600">help</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium text-sm">Help</span>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/news" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-indigo-600">article</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium text-sm">Eco-News</span>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/resources" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-orange-600">local_library</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium text-sm">Resources</span>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        </Link>

                        {userRole === 'teacher' && (
                            <Link to="/analytics" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl text-green-600">insights</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-800 font-medium text-sm">Analytics</span>
                                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                                </div>
                            </Link>
                        )}

                        {userRole === 'hod' && (
                            <Link to="/admin-tools" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl text-purple-600">admin_panel_settings</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-800 font-medium text-sm">Admin Tools</span>
                                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                                </div>
                            </Link>
                        )}

                        <Link to="/about" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-teal-600">info</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium text-sm">About Us</span>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/profile" className="bg-white rounded-xl shadow-sm p-4 h-32 flex flex-col justify-between">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-gray-600">person</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium text-sm">Profile</span>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        </Link>
                    </div>
                </section>
                </main>
                <BottomNavbar />
            </div>
            
            {/* Join Institute Modal */}
            <JoinInstituteModal 
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
            />
        </div>
    );
};

export default MobileDashboardPage;