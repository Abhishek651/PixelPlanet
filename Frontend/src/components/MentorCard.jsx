import React from 'react';
import { motion } from 'framer-motion';

const MentorCard = ({ mentor, onFollow }) => {
    const { name, role = 'Mentor', avatar, isOnline = false, isFollowing = false } = mentor;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
        >
            <div className="flex items-center gap-3">
                {/* Avatar with online indicator */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center overflow-hidden">
                        {avatar ? (
                            <img src={avatar} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white font-semibold text-lg">
                                {name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                </div>

                {/* Mentor info */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white">{name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
                </div>
            </div>

            {/* Follow button */}
            <button
                onClick={() => onFollow && onFollow(mentor)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${isFollowing
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        : 'bg-primary text-white hover:bg-primary-light'
                    }`}
            >
                <span className="flex items-center gap-1">
                    <span className="material-icons text-sm">
                        {isFollowing ? 'check' : 'person_add'}
                    </span>
                    {isFollowing ? 'Following' : 'Follow'}
                </span>
            </button>
        </motion.div>
    );
};

export default MentorCard;
