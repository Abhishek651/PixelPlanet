
import React from 'react';
import { motion } from 'framer-motion';

const ProfileHeader = ({ user, role }) => {
    const getRoleBadgeColor = () => {
        switch (role) {
            case 'student':
                return 'bg-blue-500';
            case 'teacher':
                return 'bg-green-500';
            case 'admin':
                return 'bg-purple-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <motion.div
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <img
                className="w-24 h-24 rounded-full mr-6"
                src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`}
                alt="Profile Avatar"
            />
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.displayName || 'Anonymous User'}</h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                {role && (
                    <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold text-white rounded-full ${getRoleBadgeColor()}`}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export default ProfileHeader;
