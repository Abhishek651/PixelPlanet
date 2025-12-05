import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../services/api';

const CreatorDashboard = () => {
    const { currentUser, userRole } = useAuth();
    const navigate = useNavigate();
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const challengeTypes = [
        {
            id: 'physical',
            title: 'Physical Challenge',
            description: 'Create a real-world eco-activity challenge',
            icon: '🌱',
            path: '/create-physical-challenge'
        },
        {
            id: 'video',
            title: 'Video Challenge',
            description: 'Challenge students to create eco-awareness videos',
            icon: '🎥',
            path: '/create-video-challenge'
        },
        {
            id: 'auto-quiz',
            title: 'Auto Quiz',
            description: 'AI-generated quiz on environmental topics',
            icon: '🤖',
            path: '/create-auto-quiz'
        },
        {
            id: 'manual-quiz',
            title: 'Manual Quiz',
            description: 'Create your own custom quiz questions',
            icon: '✏️',
            path: '/create-manual-quiz'
        }
    ];

    useEffect(() => {
        fetchAnalytics();
    }, [currentUser]);

    const fetchAnalytics = async () => {
        if (!currentUser) return;
        try {
            console.log('Fetching creator analytics...');
            const token = await currentUser.getIdToken();
            const response = await api.get('/api/creator/analytics', token);
            console.log('Analytics response:', response);
            setAnalytics(response);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            console.error('Error details:', error.response?.data);
            // Set empty analytics on error so UI doesn't break
            setAnalytics({
                overview: {
                    totalChallenges: 0,
                    activeChallenges: 0,
                    completedChallenges: 0,
                    totalParticipants: 0,
                    totalStudents: 0,
                    totalEnrollments: 0,
                    totalSubmissions: 0,
                    participationRate: 0,
                    globalStudentsWithInstitute: 0,
                    globalStudentsWithoutInstitute: 0,
                },
                challengesByType: {
                    physical: 0,
                    quiz_auto: 0,
                    quiz_manual: 0,
                    video: 0
                },
                recentChallenges: [],
                topChallenges: [],
                participants: [],
            });
        } finally {
            setLoading(false);
        }
    };

    const stats = analytics ? [
        { 
            label: 'Challenges Created', 
            value: analytics.overview.totalChallenges, 
            icon: '📝', 
            color: 'bg-blue-500' 
        },
        { 
            label: 'Total Participants', 
            value: analytics.overview.totalParticipants, 
            icon: '👥', 
            color: 'bg-green-500',
            subtitle: `${analytics.overview.participationRate}% of ${analytics.overview.totalStudents} students`
        },
        { 
            label: 'Active Challenges', 
            value: analytics.overview.activeChallenges, 
            icon: '⚡', 
            color: 'bg-yellow-500' 
        },
        { 
            label: 'Total Submissions', 
            value: analytics.overview.totalSubmissions, 
            icon: '✅', 
            color: 'bg-purple-500' 
        },
        ...(userRole === 'creator' && !currentUser.instituteId ? [
            {
                label: 'Global Students',
                value: analytics.overview.totalStudents,
                icon: '🌍',
                color: 'bg-indigo-500',
                subtitle: `${analytics.overview.globalStudentsWithInstitute} with institute, ${analytics.overview.globalStudentsWithoutInstitute} without`
            }
        ] : [])
    ] : [
        { label: 'Challenges Created', value: '0', icon: '📝', color: 'bg-blue-500' },
        { label: 'Total Participants', value: '0', icon: '👥', color: 'bg-green-500' },
        { label: 'Active Challenges', value: '0', icon: '⚡', color: 'bg-yellow-500' },
        { label: 'Completed', value: '0', icon: '✅', color: 'bg-purple-500' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-0">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Creator Dashboard
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                                Welcome, {currentUser?.displayName || 'Creator'}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowChallengeModal(true)}
                            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base font-semibold"
                        >
                            <span className="material-symbols-outlined text-xl sm:text-2xl">add_circle</span>
                            <span className="hidden sm:inline">Create Challenge</span>
                            <span className="sm:hidden">Create</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                                <div className="h-20"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                        {stat.subtitle && (
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                {stat.subtitle}
                                            </p>
                                        )}
                                    </div>
                                    <div className={`${stat.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Participants List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Participants
                    </h2>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    ) : analytics && analytics.participants && analytics.participants.length > 0 ? (
                        <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                            {analytics.participants.map((participant) => (
                                <div
                                    key={participant.id}
                                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                >
                                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                                                {participant.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                {participant.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
                                group
                            </span>
                            <p className="text-gray-600 dark:text-gray-400">
                                No participants yet.
                            </p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <button
                            onClick={() => setShowChallengeModal(true)}
                            className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
                        >
                            <span className="material-symbols-outlined text-2xl sm:text-3xl text-gray-400 group-hover:text-green-500 flex-shrink-0">
                                add_circle
                            </span>
                            <div className="text-left">
                                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                    Create New Challenge
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    Start creating engaging content
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/challenges')}
                            className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                        >
                            <span className="material-symbols-outlined text-2xl sm:text-3xl text-gray-400 group-hover:text-blue-500 flex-shrink-0">
                                list_alt
                            </span>
                            <div className="text-left">
                                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                    View All Challenges
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    Manage your created challenges
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Challenge Type Breakdown */}
                {analytics && analytics.challengesByType && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Challenge Types
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-2xl sm:text-3xl mb-2">🌱</div>
                                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    {analytics.challengesByType.physical}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Physical</div>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div className="text-2xl sm:text-3xl mb-2">🎥</div>
                                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    {analytics.challengesByType.video}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Video</div>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="text-2xl sm:text-3xl mb-2">🤖</div>
                                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    {analytics.challengesByType.quiz_auto}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Auto Quiz</div>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <div className="text-2xl sm:text-3xl mb-2">✏️</div>
                                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    {analytics.challengesByType.quiz_manual}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Manual Quiz</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Challenges */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Recent Challenges
                    </h2>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    ) : analytics && analytics.recentChallenges && analytics.recentChallenges.length > 0 ? (
                        <div className="space-y-2 sm:space-y-3">
                            {analytics.recentChallenges.map((challenge) => {
                                const handleChallengeClick = () => {
                                    if (challenge.type === 'quiz_auto' || challenge.type === 'quiz_manual') {
                                        navigate(`/quiz/${challenge.id}`);
                                    } else {
                                        navigate(`/challenge/${challenge.id}`);
                                    }
                                };
                                
                                return (
                                <div
                                    key={challenge.id}
                                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                    onClick={handleChallengeClick}
                                >
                                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                                        <div className="text-xl sm:text-2xl flex-shrink-0">
                                            {challenge.type === 'physical' && '🌱'}
                                            {challenge.type === 'video' && '🎥'}
                                            {challenge.type === 'quiz_auto' && '🤖'}
                                            {challenge.type === 'quiz_manual' && '✏️'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                                                {challenge.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">group</span>
                                                    <span className="hidden sm:inline">{challenge.enrolledCount} enrolled</span>
                                                    <span className="sm:hidden">{challenge.enrolledCount}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">task_alt</span>
                                                    <span className="hidden sm:inline">{challenge.submissionsCount} submissions</span>
                                                    <span className="sm:hidden">{challenge.submissionsCount}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                        {challenge.isActive ? (
                                            <span className="px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                                <span className="hidden sm:inline">Active</span>
                                                <span className="sm:hidden">✓</span>
                                            </span>
                                        ) : (
                                            <span className="px-2 sm:px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-xs font-semibold rounded-full hidden sm:inline">
                                                Inactive
                                            </span>
                                        )}
                                        <span className="material-symbols-outlined text-gray-400 text-xl sm:text-2xl">
                                            chevron_right
                                        </span>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
                                inbox
                            </span>
                            <p className="text-gray-600 dark:text-gray-400">
                                No challenges yet. Create your first challenge to get started!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Challenge Type Modal */}
            {showChallengeModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                Create a Challenge
                            </h2>
                            <button
                                onClick={() => setShowChallengeModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex-shrink-0"
                            >
                                <span className="material-symbols-outlined text-2xl sm:text-3xl">close</span>
                            </button>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {challengeTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => {
                                        setShowChallengeModal(false);
                                        navigate(type.path);
                                    }}
                                    className="w-full p-4 sm:p-5 md:p-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-left group"
                                >
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <div className="text-3xl sm:text-4xl flex-shrink-0">{type.icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                                {type.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {type.description}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 text-xl sm:text-2xl">
                                            arrow_forward
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatorDashboard;
