import React from 'react';
import { motion } from 'framer-motion';

const SegmentedControl = ({ segments, activeSegment, onSegmentChange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex p-1 bg-white rounded-2xl mx-auto shadow-soft w-11/12 md:w-auto"
        >
            {segments.map((segment) => (
                <button
                    key={segment.id}
                    onClick={() => onSegmentChange(segment.id)}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-colors duration-300
                                ${activeSegment === segment.id
                                    ? 'bg-primary text-white shadow-soft'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                >
                    {segment.label}
                </button>
            ))}
        </motion.div>
    );
};

export default SegmentedControl;