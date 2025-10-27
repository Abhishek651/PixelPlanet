import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';

const EnhancedHODDashboard = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState(null);
    const [pendingTeachers, setPendingTeachers] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
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
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const verifyTeacher = async (teacherId, approved) => {
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`/api/auth/verify-teacher/${teacherId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ approved })
            });

            if (response.ok) {
                setPendingTeachers(prev => prev.filter(t => t.uid !== teacherId));
                fetchDashboardData(); // Refresh stats
            }
        } catch (error) {
            console.error('Error verifying teacher:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Institute Dashboard</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'overview' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'teachers' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        Teachers {pendingTeachers.length > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">{pendingTeachers.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'analytics' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        Analytics
                    </button>
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stats Cards */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700">Total Teachers</h3>
                        <p className="text-3xl font-bold text-primary">{stats?.totalTeachers || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
                        <p className="text-3xl font-bold text-green-600">{stats?.totalStudents || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700">Total Eco Points</h3>
                        <p className="text-3xl font-bold text-yellow-600">{analytics?.overview?.totalEcoPoints || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700">Active Challenges</h3>
                        <p className="text-3xl font-bold text-blue-600">{analytics?.challengeStats?.active || 0}</p>
                    </div>

                    {/* Recent Activities */}
                    <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Recent Challenge Activities</h3>
                        <div className="space-y-3">
                            {analytics?.recentChallenges?.slice(0, 5).map((challenge, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium">{challenge.title}</h4>
                                        <p className="text-sm text-gray-600">Type: {challenge.type} • Enrolled: {challenge.enrolledCount}</p>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(challenge.createdAt?.seconds * 1000).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Teachers Tab */}
            {activeTab === 'teachers' && (
                <div className="space-y-6">
                    {/* Pending Teacher Approvals */}
                    {pendingTeachers.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-4">Pending Teacher Approvals</h3>
                            <div className="space-y-4">
                                {pendingTeachers.map((teacher) => (
                                    <div key={teacher.uid} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <h4 className="font-medium">{teacher.name}</h4>
                                            <p className="text-sm text-gray-600">{teacher.email}</p>
                                            <p className="text-sm text-gray-600">Department: {teacher.department}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => verifyTeacher(teacher.uid, true)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => verifyTeacher(teacher.uid, false)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Teachers List */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">All Teachers</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-2 text-left">Name</th>
                                        <th className="px-4 py-2 text-left">Email</th>
                                        <th className="px-4 py-2 text-left">Department</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.teachers?.map((teacher, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="px-4 py-2">{teacher.name}</td>
                                            <td className="px-4 py-2">{teacher.email}</td>
                                            <td className="px-4 py-2">{teacher.department}</td>
                                            <td className="px-4 py-2">
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                    Verified
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && analytics && (
                <div className="space-y-6">
                    {/* Class Performance Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Class Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(analytics.classStats || {}).map(([className, stats]) => (
                                <div key={className} className="p-4 border rounded-lg">
                                    <h4 className="font-medium">{className}</h4>
                                    <p className="text-sm text-gray-600">Students: {stats.count}</p>
                                    <p className="text-sm text-gray-600">Total Points: {stats.totalPoints}</p>
                                    <p className="text-sm text-gray-600">
                                        Avg Points: {Math.round(stats.totalPoints / stats.count) || 0}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Performers */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Top Performers</h3>
                        <div className="space-y-3">
                            {analytics.topPerformers?.map((student, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium">{student.name}</h4>
                                        <p className="text-sm text-gray-600">Class: {student.class}</p>
                                    </div>
                                    <span className="font-bold text-primary">{student.ecoPoints} points</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Challenge Statistics */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Challenge Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{analytics.challengeStats?.total || 0}</p>
                                <p className="text-sm text-gray-600">Total Challenges</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{analytics.challengeStats?.active || 0}</p>
                                <p className="text-sm text-gray-600">Active Challenges</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-purple-600">{analytics.challengeStats?.byType?.physical || 0}</p>
                                <p className="text-sm text-gray-600">Physical</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-orange-600">
                                    {(analytics.challengeStats?.byType?.quiz_auto || 0) + (analytics.challengeStats?.byType?.quiz_manual || 0)}
                                </p>
                                <p className="text-sm text-gray-600">Quizzes</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedHODDashboard;