import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsCard = ({ title, value, change, icon, color = 'primary', chart }) => {
    const isPositive = change >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{value}</h3>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${color === 'primary' ? 'from-primary to-green-600' :
                        color === 'blue' ? 'from-blue-400 to-cyan-600' :
                            color === 'orange' ? 'from-orange-400 to-red-500' :
                                'from-purple-400 to-pink-600'
                    } rounded-xl flex items-center justify-center`}>
                    <span className="material-icons text-white">{icon}</span>
                </div>
            </div>

            {change !== undefined && (
                <div className="flex items-center gap-2">
                    <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                        <span className="material-icons text-sm">
                            {isPositive ? 'trending_up' : 'trending_down'}
                        </span>
                        {Math.abs(change)}%
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
                </div>
            )}

            {chart && (
                <div className="mt-4 h-16">
                    {chart}
                </div>
            )}
        </motion.div>
    );
};

export default AnalyticsCard;
