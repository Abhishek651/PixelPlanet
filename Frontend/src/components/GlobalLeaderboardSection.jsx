import React from 'react';

const LeaderboardItem = ({ rank, name, points, avatar }) => (
    <div className="flex items-center p-4 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft">
        <span className="text-2xl font-bold w-12 text-primary">{rank}</span>
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
        <div className="ml-4">
            <h4 className="text-lg font-bold text-text-light dark:text-text-dark">{name}</h4>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">{points} Eco Points</p>
        </div>
    </div>
);

const GlobalLeaderboardSection = () => {
    const leaderboardData = [
        { rank: 1, name: "Greta T.", points: 12500, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop" },
        { rank: 2, name: "Leo D.", points: 11200, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop" },
        { rank: 3, name: "David A.", points: 10800, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop" },
        { rank: 4, name: "Jane G.", points: 9500, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" },
        { rank: 5, name: "Mark R.", points: 8700, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop" },
    ];

    return (
        <section className="py-12 md:py-20">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-center text-text-light dark:text-text-dark">Global Leaderboard</h2>
            <p className="mt-4 text-lg text-center text-text-secondary-light dark:text-text-secondary-dark">See who is making the biggest impact on a global scale.</p>
            <div className="mt-12 max-w-2xl mx-auto space-y-4">
                {leaderboardData.map((user) => (
                    <LeaderboardItem key={user.rank} {...user} />
                ))}
            </div>
        </section>
    );
};

export default GlobalLeaderboardSection;