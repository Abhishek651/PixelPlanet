import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getLevelFromXP, getLevelTitle } from '../utils/xpSystem';

// Components for Desktop Dashboard
import DashboardLayout from '../components/DashboardLayout';
import ProfileStatsWidget from '../components/ProfileStatsWidget';
import MentorCard from '../components/MentorCard';
import ScoreCoinsBar from '../components/ScoreCoinsBar';

// Components for Mobile Dashboard
import BottomNavbar from '../components/BottomNavbar';
import DashboardLeaderboard from '../components/DashboardLeaderboard';
import LoginPromptModal from '../components/LoginPromptModal';

// Shared Components
import EcoBot from '../components/EcoBot';

const MobileStudentDashboard = () => {
    const { currentUser } = useAuth();
    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Explorer';
    const [showEcoBot, setShowEcoBot] = useState(false);
    const [showBotHint, setShowBotHint] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [ecoPoints, setEcoPoints] = useState(0);
    const [coins, setCoins] = useState(0);

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

    // Real-time listener for user data
    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = onSnapshot(
            doc(db, 'users', currentUser.uid),
            (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setEcoPoints(data.ecoPoints || 0);
                    setCoins(data.coins || 0);
                }
            },
            (error) => {
                console.error('Error fetching user data:', error);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

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

            {/* Score and Coins Bar - Mobile */}
            {currentUser && (
                <div className="px-4 pt-2 pb-3 bg-white border-b border-gray-100">
                    <div className="flex gap-2 overflow-x-auto">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-full shadow-md flex-shrink-0">
                            <span className="text-lg">🌱</span>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium opacity-90">Eco Points</span>
                                <span className="text-sm font-bold leading-none">{ecoPoints.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-3 py-2 rounded-full shadow-md flex-shrink-0">
                            <span className="text-lg">🪙</span>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium opacity-90">Coins</span>
                                <span className="text-sm font-bold leading-none">{coins.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Continue Learning Section */}
            <div className="px-4 pb-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-500">play_circle</span>
                        Continue Learning
                    </h3>
                    <Link to="/challenges" className="text-green-500 text-sm font-medium">See all</Link>
                </div>
                <div className="space-y-3">
                    <div className="bg-white rounded-xl shadow-sm p-3 flex gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400" alt="Forest" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-semibold text-gray-800">Forest Restoration Drive</h4>
                                <span className="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">2 days</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Next: Complete Module 3</p>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-3 flex gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=400" alt="Beach" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-semibold text-gray-800">Beach Cleanup Challenge</h4>
                                <span className="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">5 days</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Next: Quiz: Ocean Plastics</p>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Quests Section */}
            <div className="px-4 pb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-500">stars</span>
                    Daily Quests
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-3 border border-gray-200 relative overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 text-green-500">
                            <span className="material-symbols-outlined text-lg">quiz</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800 mb-1">Eco-Warrior</h4>
                        <p className="text-xs text-gray-500 mb-2">Complete 1 Quiz</p>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">0/1</span>
                            <span className="text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded-full text-xs">+50 XP</span>
                        </div>
                        <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-3 border border-gray-200 relative overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 text-green-500">
                            <span className="material-symbols-outlined text-lg">article</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800 mb-1">Green Reader</h4>
                        <p className="text-xs text-gray-500 mb-2">Read 2 Articles</p>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">1/2</span>
                            <span className="text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded-full text-xs">+30 XP</span>
                        </div>
                        <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-3 border border-gray-200 relative overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 text-green-500">
                            <span className="material-symbols-outlined text-lg">forum</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800 mb-1">Social Butterfly</h4>
                        <p className="text-xs text-gray-500 mb-2">Comment on post</p>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">0/1</span>
                            <span className="text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded-full text-xs">+20 XP</span>
                        </div>
                        <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                    </div>
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
                                {currentUser ? 'Join' : 'Login'}
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
                                {currentUser ? 'Join' : 'Login'}
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

const DesktopStudentDashboard = () => {
    const { currentUser } = useAuth();
    const [showEcoBot, setShowEcoBot] = useState(false);
    const [ecoPoints, setEcoPoints] = useState(0);
    const [coins, setCoins] = useState(0);
    const [level, setLevel] = useState(1);
    const [xpInfo, setXpInfo] = useState({
        currentLevelXP: 0,
        xpForNextLevel: 100,
        progress: 0
    });

    // Mock Data
    const activeChallenges = [
        {
            id: '1',
            title: 'Forest Restoration Drive',
            category: 'Forests',
            progress: 65,
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400',
            nextTask: 'Complete Module 3: Soil Health',
            timeLeft: '2 days'
        },
        {
            id: '2',
            title: 'Beach Cleanup Challenge',
            category: 'Water',
            progress: 40,
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=400',
            nextTask: 'Quiz: Ocean Plastics',
            timeLeft: '5 days'
        }
    ];

    const dailyQuests = [
        { id: 1, title: 'Eco-Warrior', desc: 'Complete 1 Daily Quiz', progress: 0, total: 1, reward: '50 XP', icon: 'quiz' },
        { id: 2, title: 'Green Reader', desc: 'Read 2 Articles', progress: 1, total: 2, reward: '30 XP', icon: 'article' },
        { id: 3, title: 'Social Butterfly', desc: 'Comment on a post', progress: 0, total: 1, reward: '20 XP', icon: 'forum' }
    ];

    const recommended = [
        { id: 3, title: 'Urban Gardening 101', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=400', rating: 4.8 },
        { id: 4, title: 'Sustainable Fashion', category: 'Consumerism', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400', rating: 4.9 }
    ];

    const leaderboard = [
        { rank: 1, name: 'Emma Wilson', points: 2850 },
        { rank: 2, name: 'Liam Chen', points: 2720 },
        { rank: 3, name: 'Sophia Kumar', points: 2650 },
        { rank: 4, name: 'Noah Patel', points: 2580 },
        { rank: 5, name: 'You', points: 2490 }
    ];

    const achievements = [
        { id: 1, name: 'First Steps', icon: 'footprint', color: 'text-green-500 bg-green-100' },
        { id: 2, name: 'Quiz Master', icon: 'psychology', color: 'text-purple-500 bg-purple-100' },
        { id: 3, name: 'Tree Hugger', icon: 'forest', color: 'text-emerald-500 bg-emerald-100' },
        { id: 4, name: 'Water Saver', icon: 'water_drop', color: 'text-blue-500 bg-blue-100' }
    ];

    // Real-time listener for user data (desktop)
    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = onSnapshot(
            doc(db, 'users', currentUser.uid),
            (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setEcoPoints(data.ecoPoints || 0);
                    setCoins(data.coins || 0);
                    
                    // Calculate level and XP info from total XP
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
                console.error('Error fetching user data:', error);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-10">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white font-display">
                            Welcome back, <span className="text-primary">{currentUser?.displayName || 'Explorer'}</span>! 👋
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            You're on a <span className="font-bold text-orange-500">5-day streak</span>. Keep it up!
                        </p>
                    </div>
                    <ScoreCoinsBar />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Main Content - 3 Columns */}
                    <div className="xl:col-span-3 space-y-8">

                        {/* Continue Learning Section */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-primary">play_circle</span>
                                    Continue Learning
                                </h2>
                                <Link to="/challenges" className="text-sm font-medium text-primary hover:underline">View All</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {activeChallenges.map((challenge) => (
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        key={challenge.id}
                                        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4"
                                    >
                                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-gray-800 dark:text-white line-clamp-1">{challenge.title}</h3>
                                                    <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full whitespace-nowrap">{challenge.timeLeft} left</span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Next: {challenge.nextTask}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-500">{challenge.progress}% Complete</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full" style={{ width: `${challenge.progress}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Daily Quests Section */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-icons text-yellow-500">stars</span>
                                Daily Quests
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {dailyQuests.map((quest) => (
                                    <div key={quest.id} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <span className="material-icons text-6xl">{quest.icon}</span>
                                        </div>
                                        <div className="relative z-10">
                                            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center mb-3 text-primary">
                                                <span className="material-icons">{quest.icon}</span>
                                            </div>
                                            <h3 className="font-bold text-gray-800 dark:text-white">{quest.title}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{quest.desc}</p>
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="text-gray-600 dark:text-gray-300">{quest.progress}/{quest.total}</span>
                                                <span className="text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">+{quest.reward}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                                                <div className="h-full bg-yellow-500 rounded-full transition-all duration-500" style={{ width: `${(quest.progress / quest.total) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Recommended Section */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-purple-500">recommend</span>
                                    Recommended for You
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recommended.map((item) => (
                                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex group cursor-pointer hover:shadow-md transition-all">
                                        <div className="w-1/3 relative overflow-hidden">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="w-2/3 p-4 flex flex-col justify-center">
                                            <span className="text-xs font-medium text-primary mb-1">{item.category}</span>
                                            <h3 className="font-bold text-gray-800 dark:text-white mb-2">{item.title}</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <span className="material-icons text-yellow-400 text-sm">star</span>
                                                {item.rating} Rating
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar - 1 Column */}
                    <div className="space-y-8">
                        {/* Profile Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary to-emerald-400"></div>
                            <div className="relative z-10 mt-12">
                                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 mx-auto bg-gray-200 overflow-hidden shadow-md">
                                    <img src={`https://ui-avatars.com/api/?name=${currentUser?.displayName || 'User'}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-3">{currentUser?.displayName || 'Eco Explorer'}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Level {level} • {getLevelTitle(level)}</p>

                                <div className="mt-6">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-gray-600 dark:text-gray-300">XP Progress</span>
                                        <span className="text-primary">{xpInfo.currentLevelXP.toLocaleString()} / {xpInfo.xpForNextLevel.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative">
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

                        {/* Leaderboard Widget */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-icons text-yellow-500">leaderboard</span>
                                Top Students
                            </h3>
                            <div className="space-y-4">
                                {leaderboard.map((user, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {user.rank}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
                                        </div>
                                        <span className="text-xs font-bold text-primary">{user.points}</span>
                                    </div>
                                ))}
                            </div>
                            <Link to="/leaderboard" className="block text-center text-sm text-primary font-medium mt-4 hover:underline">View Full Leaderboard</Link>
                        </div>

                        {/* Achievements Widget */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-icons text-purple-500">military_tech</span>
                                Achievements
                            </h3>
                            <div className="grid grid-cols-4 gap-2">
                                {achievements.map((badge) => (
                                    <div key={badge.id} className="aspect-square rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center relative group cursor-pointer">
                                        <span className={`material-icons ${badge.color} text-2xl`}>{badge.icon}</span>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                                            {badge.name}
                                        </div>
                                    </div>
                                ))}
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="aspect-square rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600">
                                        <span className="material-icons text-gray-300 dark:text-gray-600 text-xl">lock</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* EcoBot */}
            <EcoBot isOpen={showEcoBot} onClose={() => setShowEcoBot(false)} />

            {/* Floating EcoBot Button */}
            <button
                onClick={() => setShowEcoBot(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-light text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group z-50"
            >
                <span className="material-icons">smart_toy</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
            </button>
        </DashboardLayout>
    );
};

const StudentDashboard = () => {
    return (
        <>
            <div className="block lg:hidden">
                <MobileStudentDashboard />
            </div>
            <div className="hidden lg:block">
                <DesktopStudentDashboard />
            </div>
        </>
    );
};

export default StudentDashboard;