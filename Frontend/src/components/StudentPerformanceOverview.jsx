import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const studentTrendData = [
    { name: 'W1', ep: 100 },
    { name: 'W2', ep: 150 },
    { name: 'W3', ep: 120 },
    { name: 'W4', ep: 200 },
    { name: 'W5', ep: 180 },
];

const topStudents = [
    { name: 'Alexa', score: 98 },
    { name: 'Roas', score: 95 },
    { name: 'South', score: 92 },
    { name: 'Taram', score: 90 },
];

const StudentPerformanceOverview = () => {
    return (
        <div className="glassmorphism p-6 rounded-lg shadow-soft-lg flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">Student Performance</h3>
                <span className="material-symbols-outlined text-gray-500">more_horiz</span>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Top Excelling Students</h4>
                <ul className="space-y-2">
                    {topStudents.map((student, index) => (
                        <li key={index} className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>{student.name}</span>
                            <span>{student.score}%</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Student Eco-Points Trend</h4>
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={studentTrendData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs text-gray-500" />
                            <YAxis hide domain={[0, 250]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="ep" stroke="#4CAF50" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StudentPerformanceOverview;