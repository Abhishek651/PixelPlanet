import React from 'react';

const studentData = [
    { name: 'Amya Sharma', level: 'Lv 15', totalEP: '11,990 EP', badges: '5 Badges' },
    { name: 'Ben Carter', level: 'Lv 14', totalEP: '10,900 EP', badges: '4 Badges' },
    { name: 'Chloe Lee', level: 'Lv 12', totalEP: '9,500 EP', badges: '3 Badges' },
    { name: 'David Chen', level: 'Lv 10', totalEP: '8,750 EP', badges: '2 Badges' },
    { name: 'Ella Garcia', level: 'Lv 9', totalEP: '8,200 EP', badges: '2 Badges' },
    { name: 'Frank White', level: 'Lv 8', totalEP: '7,800 EP', badges: '1 Badge' },
    // Add more students as needed
];

const StudentPerformanceList = () => {
    return (
        <div className="glassmorphism p-6 rounded-lg shadow-soft-lg overflow-x-auto">
            <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark mb-4">Student Performance</h3>
            <table className="w-full text-left table-auto">
                <thead>
                    <tr className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <th className="py-2 px-4">Student Name</th>
                        <th className="py-2 px-4">Level</th>
                        <th className="py-2 px-4">Total EP</th>
                        <th className="py-2 px-4">Badges</th>
                    </tr>
                </thead>
                <tbody>
                    {studentData.map((student, index) => (
                        <tr key={index} className="text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                            <td className="py-2 px-4 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> {/* Status indicator */}
                                {student.name}
                            </td>
                            <td className="py-2 px-4">{student.level}</td>
                            <td className="py-2 px-4">{student.totalEP}</td>
                            <td className="py-2 px-4">{student.badges}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentPerformanceList;