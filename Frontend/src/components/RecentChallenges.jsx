import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { apiRequest } from '../services/api';

const RecentChallenges = ({ limit = 3, className = '', showInMainArea = false, refreshTrigger = 0 }) => {
    const { currentUser, userRole } = useAuth();
    const location = useLocation();
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentChallenges();
    }, [currentUser, refreshTrigger, location.state?.refresh]);

    const fetchRecentChallenges = async () => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        try {
            const token = await currentUser.getIdToken();
            const data = await apiRequest('/api/challenges/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Sort by createdAt and take the most recent ones
            const sortedChallenges = (data.challenges || [])
                .sort((a, b) => {
                    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
                    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
                    return dateB - dateA;
                })
                .slice(0, limit);
            
            setChallenges(sortedChallenges);
        } catch (error) {
            console.error('Error fetching recent challenges:', error);
            setChallenges([]);
        } finally {
            setLoading(false);
        }
    };

    const getChallengeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'physical':
                return '🏃';
            case 'video':
                return '🎥';
            case 'quiz_auto':
            case 'quiz_manual':
                return '📝';
            default:
                return '🎯';
        }
    };

    const getChallengeTypeLabel = (type) => {
        const typeStr = type?.toLowerCase();
        // Hide auto/manual distinction from students
        if (typeStr === 'quiz_auto' || typeStr === 'quiz_manual') {
            return 'Quiz';
        }
        // Capitalize first letter for other types
        return type?.charAt(0).toUpperCase() + type?.slice(1) || 'Challenge';
    };

    const getChallengeLink = (challenge) => {
        const type = challenge.type?.toLowerCase();
        if (type === 'quiz_auto' || type === 'quiz_manual') {
            return `/quiz/${challenge.id}`;
        }
        return `/challenge/${challenge.id}`;
    };

    if (loading) {
        if (showInMainArea) {
            return (
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return (
            <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm ${className}`}>
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!currentUser || challenges.length === 0) {
        return null;
    }

    // Main area layout (grid cards)
    if (showInMainArea) {
        return (
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span className="material-icons text-blue-500">new_releases</span>
                        Recent Challenges
                    </h2>
                    <Link to="/challenges" className="text-sm font-medium text-primary hover:underline">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {challenges.map((challenge) => (
                        <Link
                            key={challenge.id}
                            to={getChallengeLink(challenge)}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-start gap-4 mb-3">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                    {getChallengeIcon(challenge.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-1 line-clamp-2">
                                        {challenge.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {getChallengeTypeLabel(challenge.type)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {challenge.category || 'General'}
                                </span>
                                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                                    arrow_forward
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    // Sidebar layout (compact list)
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-500">new_releases</span>
                    Recent Challenges
                </h3>
                <Link to="/challenges" className="text-green-500 text-sm font-medium hover:underline">
                    View All
                </Link>
            </div>

            <div className="space-y-3">
                {challenges.map((challenge) => (
                    <Link
                        key={challenge.id}
                        to={getChallengeLink(challenge)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                            {getChallengeIcon(challenge.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                                {challenge.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {getChallengeTypeLabel(challenge.type)} • {challenge.category || 'General'}
                            </p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-green-500 transition-colors">
                            arrow_forward
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentChallenges;
