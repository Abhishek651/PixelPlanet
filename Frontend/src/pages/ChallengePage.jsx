import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import SegmentedControl from '../components/SegmentedControl';
import LeaderboardAvatar from '../components/LeaderboardAvatar';
import LeaderboardListItem from '../components/LeaderboardListItem';
import DashboardLayout from '../components/DashboardLayout';
import ChallengesList from '../components/ChallengesList';
import ChallengeCreatorFAB from '../components/ChallengeCreatorFAB';
import ChallengeTypeModal from '../components/ChallengeTypeModal';
import LoginPromptModal from '../components/LoginPromptModal';
import { leaderboardAPI } from '../services/api';

const ChallengePage = () => {
    const { currentUser, userRole } = useAuth();
    const [activeSegment, setActiveSegment] = useState('leaderboard');
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const segments = [
        { id: 'challenges', label: 'Challenges' },
        { id: 'leaderboard', label: 'Leaderboard' },
    ];

    useEffect(() => {
        if (activeSegment === 'leaderboard') {
            fetchLeaderboard();
        }
    }, [activeSegment]);

    const fetchLeaderboard = async () => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        
        try {
            const token = await currentUser.getIdToken();
            const data = await leaderboardAPI.getInstitute(token);
            setLeaderboard(data.leaderboard || []);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            // Fallback data when backend is not available
            setLeaderboard([
                { name: 'Alice Johnson', ecoPoints: 850, rank: 1 },
                { name: 'Bob Smith', ecoPoints: 720, rank: 2 },
                { name: 'Carol Davis', ecoPoints: 680, rank: 3 },
                { name: 'David Wilson', ecoPoints: 540, rank: 4 },
                { name: 'Emma Brown', ecoPoints: 420, rank: 5 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-body relative pb-20">
            {/* Top Gradient Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                // cancel DashboardLayout's padding so this header spans the full width of the layout container
                // and match the parent's top rounded corners so no white gaps are visible at the sides
                className="bg-gradient-to-b from-primary to-primary-light p-6 pb-12 rounded-t-2xl rounded-b-3xl shadow-soft-lg -mx-6 lg:-mx-8 -mt-6 lg:-mt-8"
            >
                <div className="flex items-center justify-between mb-4">
                    <button className="material-symbols-outlined text-white text-2xl">arrow_back_ios</button>
                    <span className="material-symbols-outlined text-white text-2xl">more_vert</span>
                </div>
                <h1 className="text-3xl font-bold font-display text-white mb-2">Challenges</h1>
                <p className="text-sm text-white/80">
                    Track your eco-journey and compete with friends to make a positive environmental impact.
                </p>
            </motion.div>

            {/* Segmented Control */}
            {/* keep segmented control flush with the header edge by compensating for parent padding */}
            <div className="relative z-10 -mt-8 mb-6 px-4 lg:px-6">
                <SegmentedControl
                    segments={segments}
                    activeSegment={activeSegment}
                    onSegmentChange={setActiveSegment}
                />
            </div>

            <main className="px-4">
                {activeSegment === 'leaderboard' && (
                    <motion.div
                        key="leaderboard-content"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : currentUser ? (
                            <>
                                {/* Top 3 Leaderboard Avatars */}
                                <div className="flex justify-around items-end mb-8 relative pt-4">
                                    {leaderboard[1] && (
                                        <LeaderboardAvatar user={leaderboard[1]} rank={2} delay={0.1} />
                                    )}
                                    {leaderboard[0] && (
                                        <LeaderboardAvatar user={leaderboard[0]} rank={1} isKing={true} delay={0} />
                                    )}
                                    {leaderboard[2] && (
                                        <LeaderboardAvatar user={leaderboard[2]} rank={3} delay={0.2} />
                                    )}
                                </div>

                                {/* Rest of Leaderboard List */}
                                <div className="space-y-3">
                                    {leaderboard.slice(3).map((user, index) => (
                                        <LeaderboardListItem
                                            key={user.name}
                                            user={user}
                                            rank={index + 4}
                                            delay={index * 0.05}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl text-gray-400">leaderboard</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Join the Competition!</h3>
                                <p className="text-gray-600 mb-6">Login to see your ranking and compete with eco-warriors worldwide</p>
                                <button 
                                    onClick={() => setShowLoginModal(true)}
                                    className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-light transition-colors"
                                >
                                    Get Started
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeSegment === 'challenges' && (
                    <motion.div
                        key="challenges-content"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4 }}
                        className="pt-4"
                    >
                        <div className="bg-white rounded-xl p-4 shadow-soft">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                {currentUser ? (userRole === 'teacher' ? 'Created Challenges' : 'Available Challenges') : 'Eco Challenges'}
                            </h2>
                            {currentUser ? (
                                <ChallengesList />
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-2xl text-gray-400">emoji_events</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">Login to access personalized challenges!</p>
                                    <button 
                                        onClick={() => setShowLoginModal(true)}
                                        className="bg-primary text-white px-6 py-2 rounded-lg font-semibold"
                                    >
                                        Login to Continue
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </main>

            {userRole === 'teacher' && (
                <>
                    <ChallengeCreatorFAB onClick={() => setModalOpen(true)} />
                    <ChallengeTypeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
                </>
            )}

            {/* Bottom navbar provided by DashboardLayout */}
            <LoginPromptModal 
                isOpen={showLoginModal} 
                onClose={() => setShowLoginModal(false)} 
            />
        </div>
    );
};

export default ChallengePage;
