import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const DashboardLeaderboard = () => {
    const { currentUser } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('http://localhost:5000/api/leaderboard/institute?limit=5', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            setLeaderboard(data.leaderboard || []);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            // Fallback data when backend is not available
            setLeaderboard([
                { name: 'Alice Johnson', ecoPoints: 850, rank: 1 },
                { name: 'Bob Smith', ecoPoints: 720, rank: 2 },
                { name: 'Carol Davis', ecoPoints: 680, rank: 3 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 2: return <Medal className="w-5 h-5 text-gray-400" />;
            case 3: return <Award className="w-5 h-5 text-amber-600" />;
            default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    {[1,2,3].map(i => (
                        <div key={i} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Top Eco-Warriors</h3>
                <button className="text-green-500 text-sm font-medium">View All</button>
            </div>
            
            {leaderboard.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No rankings available yet</p>
            ) : (
                <div className="space-y-3">
                    {leaderboard.map((user, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                            <div className="flex-shrink-0">
                                {getRankIcon(user.rank)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.class || 'Student'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-green-600">{user.ecoPoints}</p>
                                <p className="text-xs text-gray-400">points</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardLeaderboard;