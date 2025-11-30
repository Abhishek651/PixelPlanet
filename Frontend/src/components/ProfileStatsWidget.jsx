import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';

const ProfileStatsWidget = () => {
    const { currentUser } = useAuth();
    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Explorer';
    const firstName = userName.split(' ')[0];

    // Mock data - replace with real data from your backend
    const stats = {
        completionRate: 52,
        weeklyProgress: [
            { day: '1-10 Aug', value: 30 },
            { day: '11-20 Aug', value: 45 },
            { day: '21-30 Aug', value: 60 }
        ],
        currentStreak: 7,
        totalPoints: 1250
    };

    const maxValue = Math.max(...stats.weeklyProgress.map(d => d.value));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    {/* Avatar with Progress Ring */}
                    <div className="relative">
                        <svg className="w-24 h-24 transform -rotate-90">
                            {/* Background circle */}
                            <circle
                                cx="48"
                                cy="48"
                                r="44"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                className="text-gray-200 dark:text-gray-700"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="48"
                                cy="48"
                                r="44"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 44}`}
                                strokeDashoffset={`${2 * Math.PI * 44 * (1 - stats.completionRate / 100)}`}
                                className="text-primary transition-all duration-1000"
                                strokeLinecap="round"
                            />
                        </svg>
                        {/* Avatar */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white text-2xl font-bold">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        {/* Percentage badge */}
                        <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                            {stats.completionRate}%
                        </div>
                    </div>

                    {/* Greeting */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Good Morning {firstName} 🔥
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Continue your learning to achieve your target!
                        </p>
                    </div>
                </div>

                {/* Menu button */}
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <span className="material-icons text-gray-400">more_vert</span>
                </button>
            </div>

            {/* Progress Chart */}
            <div className="mt-6">
                <div className="flex items-end justify-between h-32 gap-4">
                    {stats.weeklyProgress.map((item, index) => (
                        <motion.div
                            key={item.day}
                            initial={{ height: 0 }}
                            animate={{ height: `${(item.value / maxValue) * 100}%` }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="flex-1 flex flex-col items-center"
                        >
                            <div className="w-full bg-gradient-to-t from-primary to-green-400 rounded-t-lg relative group">
                                {/* Tooltip */}
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {item.value} points
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {item.day}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-orange-500">local_fire_department</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Streak</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-white">{stats.currentStreak} days</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-green-500">emoji_events</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Eco Points</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-white">{stats.totalPoints}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileStatsWidget;
