import React from 'react';
import { motion } from 'framer-motion';

const LeaderboardListItem = ({ user, rank, delay = 0 }) => {
    const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=4CAF50&color=fff&size=48`;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + delay }}
            className="flex items-center bg-white rounded-xl p-3 shadow-soft mb-3"
        >
            <span className="text-gray-600 font-bold text-lg w-8 text-center flex-shrink-0">{rank}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden ml-3 flex-shrink-0">
                <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow ml-4">
                <p className="text-gray-800 font-semibold">{user.name}</p>
            </div>
            <p className="text-gray-800 text-right font-semibold">{user.ecoPoints} Eco-Points</p>
        </motion.div>
    );
};

export default LeaderboardListItem;