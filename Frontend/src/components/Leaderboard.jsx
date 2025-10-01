import React, { useState } from 'react';

const Leaderboard = () => {
    const [activeTab, setActiveTab] = useState('Class');

    // Placeholder leaderboard data
    const leaderboardData = [
        { id: 1, name: 'Jane Doe', ep: 5430, avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=ffb703&color=fff', rank: 1, rankColor: 'text-yellow-500' },
        { id: 2, name: 'Alex Ryder', ep: 5120, avatar: 'https://ui-avatars.com/api/?name=Alex+Ryder&background=343a40&color=fff', rank: 2, rankColor: 'text-gray-500 dark:text-gray-400' },
        { id: 3, name: 'Sam Wilson', ep: 4890, avatar: 'https://ui-avatars.com/api/?name=Sam+Wilson&background=fd8c00&color=fff', rank: 3, rankColor: 'text-orange-400' },
        { id: 4, name: 'Emily Clark', ep: 4500, avatar: 'https://ui-avatars.com/api/?name=Emily+Clark&background=007bff&color=fff', rank: 4, rankColor: 'text-text-light/70 dark:text-text-dark/70' },
        { id: 5, name: 'David Lee', ep: 4200, avatar: 'https://ui-avatars.com/api/?name=David+Lee&background=28a745&color=fff', rank: 5, rankColor: 'text-text-light/70 dark:text-text-dark/70' },
    ];

    return (
        <div className="glassmorphism rounded-lg p-6 flex-grow flex flex-col shadow-soft-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-display">Leaderboard</h3>
                <div className="flex space-x-2 bg-background-light dark:bg-background-dark/50 p-1 rounded-full text-sm">
                    <button
                        className={`px-4 py-2 rounded-full ${activeTab === 'Class' ? 'bg-primary text-white shadow-soft' : ''}`}
                        onClick={() => setActiveTab('Class')}
                    >
                        Class
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full ${activeTab === 'School' ? 'bg-primary text-white shadow-soft' : ''}`}
                        onClick={() => setActiveTab('School')}
                    >
                        School
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full ${activeTab === 'Global' ? 'bg-primary text-white shadow-soft' : ''}`}
                        onClick={() => setActiveTab('Global')}
                    >
                        Global
                    </button>
                </div>
            </div>
            <div className="space-y-3 overflow-y-auto">
                {leaderboardData.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center p-3 rounded-lg bg-green-200/30 dark:bg-green-700/30 shadow-soft"
                    >
                        <span className={`font-bold text-lg ${user.rankColor} mr-4 w-6 text-center`}>{user.rank}</span>
                        <img alt={user.name} className="w-10 h-10 rounded-full mr-4" src={user.avatar} />
                        <p className="font-semibold flex-grow">{user.name}</p>
                        <p className="font-bold text-primary">{user.ep} EP</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;