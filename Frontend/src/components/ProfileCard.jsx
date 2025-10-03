import React from 'react';
import { motion } from 'framer-motion';

const ProfileCard = ({ title, children, variants }) => {
    return (
        <motion.div
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4"
            variants={variants}
        >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
            <div>{children}</div>
        </motion.div>
    );
};

export default ProfileCard;