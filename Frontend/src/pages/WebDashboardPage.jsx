import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const WebDashboardPage = () => {
    const { currentUser, userRole } = useAuth();
    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                            <span className="text-gray-500">Welcome back, {userName}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
                                <span className="material-symbols-outlined text-2xl">account_circle</span>
                                <span>My Account</span>
                            </Link>
                            <button className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors">
                                <span className="material-symbols-outlined text-2xl">notifications</span>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* My Journey Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">My Journey</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        <Link to="/challenges" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 h-40 flex flex-col justify-between group">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <span className="material-symbols-outlined text-2xl text-green-600">task_alt</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">Challenges</span>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 transition-colors">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/activities" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 h-40 flex flex-col justify-between group">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <span className="material-symbols-outlined text-2xl text-green-600">local_activity</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">Activities</span>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 transition-colors">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/store" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 h-40 flex flex-col justify-between group">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                                <span className="material-symbols-outlined text-2xl text-yellow-600">store</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">Store</span>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 transition-colors">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/impact" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 h-40 flex flex-col justify-between group">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <span className="material-symbols-outlined text-2xl text-blue-600">eco</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">My Impact</span>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 transition-colors">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/leaderboard" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 h-40 flex flex-col justify-between group">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <span className="material-symbols-outlined text-2xl text-purple-600">leaderboard</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">Leaderboard</span>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 transition-colors">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/teams" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 h-40 flex flex-col justify-between group">
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                                <span className="material-symbols-outlined text-2xl text-pink-600">groups</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">My Teams</span>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 transition-colors">chevron_right</span>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* Featured Quests Banner */}
                <section className="mb-12">
                    <Link to="/quests" className="block">
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 flex items-center justify-between group">
                            <div>
                                <div className="flex items-center mb-2">
                                    <span className="material-symbols-outlined text-yellow-500 mr-2">star</span>
                                    <span className="text-gray-600 text-lg">Featured</span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800">Quests</h3>
                                <p className="text-gray-600 mt-2">Discover exciting environmental challenges</p>
                            </div>
                            <div className="flex items-center">
                                <div className="w-20 h-20 bg-green-100 rounded-lg flex items-center justify-center mr-6 group-hover:bg-green-200 transition-colors">
                                    <span className="material-symbols-outlined text-3xl text-green-600">explore</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-400 text-3xl group-hover:text-gray-600 transition-colors">chevron_right</span>
                            </div>
                        </div>
                    </Link>
                </section>

                {/* Eco-Explore Section */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Eco-Explore</h2>
                    
                    {/* Eco-Shop Banner */}
                    <Link to="/shop" className="block mb-8">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-8 flex items-center justify-between text-white hover:from-green-500 hover:to-blue-600 transition-all group">
                            <div>
                                <p className="text-lg opacity-90">Eco-Shop:</p>
                                <h3 className="text-3xl font-bold">Explore Deals</h3>
                                <p className="text-lg opacity-90 mt-2">Sustainable products for a better tomorrow</p>
                            </div>
                            <span className="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </div>
                    </Link>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        <Link to="/help" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 h-40 flex flex-col justify-between group">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <span className="material-symbols-outlined text-2xl text-blue-600">help</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">Help</span>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 transition-colors">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/news" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 h-40 flex flex-col justify-between group">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                <span className="material-symbols-outlined text-2xl text-indigo-600">article</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">Eco-News</span>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 transition-colors">chevron_right</span>
                            </div>
                        </Link>

                        <Link to="/resources" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 h-40 flex flex-col justify-between group">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                <span className="material-symbols-outlined text-2xl text-orange-600">local_library</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">Resources</span>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 transition-colors">chevron_right</span>
                            </div>
                        </Link>

                        {userRole === 'teacher' && (
                            <Link to="/analytics" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 h-40 flex flex-col justify-between group">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                    <span className="material-symbols-outlined text-2xl text-green-600">insights</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-800 font-medium">Analytics</span>
                                    <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 transition-colors">chevron_right</span>
                                </div>
                            </Link>
                        )}

                        {userRole === 'hod' && (
                            <Link to="/admin-tools" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 h-40 flex flex-col justify-between group">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <span className="material-symbols-outlined text-2xl text-purple-600">admin_panel_settings</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-800 font-medium">Admin Tools</span>
                                    <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 transition-colors">chevron_right</span>
                                </div>
                            </Link>
                        )}

                        <Link to="/profile" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 h-40 flex flex-col justify-between group">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                <span className="material-symbols-outlined text-2xl text-gray-600">person</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">Profile</span>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 transition-colors">chevron_right</span>
                            </div>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default WebDashboardPage;