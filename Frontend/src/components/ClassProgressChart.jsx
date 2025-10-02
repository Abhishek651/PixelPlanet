import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Week 1', quests: 300 },
    { name: 'Week 2', quests: 500 },
    { name: 'Week 3', quests: 450 },
    { name: 'Week 4', quests: 600 },
    { name: 'Week 5', quests: 380 },
    { name: 'Week 6', quests: 550 },
];

const ClassProgressChart = () => {
    return (
        <div className="glassmorphism p-6 rounded-lg shadow-soft-lg">
            <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark mb-4">Class Progress - Weekly Quests Completed</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">2024</p>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs text-gray-500" />
                        <YAxis axisLine={false} tickLine={false} hide />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="quests" fill="#4CAF50" radius={[10, 10, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ClassProgressChart;