import React from 'react';

const stats = [
    { icon: 'eco', value: 'Eco Activities', label: 'Real-World Impact' },
    { icon: 'leaderboard', value: 'Leaderboard', label: 'Global Competition' },
    { icon: 'videogame_asset', value: 'Green Games', label: 'Learn by Playing' },
];

const StatsSection = () => {
    return (
        <div className="glassmorphism p-8 rounded-2xl shadow-soft-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {stats.map((stat) => (
                    <div key={stat.label}>
                        <span className="material-symbols-outlined text-4xl text-primary">{stat.icon}</span>
                        <p className="text-2xl font-bold font-display mt-2 text-text-light dark:text-text-dark">{stat.value}</p>
                        <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsSection;