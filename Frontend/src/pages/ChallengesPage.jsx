import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import SegmentedControl from '../components/SegmentedControl';
import LeaderboardAvatar from '../components/LeaderboardAvatar';
import LeaderboardListItem from '../components/LeaderboardListItem';
import BottomNavbar from '../components/BottomNavbar';

const ChallengesPage = () => {
    const { currentUser } = useAuth();
    const [activeSegment, setActiveSegment] = useState('friends');
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    const segments = [
        { id: 'my_challenges', label: 'My challenges' },
        { id: 'friends', label: 'Friends' },
    ];

    const myChallengesData = [
        { id: 'mc1', name: 'Daily Eco-Quiz', value: 150, description: 'Complete today\'s eco-quiz' },
        { id: 'mc2', name: 'Recycle 5 items', value: 200, description: 'Log 5 recycled items' },
        { id: 'mc3', name: 'Use public transport', value: 100, description: 'Commute green' },
    ];

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('http://localhost:5000/api/leaderboard/institute', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setLeaderboard(data.leaderboard || []);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-background text-dark-text-primary font-body relative pb-20">
            {/* Top Gradient Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-b from-dark-gradient-start to-dark-gradient-end p-6 pb-12 rounded-b-3xl shadow-dark-deep"
            >
                <div className="flex items-center justify-between mb-4">
                    <button className="material-symbols-outlined text-dark-text-primary text-2xl">arrow_back_ios</button>
                    <span className="material-symbols-outlined text-dark-text-primary text-2xl">more_vert</span>
                </div>
                <h1 className="text-3xl font-bold font-display text-dark-text-primary mb-2">Challenges</h1>
                <p className="text-sm text-dark-text-secondary">
                    Track your eco-journey and compete with friends to make a positive environmental impact.
                </p>
            </motion.div>

            {/* Segmented Control */}
            <div className="relative z-10 -mt-8 mb-6">
                <SegmentedControl
                    segments={segments}
                    activeSegment={activeSegment}
                    onSegmentChange={setActiveSegment}
                />
            </div>

            <main className="px-4">
                {activeSegment === 'friends' && (
                    <motion.div
                        key="friends-content"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-accent-green"></div>
                            </div>
                        ) : (
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
                        )}
                    </motion.div>
                )}

                {activeSegment === 'my_challenges' && (
                    <motion.div
                        key="my-challenges-content"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-4 pt-4"
                    >
                        {myChallengesData.map((challenge, index) => (
                            <motion.div
                                key={challenge.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-dark-surface rounded-xl p-4 shadow-dark-soft flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-dark-text-primary">{challenge.name}</h3>
                                    <p className="text-sm text-dark-text-secondary mt-1">{challenge.description}</p>
                                </div>
                                <span className="text-dark-accent-green font-bold text-lg">
                                    {challenge.value} EP
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>

            <BottomNavbar />
        </div>
    );
};

export default ChallengesPage;