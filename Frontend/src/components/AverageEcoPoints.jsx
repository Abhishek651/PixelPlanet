import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

const data = [
    { name: 'Completed', value: 78 },
    { name: 'Remaining', value: 22 },
];
const COLORS = ['#4CAF50', '#E0E0E0']; // Green for completed, light gray for remaining

const AverageEcoPoints = () => {
    return (
        <div className="glassmorphism p-6 rounded-lg shadow-soft-lg flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark mb-4 text-center">Average Class Eco-Points</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">Weekly Quest Quett Completed</p>
            <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={0}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            <Label
                                value={`${data[0].value}%`}
                                position="center"
                                fill="#4CAF50"
                                className="font-bold text-3xl"
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AverageEcoPoints;