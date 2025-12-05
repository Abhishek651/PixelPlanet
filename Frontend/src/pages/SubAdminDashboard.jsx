import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import UserManagement from '../components/UserManagement';

const SubAdminDashboard = () => {
    const { currentUser } = useAuth();
    const [permissions, setPermissions] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPermissions();
    }, [currentUser]);

    const fetchPermissions = async () => {
        if (!currentUser) return;
        
        try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
                setPermissions(userDoc.data().permissions || {});
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!permissions) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Permissions</h2>
                    <p className="text-gray-600 dark:text-gray-400">Contact the main admin to set your permissions.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Sub-Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Welcome, {currentUser?.displayName || currentUser?.email}
                </p>
            </div>

            {/* Permissions Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <h2 className="text-lg font-semibold mb-4">Your Permissions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <PermissionBadge 
                        label="Manage Users" 
                        enabled={permissions.canManageUsers} 
                    />
                    <PermissionBadge 
                        label="Delete Content" 
                        enabled={permissions.canDeleteContent} 
                    />
                    <PermissionBadge 
                        label="View Analytics" 
                        enabled={permissions.canViewAnalytics} 
                    />
                    <PermissionBadge 
                        label="Create Global Challenges" 
                        enabled={permissions.canCreateGlobalChallenges} 
                    />
                    <PermissionBadge 
                        label="Manage Institutes" 
                        enabled={permissions.canManageInstitutes} 
                    />
                </div>
            </div>

            {/* Content based on permissions */}
            <div className="space-y-6">
                {permissions.canManageUsers && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">User Management</h2>
                        <UserManagement />
                    </div>
                )}

                {permissions.canViewAnalytics && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                        <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                        <p className="text-gray-600 dark:text-gray-400">Analytics dashboard coming soon...</p>
                    </div>
                )}

                {permissions.canCreateGlobalChallenges && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                        <h2 className="text-xl font-semibold mb-4">Global Challenges</h2>
                        <p className="text-gray-600 dark:text-gray-400">Create global challenges here...</p>
                    </div>
                )}

                {permissions.canManageInstitutes && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                        <h2 className="text-xl font-semibold mb-4">Institute Management</h2>
                        <p className="text-gray-600 dark:text-gray-400">Manage institutes here...</p>
                    </div>
                )}

                {/* If no permissions enabled */}
                {!Object.values(permissions).some(p => p) && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                            No Active Permissions
                        </h3>
                        <p className="text-yellow-700 dark:text-yellow-300">
                            You don't have any active permissions. Contact the main admin to grant you access.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PermissionBadge = ({ label, enabled }) => (
    <div className={`px-4 py-3 rounded-lg border-2 ${
        enabled 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-700' 
            : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
    }`}>
        <div className="flex items-center space-x-2">
            <span className={`material-symbols-outlined text-sm ${
                enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
            }`}>
                {enabled ? 'check_circle' : 'cancel'}
            </span>
            <span className={`text-sm font-medium ${
                enabled ? 'text-green-800 dark:text-green-200' : 'text-gray-600 dark:text-gray-400'
            }`}>
                {label}
            </span>
        </div>
    </div>
);

export default SubAdminDashboard;
