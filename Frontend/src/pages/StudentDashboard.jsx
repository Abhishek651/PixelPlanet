import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import BottomNavbar from '../components/BottomNavbar';
import EcoBot from '../components/EcoBot';
import DashboardLeaderboard from '../components/DashboardLeaderboard';
import LoginPromptModal from '../components/LoginPromptModal';

const StudentDashboard = () => {
    const { currentUser } = useAuth();
    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Explorer';
    const [showEcoBot, setShowEcoBot] = useState(false);
    const [showBotHint, setShowBotHint] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const categories = [
        { label: 'All', icon: 'apps', to: '/challenges' },
        { label: 'Forests', icon: 'forest', to: '/challenges/forests' },
        { label: 'Water', icon: 'water_drop', to: '/challenges/water' },
        { label: 'Energy', icon: 'lightbulb', to: '/challenges/energy' },
        { label: 'Recycling', icon: 'recycling', to: '/challenges/recycling' },
        { label: 'Wildlife', icon: 'pets', to: '/challenges/wildlife' }
    ];

    const featuredChallenges = [
        { id: '1', title: 'Forest Restoration Drive', date: '10 July', participants: '80+', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2940&auto=format&fit=crop' },
        { id: '2', title: 'Beach Cleanup Challenge', date: '15 July', participants: '50+', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2940&auto=format&fit=crop' }
    ];

    const upcomingChallenges = [
        { id: '3', title: 'Community Tree Planting', date: '10 July, 2025', location: 'Lahore, Pakistan', participants: '30+', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2940&auto=format&fit=crop' },
        { id: '4', title: 'DIY Solar Panel Workshop', date: '20 July, 2025', location: 'Karachi, Pakistan', participants: '25+', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2940&auto=format&fit=crop' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-30 shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">{currentUser ? 'Your Location' : 'Welcome'}</p>
                        <p className="text-sm font-semibold text-gray-800 flex items-center">
                            {currentUser ? 'Islamabad, Pakistan' : 'Eco Explorer'} 
                            {currentUser && <span className="material-symbols-outlined text-sm ml-1">expand_more</span>}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => {
                            if (currentUser) {
                                setShowEcoBot(true);
                                setShowBotHint(false);
                            } else {
                                setShowLoginModal(true);
                            }
                        }}
                        className="relative p-1 bg-green-100 rounded-full hover:bg-green-200 transition-all duration-300 hover:scale-110"
                    >
                        <span className="material-symbols-outlined text-2xl text-green-600">smart_toy</span>
                        {currentUser && showBotHint && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce">
                                <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                            </div>
                        )}
                        {currentUser && showBotHint && (
                            <div className="absolute -bottom-12 -right-8 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap animate-pulse">
                                Ask me anything! 🌱
                                <div className="absolute top-0 right-4 transform -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                            </div>
                        )}
                    </button>
                    <button 
                        onClick={() => !currentUser && setShowLoginModal(true)}
                        className="relative p-1"
                    >
                        <span className="material-symbols-outlined text-2xl text-gray-600">
                            {currentUser ? 'notifications' : 'login'}
                        </span>
                        {currentUser && <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>}
                    </button>
                </div>
            </header>

            {/* Search Bar */}
            <div className="p-4">
                <div className="flex items-center bg-gray-100 rounded-xl p-3">
                    <span className="material-symbols-outlined text-gray-400 mr-2">search</span>
                    <input
                        type="text"
                        placeholder="Search Quests, Eco-Activities..."
                        className="flex-grow bg-transparent text-gray-800 focus:outline-none placeholder-gray-400"
                    />
                    <span className="material-symbols-outlined text-gray-400 ml-2">mic</span>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="px-4 pb-4">
                <div className="relative w-full h-48 rounded-2xl overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?q=80&w=2940&auto=format&fit=crop" 
                        alt="Upcoming Challenges" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">Upcoming Eco-Challenges</h3>
                        <p className="text-sm mt-1">Get ready for impactful actions!</p>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="px-4 pb-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">Categories for You</h3>
                    <Link to="/categories" className="text-green-500 text-sm font-medium">See all</Link>
                </div>
                <div className="flex overflow-x-auto space-x-3 pb-2">
                    {categories.map((cat) => (
                        <Link to={cat.to} key={cat.label} className="flex-shrink-0">
                            <div className="flex flex-col items-center justify-center w-20 h-20 bg-gray-100 rounded-xl">
                                <span className="material-symbols-outlined text-2xl text-gray-600">{cat.icon}</span>
                                <span className="text-xs mt-1 font-medium text-gray-600">{cat.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Challenges */}
            <div className="px-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">Featured Challenges</h3>
                    <Link to="/challenges/featured" className="text-green-500 text-sm font-medium">See all</Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {featuredChallenges.map((challenge) => (
                        <div key={challenge.id} className="relative h-40 rounded-xl overflow-hidden shadow-sm">
                            <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
                                {challenge.date}
                            </div>
                            <div className="absolute bottom-3 left-3 text-white">
                                <h4 className="text-sm font-semibold">{challenge.title}</h4>
                                <p className="text-xs">{challenge.participants} members</p>
                            </div>
                            <button 
                                onClick={() => !currentUser && setShowLoginModal(true)}
                                className="absolute bottom-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-lg"
                            >
                                {currentUser ? 'Join' : 'Login to Join'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Challenges */}
            <div className="px-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">Upcoming Challenges</h3>
                    <Link to="/challenges/upcoming" className="text-green-500 text-sm font-medium">See all</Link>
                </div>
                <div className="space-y-4">
                    {upcomingChallenges.map((challenge) => (
                        <div key={challenge.id} className="flex bg-white rounded-xl shadow-sm overflow-hidden h-24">
                            <div className="w-24 h-full relative">
                                <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
                                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/50 text-white text-xs rounded">
                                    {challenge.date.split(',')[0]}
                                </div>
                            </div>
                            <div className="flex-grow p-3 flex flex-col justify-center">
                                <h4 className="text-sm font-semibold text-gray-800">{challenge.title}</h4>
                                <p className="text-xs text-gray-500">{challenge.location}</p>
                                <p className="text-xs text-gray-400">{challenge.participants} members</p>
                            </div>
                            <button 
                                onClick={() => !currentUser && setShowLoginModal(true)}
                                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg m-3"
                            >
                                {currentUser ? 'Join' : 'Login to Join'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leaderboard */}
            <div className="px-4 mb-6">
                {currentUser ? (
                    <DashboardLeaderboard />
                ) : (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Top Eco-Warriors</h3>
                            <button 
                                onClick={() => setShowLoginModal(true)}
                                className="text-green-500 text-sm font-medium"
                            >
                                Login to View
                            </button>
                        </div>
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl text-gray-400">leaderboard</span>
                            </div>
                            <p className="text-gray-600 mb-4">Join the community to see rankings!</p>
                            <button 
                                onClick={() => setShowLoginModal(true)}
                                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </div>



            <BottomNavbar />
            {currentUser && <EcoBot isOpen={showEcoBot} onClose={() => setShowEcoBot(false)} />}
            <LoginPromptModal 
                isOpen={showLoginModal} 
                onClose={() => setShowLoginModal(false)} 
            />
        </div>
    );
};

export default StudentDashboard;