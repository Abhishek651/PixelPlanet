import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';

const HODDashboard = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState(null);
    const [pendingTeachers, setPendingTeachers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = await currentUser.getIdToken();
            const headers = { 'Authorization': `Bearer ${token}` };

            const [statsRes, teachersRes, analyticsRes] = await Promise.all([
                fetch('/api/auth/institute-stats', { headers }),
                fetch('/api/auth/pending-teachers', { headers }),
                fetch('/api/analytics/institute-analytics', { headers })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (teachersRes.ok) setPendingTeachers((await teachersRes.json()).teachers);
            if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const verifyTeacher = async (teacherId, approved) => {
        try {
            const token = await currentUser.getIdToken();
            await fetch(`/api/auth/verify-teacher/${teacherId}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved })
            });
            setPendingTeachers(prev => prev.filter(t => t.uid !== teacherId));
            fetchData();
        } catch (error) {
            console.error('Error verifying teacher:', error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Institute Dashboard</h1>
                <div className="flex space-x-2">
                    {['overview', 'teachers', 'analytics'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg ${activeTab === tab ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'teachers' && pendingTeachers.length > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">{pendingTeachers.length}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700">Teachers</h3>
                        <p className="text-3xl font-bold text-primary">{stats?.totalTeachers || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700">Students</h3>
                        <p className="text-3xl font-bold text-green-600">{stats?.totalStudents || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700">Eco Points</h3>
                        <p className="text-3xl font-bold text-yellow-600">{analytics?.overview?.totalEcoPoints || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700">Challenges</h3>
                        <p className="text-3xl font-bold text-blue-600">{analytics?.challengeStats?.active || 0}</p>
                    </div>
                </div>
            )}

            {activeTab === 'teachers' && (
                <div className="space-y-6">
                    {pendingTeachers.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-4">Pending Approvals</h3>
                            {pendingTeachers.map(teacher => (
                                <div key={teacher.uid} className="flex justify-between items-center p-4 border rounded-lg mb-4">
                                    <div>
                                        <h4 className="font-medium">{teacher.name}</h4>
                                        <p className="text-sm text-gray-600">{teacher.email} • {teacher.department}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => verifyTeacher(teacher.uid, true)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Approve</button>
                                        <button onClick={() => verifyTeacher(teacher.uid, false)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">All Teachers</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead><tr className="bg-gray-50"><th className="px-4 py-2 text-left">Name</th><th className="px-4 py-2 text-left">Email</th><th className="px-4 py-2 text-left">Department</th></tr></thead>
                                <tbody>{stats?.teachers?.map((teacher, i) => (
                                    <tr key={i} className="border-t"><td className="px-4 py-2">{teacher.name}</td><td className="px-4 py-2">{teacher.email}</td><td className="px-4 py-2">{teacher.department}</td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'analytics' && analytics && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Class Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(analytics.classStats || {}).map(([className, stats]) => (
                                <div key={className} className="p-4 border rounded-lg">
                                    <h4 className="font-medium">{className}</h4>
                                    <p className="text-sm text-gray-600">Students: {stats.count}</p>
                                    <p className="text-sm text-gray-600">Avg Points: {Math.round(stats.totalPoints / stats.count) || 0}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Top Performers</h3>
                        {analytics.topPerformers?.slice(0, 10).map((student, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2">
                                <div><h4 className="font-medium">{student.name}</h4><p className="text-sm text-gray-600">Class: {student.class}</p></div>
                                <span className="font-bold text-primary">{student.ecoPoints} points</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HODDashboard;