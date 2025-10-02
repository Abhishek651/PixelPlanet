import React, { useState } from 'react';

const ClassOverview = () => {
    const [selectedClass, setSelectedClass] = useState('5 B / saada - EcoWarriors');
    const classes = [
        '5 B / saada - EcoWarriors',
        '6 A / alsaud - GreenThumbs',
        '7 C / fatima - EarthKeepers'
    ];

    return (
        <div className="glassmorphism p-6 rounded-lg shadow-soft-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">Class Overview</h3>
                <div className="relative">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                    >
                        {classes.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                        <span className="material-symbols-outlined text-xl">arrow_drop_down</span>
                    </div>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">3 Std / saade - EcoWarriors</p>
        </div>
    );
};

export default ClassOverview;