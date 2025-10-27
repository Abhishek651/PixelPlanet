import React from 'react';
import { motion } from 'framer-motion';

const LeaderboardAvatar = ({ user, rank, isKing = false, delay = 0 }) => {
    const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=A0A0A0&color=fff&size=96`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 + delay }}
            className="flex flex-col items-center relative p-2"
        >
            {isKing && (
                <motion.div
                    initial={{ opacity: 0, y: -20, rotate: -30 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 0.6 + delay }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-gold-crown text-4xl drop-shadow-md z-10"
                >
                    <span className="material-symbols-outlined fill-1" style={{ fontSize: '40px', WebkitTextStroke: '1px #B8860B' }}>
                        workspace_premium
                    </span>
                </motion.div>
            )}
            <div className={`relative w-20 h-20 rounded-full overflow-hidden border-2
                            ${isKing ? 'border-gold-crown shadow-lg shadow-gold-shadow/50' : 'border-gray-200'}
                            mb-2 flex items-center justify-center`}>
                <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                <span className={`absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                                ${isKing ? 'bg-gold-crown text-gray-800' : 'bg-primary'}`}>
                    {rank}
                </span>
            </div>
            <p className="text-gray-800 text-sm font-semibold mt-1">{user.name}</p>
            <p className="text-gray-600 text-xs">{user.ecoPoints} Eco-Points</p>
        </motion.div>
    );
};

export default LeaderboardAvatar;