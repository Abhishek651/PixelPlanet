import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { useChallenges } from '../context/useChallenges';
import DashboardLayout from '../components/DashboardLayout';
import AnalyticsCard from '../components/AnalyticsCard';
import EcoBot from '../components/EcoBot';
import ChallengeTypeModal from '../components/ChallengeTypeModal';

const TeacherDashboard = () => {
    const { currentUser } = useAuth();
    const { challenges, refreshChallenges } = useChallenges();
    const navigate = useNavigate();
    const [showEcoBot, setShowEcoBot] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const teacherName = currentUser?.displayName || 'Teacher';

    useEffect(() => {
        // Refresh challenges when dashboard loads
        refreshChallenges();
    }, []);

    // Get recent challenges (last 3)
    const recentChallenges = challenges.slice(0, 3).map(challenge => ({
        id: challenge.id,
        title: challenge.title || 'Untitled Challenge',
        type: challenge.type || 'Unknown',
        submissions: challenge.submissions?.length || 0,
        totalStudents: 50, // You can calculate this based on classes
        avgScore: 0, // Calculate from submissions
        status: challenge.isActive ? 'active' : 'inactive'
    }));

    // Mock data - replace with real data from your backend
    const analytics = {
        totalStudents: 156,
        activeStudents: 142,
        completionRate: 78,
        avgScore: 85
    };

    const topPerformers = [
        { name: 'Emma Wilson', points: 2850, challenges: 12, avatar: null },
        { name: 'Liam Chen', points: 2720, challenges: 11, avatar: null },
        { name: 'Sophia Kumar', points: 2650, challenges: 10, avatar: null },
        { name: 'Noah Patel', points: 2580, challenges: 10, avatar: null },
        { name: 'Olivia Martinez', points: 2490, challenges: 9, avatar: null }
    ];

    const performanceData = [
        { week: 'Week 1', value: 65 },
        { week: 'Week 2', value: 72 },
        { week: 'Week 3', value: 78 },
        { week: 'Week 4', value: 85 }
    ];

    const maxValue = Math.max(...performanceData.map(d => d.value));

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Welcome back, {teacherName}! 👋
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Here's what's happening with your classes today
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors flex items-center gap-2"
                    >
                        <span className="material-icons">add</span>
                        Create Challenge
                    </button>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnalyticsCard
                        title="Total Students"
                        value={analytics.totalStudents}
                        change={12}
                        icon="group"
                        color="primary"
                    />
                    <AnalyticsCard
                        title="Active Students"
                        value={analytics.activeStudents}
                        change={8}
                        icon="trending_up"
                        color="blue"
                    />
                    <AnalyticsCard
                        title="Completion Rate"
                        value={`${analytics.completionRate}%`}
                        change={5}
                        icon="task_alt"
                        color="orange"
                    />
                    <AnalyticsCard
                        title="Average Score"
                        value={`${analytics.avgScore}%`}
                        change={3}
                        icon="star"
                        color="purple"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Performance & Challenges */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Class Performance Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                    Class Performance
                                </h3>
                                <select className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border-none focus:ring-2 focus:ring-primary">
                                    <option>Last 4 Weeks</option>
                                    <option>Last Month</option>
                                    <option>Last 3 Months</option>
                                </select>
                            </div>

                            {/* Bar Chart */}
                            <div className="flex items-end justify-between h-48 gap-4">
                                {performanceData.map((item, index) => (
                                    <div key={item.week} className="flex-1 flex flex-col items-center">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(item.value / maxValue) * 100}%` }}
                                            transition={{ delay: index * 0.1, duration: 0.5 }}
                                            className="w-full bg-gradient-to-t from-primary to-green-400 rounded-t-xl relative group"
                                        >
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {item.value}% avg
                                            </div>
                                        </motion.div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                            {item.week}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Challenges */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                    Recent Challenges
                                </h3>
                                <Link
                                    to="/challenges"
                                    className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
                                >
                                    View All
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {recentChallenges.map((challenge, index) => {
                                    const handleChallengeClick = () => {
                                        if (challenge.type === 'quiz_auto' || challenge.type === 'quiz_manual') {
                                            navigate(`/quiz/${challenge.id}`);
                                        } else {
                                            navigate(`/challenge/${challenge.id}`);
                                        }
                                    };
                                    
                                    return (
                                    <motion.div
                                        key={challenge.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={handleChallengeClick}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${challenge.type === 'Quiz' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                    challenge.type === 'Physical' ? 'bg-green-100 dark:bg-green-900/30' :
                                                        'bg-purple-100 dark:bg-purple-900/30'
                                                }`}>
                                                <span className={`material-icons ${challenge.type === 'Quiz' ? 'text-blue-600' :
                                                        challenge.type === 'Physical' ? 'text-green-600' :
                                                            'text-purple-600'
                                                    }`}>
                                                    {challenge.type === 'Quiz' ? 'quiz' :
                                                        challenge.type === 'Physical' ? 'landscape' :
                                                            'videocam'}
                                                </span>
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                                                    {challenge.title}
                                                </h4>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {challenge.submissions}/{challenge.totalStudents} submitted
                                                    </span>
                                                    <span className="text-xs font-medium text-primary">
                                                        Avg: {challenge.avgScore}%
                                                    </span>
                                                </div>
                                            </div>

                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${challenge.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                }`}>
                                                {challenge.status}
                                            </span>
                                        </div>

                                        <Link
                                            to={`/challenges/${challenge.id}/submissions`}
                                            className="ml-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Review
                                        </Link>
                                    </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Top Performers */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                    Top Performers
                                </h3>
                                <Link
                                    to="/students"
                                    className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
                                >
                                    View All
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {topPerformers.map((student, index) => (
                                    <motion.div
                                        key={student.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center gap-3"
                                    >
                                        {/* Rank */}
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                index === 1 ? 'bg-gray-100 text-gray-600' :
                                                    index === 2 ? 'bg-orange-100 text-orange-600' :
                                                        'bg-gray-50 text-gray-500'
                                            }`}>
                                            {index + 1}
                                        </div>

                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-semibold">
                                            {student.name.charAt(0)}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                                                {student.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {student.challenges} challenges • {student.points} pts
                                            </p>
                                        </div>

                                        {index < 3 && (
                                            <span className="material-icons text-yellow-500">emoji_events</span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                <Link
                                    to="/create-auto-quiz"
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <span className="material-icons text-primary">quiz</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Create Quiz
                                    </span>
                                </Link>
                                <Link
                                    to="/create-physical-challenge"
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <span className="material-icons text-primary">landscape</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Physical Challenge
                                    </span>
                                </Link>
                                <Link
                                    to="/create-video-challenge"
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <span className="material-icons text-primary">videocam</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Video Challenge
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Challenge Modal */}
            <ChallengeTypeModal 
                isOpen={showCreateModal} 
                onClose={() => setShowCreateModal(false)} 
            />

            {/* EcoBot */}
            <EcoBot isOpen={showEcoBot} onClose={() => setShowEcoBot(false)} />

            {/* Floating EcoBot Button */}
            <button
                onClick={() => setShowEcoBot(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-light text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
            >
                <span className="material-icons">smart_toy</span>
            </button>
        </DashboardLayout>
    );
};

export default TeacherDashboard;
