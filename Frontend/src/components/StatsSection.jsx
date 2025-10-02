import React from 'react';

const stats = [
    { icon: 'park', value: '12,450+', label: 'Trees Planted' },
    { icon: 'recycling', value: '8,970 kg', label: 'Waste Recycled' },
    { icon: 'school', value: '350+', label: 'Schools Joined' },
];

const StatsSection = () => {
    return (
        <div className="glassmorphism p-8 rounded-2xl shadow-soft-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {stats.map((stat) => (
                    <div key={stat.label}>
                        <span className="material-symbols-outlined text-5xl text-primary">{stat.icon}</span>
                        <p className="text-4xl font-bold font-display mt-2 text-text-light dark:text-text-dark">{stat.value}</p>
                        <p className="mt-1 text-text-secondary-light dark:text-text-secondary-dark">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsSection;