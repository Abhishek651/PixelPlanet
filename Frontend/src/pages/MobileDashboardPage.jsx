import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import BottomNavbar from '../components/BottomNavbar';

const MobileDashboardPage = () => {
    const { currentUser, userRole } = useAuth();
    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-30 shadow-sm">
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

            <main className="p-4">
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
    );
};

export default MobileDashboardPage;