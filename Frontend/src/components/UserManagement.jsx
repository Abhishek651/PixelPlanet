import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { getUserFriendlyError } from '../utils/errorMessages';
import { logUserAction, logError, logApiRequest, logApiResponse } from '../utils/logger';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [institutes, setInstitutes] = useState([]);
    const [selectedInstitute, setSelectedInstitute] = useState(null);
    const [instituteDetails, setInstituteDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [filterRole, setFilterRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        
        logUserAction('Fetch users and institutes');
        
        try {
            const token = await auth.currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            logApiRequest('GET', '/api/auth/admin/users');
            logApiRequest('GET', '/api/auth/admin/institutes');
            
            const [usersRes, institutesRes] = await Promise.all([
                fetch(`${apiUrl}/api/auth/admin/users`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }),
                fetch(`${apiUrl}/api/auth/admin/institutes`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            ]);

            logApiResponse('GET', '/api/auth/admin/users', usersRes.status);
            logApiResponse('GET', '/api/auth/admin/institutes', institutesRes.status);

            if (!usersRes.ok || !institutesRes.ok) {
                throw new Error(`API error: ${usersRes.status} / ${institutesRes.status}`);
            }

            const usersData = await usersRes.json();
            const institutesData = await institutesRes.json();

            setUsers(usersData.users || []);
            setStats(usersData.stats || {});
            setInstitutes(institutesData.institutes || []);
        } catch (error) {
            logError('UserManagement', 'Failed to fetch data', error);
            setError(getUserFriendlyError(error, 'fetch'));
            alert('Failed to load data. Please check console for details.');
        } finally {
            setLoading(false);
        }
    };

    const fetchInstituteDetails = async (instituteId) => {
        try {
            const token = await auth.currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const res = await fetch(`${apiUrl}/api/auth/admin/institutes/${instituteId}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            
            const data = await res.json();
            setInstituteDetails(data);
            setSelectedInstitute(instituteId);
        } catch (error) {
            console.error('Error fetching institute details:', error);
            alert('Failed to load institute details');
        }
    };

    const deleteUser = async (userId, userName) => {
        if (!userId) {
            setError('Cannot delete user: Invalid user ID');
            return;
        }
        
        if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) return;

        setError('');
        setSuccess('');
        
        logUserAction('Delete user', { userId, userName });

        try {
            const token = await auth.currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            logApiRequest('DELETE', `/api/auth/admin/users/${userId}`);
            
            const res = await fetch(`${apiUrl}/api/auth/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            logApiResponse('DELETE', `/api/auth/admin/users/${userId}`, res.status);

            if (res.ok) {
                setSuccess('User deleted successfully');
                fetchData();
                if (selectedInstitute) fetchInstituteDetails(selectedInstitute);
            } else {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete user');
            }
        } catch (error) {
            logError('UserManagement', 'Failed to delete user', error);
            setError(getUserFriendlyError(error, 'delete'));
        }
    };

    const deleteInstitute = async (instituteId, instituteName) => {
        if (!confirm(`Are you sure you want to delete institute "${instituteName}" and ALL its users? This action cannot be undone.`)) return;

        setError('');
        setSuccess('');
        
        logUserAction('Delete institute', { instituteId, instituteName });

        try {
            const token = await auth.currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            logApiRequest('DELETE', `/api/auth/admin/institutes/${instituteId}`);
            
            const res = await fetch(`${apiUrl}/api/auth/admin/institutes/${instituteId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            logApiResponse('DELETE', `/api/auth/admin/institutes/${instituteId}`, res.status);

            if (res.ok) {
                setSuccess('Institute deleted successfully');
                setSelectedInstitute(null);
                setInstituteDetails(null);
                fetchData();
            } else {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete institute');
            }
        } catch (error) {
            logError('UserManagement', 'Failed to delete institute', error);
            setError(getUserFriendlyError(error, 'delete'));
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesSearch = !searchQuery || 
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                <StatCard title="Total Users" value={stats.total || 0} icon="group" color="blue" />
                <StatCard title="Global Users" value={stats.global || 0} icon="public" color="green" />
                <StatCard title="Students" value={stats.students || 0} icon="school" color="purple" />
                <StatCard title="Teachers" value={stats.teachers || 0} icon="person" color="orange" />
                <StatCard title="HODs" value={stats.hods || 0} icon="admin_panel_settings" color="red" />
                <StatCard title="Institutes" value={institutes.length || 0} icon="business" color="indigo" />
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 sm:space-x-2 border-b overflow-x-auto">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
                    Overview
                </TabButton>
                <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
                    All Users
                </TabButton>
                <TabButton active={activeTab === 'institutes'} onClick={() => setActiveTab('institutes')}>
                    Institutes
                </TabButton>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                        <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                        <div className="space-y-2">
                            {users.slice(0, 5).map(user => (
                                <UserRow key={user.uid} user={user} onDelete={deleteUser} compact />
                            ))}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                        <h3 className="text-lg font-semibold mb-4">Institutes</h3>
                        <div className="space-y-2">
                            {institutes.slice(0, 5).map((institute, index) => (
                                <InstituteRow 
                                    key={institute.instituteId || institute.id || index} 
                                    institute={institute} 
                                    onClick={() => {
                                        setActiveTab('institutes');
                                        fetchInstituteDetails(institute.instituteId || institute.id);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="all">All Roles</option>
                            <option value="global">Global</option>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="hod">HOD</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        {filteredUsers.map(user => (
                            <UserRow key={user.uid} user={user} onDelete={deleteUser} />
                        ))}
                    </div>
                </div>
            )}

            {/* Institutes Tab */}
            {activeTab === 'institutes' && (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow">
                        <h3 className="text-lg font-semibold mb-4">Institutes</h3>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto">
                            {institutes.length > 0 ? institutes.map((institute, index) => {
                                const instituteId = institute.instituteId || institute.id;
                                return (
                                    <InstituteRow
                                        key={instituteId || `institute-${index}`}
                                        institute={institute}
                                        onClick={() => instituteId && fetchInstituteDetails(instituteId)}
                                        selected={selectedInstitute === instituteId}
                                    />
                                );
                            }) : (
                                <p className="text-gray-500 text-sm">No institutes found</p>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        {instituteDetails ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl md:text-2xl font-bold break-words">{instituteDetails.institute.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{instituteDetails.institute.type}</p>
                                        <p className="text-sm text-gray-500">{instituteDetails.institute.location}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteInstitute(selectedInstitute, instituteDetails.institute.name)}
                                        className="px-3 py-2 text-sm md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 whitespace-nowrap"
                                    >
                                        Delete Institute
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <Section title="HODs" count={instituteDetails.hods.length}>
                                        {instituteDetails.hods.map(user => (
                                            <UserRow key={user.uid} user={user} onDelete={deleteUser} />
                                        ))}
                                    </Section>
                                    <Section title="Teachers" count={instituteDetails.teachers.length}>
                                        {instituteDetails.teachers.map(user => (
                                            <UserRow key={user.uid} user={user} onDelete={deleteUser} />
                                        ))}
                                    </Section>
                                    <Section title="Students" count={instituteDetails.students.length}>
                                        {instituteDetails.students.map(user => (
                                            <UserRow key={user.uid} user={user} onDelete={deleteUser} />
                                        ))}
                                    </Section>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow flex items-center justify-center h-64">
                                <p className="text-gray-500 text-center">Select an institute to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow">
        <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">{title}</p>
                <p className="text-xl md:text-2xl font-bold">{value}</p>
            </div>
            <span className={`material-symbols-outlined text-2xl md:text-3xl text-${color}-500 ml-2`}>{icon}</span>
        </div>
    </div>
);

const TabButton = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
            active
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400'
        }`}
    >
        {children}
    </button>
);

const UserRow = ({ user, onDelete, compact = false }) => {
    const userId = user.uid || user.id;
    
    return (
        <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
            <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base truncate">{user.name}</p>
                    {!compact && <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>}
                </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                </span>
                {!compact && userId && (
                    <button
                        onClick={() => onDelete(userId, user.name)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete user"
                    >
                        <span className="material-symbols-outlined text-sm md:text-base">delete</span>
                    </button>
                )}
            </div>
        </div>
    );
};

const InstituteRow = ({ institute, onClick, selected = false }) => (
    <div
        onClick={onClick}
        className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selected
                ? 'bg-blue-100 dark:bg-blue-900'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
        }`}
    >
        <p className="font-medium">{institute.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
            {institute.studentCount} students, {institute.teacherCount} teachers
        </p>
    </div>
);

const Section = ({ title, count, children }) => (
    <div>
        <h4 className="text-lg font-semibold mb-3">
            {title} ({count})
        </h4>
        <div className="space-y-2">
            {children.length > 0 ? children : <p className="text-gray-500 text-sm">No {title.toLowerCase()} found</p>}
        </div>
    </div>
);

const getRoleBadgeColor = (role) => {
    const colors = {
        admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        hod: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        teacher: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        student: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        global: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
};

export default UserManagement;
