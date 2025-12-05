import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { getUserFriendlyError } from '../utils/errorMessages';
import { logUserAction, logError, logApiRequest, logApiResponse } from '../utils/logger';

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('list');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        type: 'sub-admin', // 'sub-admin' or 'creator'
        permissions: {
            canManageUsers: false,
            canDeleteContent: false,
            canViewAnalytics: false,
            canCreateGlobalChallenges: false,
            canManageInstitutes: false
        }
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        setError('');
        
        logUserAction('Fetch admins list');
        
        try {
            const token = await auth.currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            logApiRequest('GET', '/api/admin/list-admins');
            
            const res = await fetch(`${apiUrl}/api/admin/list-admins`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            logApiResponse('GET', '/api/admin/list-admins', res.status);

            if (res.ok) {
                const data = await res.json();
                setAdmins(data.admins);
            } else {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch admins');
            }
        } catch (error) {
            logError('AdminManagement', 'Failed to fetch admins', error);
            setError(getUserFriendlyError(error, 'fetch'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setError('');
        setSuccess('');
        setLoading(true);
        
        logUserAction('Create admin', { type: formData.type, email: formData.email });
        
        try {
            const token = await auth.currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            const endpoint = formData.type === 'sub-admin' 
                ? '/api/admin/create-sub-admin'
                : '/api/admin/create-creator';
            
            const payload = formData.type === 'sub-admin'
                ? {
                    email: formData.email,
                    name: formData.name,
                    password: formData.password,
                    permissions: formData.permissions
                }
                : {
                    email: formData.email,
                    name: formData.name,
                    password: formData.password
                };

            logApiRequest('POST', endpoint, payload);

            const res = await fetch(`${apiUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            logApiResponse('POST', endpoint, res.status);

            if (res.ok) {
                setSuccess(`${formData.type === 'sub-admin' ? 'Sub-Admin' : 'Global Creator'} created successfully!`);
                setFormData({
                    email: '',
                    name: '',
                    password: '',
                    type: 'sub-admin',
                    permissions: {
                        canManageUsers: false,
                        canDeleteContent: false,
                        canViewAnalytics: false,
                        canCreateGlobalChallenges: false,
                        canManageInstitutes: false
                    }
                });
                fetchAdmins();
                setTimeout(() => setActiveTab('list'), 2000);
            } else {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create admin');
            }
        } catch (error) {
            logError('AdminManagement', 'Failed to create admin', error);
            setError(getUserFriendlyError(error, 'create'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId, name) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;

        setError('');
        setSuccess('');
        
        logUserAction('Delete admin', { userId, name });

        try {
            const token = await auth.currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            logApiRequest('DELETE', `/api/admin/remove-admin/${userId}`);
            
            const res = await fetch(`${apiUrl}/api/admin/remove-admin/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            logApiResponse('DELETE', `/api/admin/remove-admin/${userId}`, res.status);

            if (res.ok) {
                setSuccess('Admin deleted successfully');
                fetchAdmins();
            } else {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete admin');
            }
        } catch (error) {
            logError('AdminManagement', 'Failed to delete admin', error);
            setError(getUserFriendlyError(error, 'delete'));
        }
    };

    const handlePermissionChange = (permission) => {
        setFormData({
            ...formData,
            permissions: {
                ...formData.permissions,
                [permission]: !formData.permissions[permission]
            }
        });
    };

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

            {/* Tabs */}
            <div className="flex space-x-2 border-b">
                <TabButton active={activeTab === 'list'} onClick={() => setActiveTab('list')}>
                    Admin List
                </TabButton>
                <TabButton active={activeTab === 'create'} onClick={() => setActiveTab('create')}>
                    Create New
                </TabButton>
            </div>

            {/* List Tab */}
            {activeTab === 'list' && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Admins & Creators</h3>
                    
                    {/* Main Admins */}
                    <Section title="Main Admins">
                        {admins.filter(a => a.role === 'admin' && !a.createdBy).map(admin => (
                            <AdminCard key={admin.uid} admin={admin} onDelete={handleDelete} canDelete={false} />
                        ))}
                    </Section>

                    {/* Sub Admins */}
                    <Section title="Sub Admins">
                        {admins.filter(a => a.role === 'sub-admin').map(admin => (
                            <AdminCard key={admin.uid} admin={admin} onDelete={handleDelete} canDelete={true} />
                        ))}
                    </Section>

                    {/* Global Creators */}
                    <Section title="Global Creators">
                        {admins.filter(a => a.role === 'creator').map(admin => (
                            <AdminCard key={admin.uid} admin={admin} onDelete={handleDelete} canDelete={true} />
                        ))}
                    </Section>
                </div>
            )}

            {/* Create Tab */}
            {activeTab === 'create' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow max-w-2xl">
                    <h3 className="text-xl font-semibold mb-6">Create New Admin/Creator</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="sub-admin">Sub Admin</option>
                                <option value="creator">Global Creator</option>
                            </select>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Permissions (only for sub-admin) */}
                        {formData.type === 'sub-admin' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Permissions</label>
                                <div className="space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <PermissionCheckbox
                                        label="Manage Users"
                                        checked={formData.permissions.canManageUsers}
                                        onChange={() => handlePermissionChange('canManageUsers')}
                                    />
                                    <PermissionCheckbox
                                        label="Delete Content"
                                        checked={formData.permissions.canDeleteContent}
                                        onChange={() => handlePermissionChange('canDeleteContent')}
                                    />
                                    <PermissionCheckbox
                                        label="View Analytics"
                                        checked={formData.permissions.canViewAnalytics}
                                        onChange={() => handlePermissionChange('canViewAnalytics')}
                                    />
                                    <PermissionCheckbox
                                        label="Create Global Challenges"
                                        checked={formData.permissions.canCreateGlobalChallenges}
                                        onChange={() => handlePermissionChange('canCreateGlobalChallenges')}
                                    />
                                    <PermissionCheckbox
                                        label="Manage Institutes"
                                        checked={formData.permissions.canManageInstitutes}
                                        onChange={() => handlePermissionChange('canManageInstitutes')}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Create {formData.type === 'sub-admin' ? 'Sub Admin' : 'Global Creator'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

const TabButton = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-medium transition-colors ${
            active
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400'
        }`}
    >
        {children}
    </button>
);

const Section = ({ title, children }) => (
    <div>
        <h4 className="text-lg font-semibold mb-3">{title}</h4>
        <div className="space-y-2">
            {children.length > 0 ? children : <p className="text-gray-500 text-sm">No {title.toLowerCase()} found</p>}
        </div>
    </div>
);

const AdminCard = ({ admin, onDelete, canDelete }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                {admin.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
                <p className="font-medium">{admin.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{admin.email}</p>
                {admin.permissions && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(admin.permissions).filter(([_, v]) => v).map(([key]) => (
                            <span key={key} className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                                {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
        <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 text-xs rounded-full ${getRoleBadgeColor(admin.role)}`}>
                {admin.role}
            </span>
            {canDelete && (
                <button
                    onClick={() => onDelete(admin.uid, admin.name)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                    title="Delete"
                >
                    <span className="material-symbols-outlined text-sm">delete</span>
                </button>
            )}
        </div>
    </div>
);

const PermissionCheckbox = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-2 cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 text-blue-600 rounded"
        />
        <span className="text-sm">{label}</span>
    </label>
);

const getRoleBadgeColor = (role) => {
    const colors = {
        admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        'sub-admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        creator: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
};

export default AdminManagement;
