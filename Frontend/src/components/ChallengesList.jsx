// frontend/src/components/ChallengesList.jsx
import React, { useState } from 'react';
import { ChevronDown, Edit, Eye, ClipboardCheck, Film, FileText } from 'lucide-react';
import { useChallenges } from '../context/ChallengeContext';

const ChallengesList = () => {
    const [expandedChallenge, setExpandedChallenge] = useState(null);
    const { challenges } = useChallenges(); // Use context

    const toggleChallenge = (id) => {
        setExpandedChallenge(expandedChallenge === id ? null : id);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Physical':
                return <ClipboardCheck className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'Video':
                return <Film className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
            case 'Quiz-Auto':
            case 'Quiz-Manual':
                return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Created Challenges</h2>
            <div className="space-y-4">
                {challenges.map((challenge) => (
                    <div key={challenge.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-shadow duration-300 hover:shadow-lg">
                        <div className="p-4 cursor-pointer" onClick={() => toggleChallenge(challenge.id)}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-full ${challenge.type.includes('Quiz') ? 'bg-blue-100 dark:bg-blue-900/50' : challenge.type === 'Physical' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-purple-100 dark:bg-purple-900/50'}`}>
                                        {getIcon(challenge.type)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{challenge.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.type} Challenge</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        challenge.status === 'Active' 
                                            ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                            : 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                        {challenge.status}
                                    </span>
                                    <ChevronDown className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform ${expandedChallenge === challenge.id ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                        </div>
                        {expandedChallenge === challenge.id && (
                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/60 rounded-b-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Assigned Classes</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.classes}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Completion Rate</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.completion} students</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end space-x-4">
                                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-all">
                                        <Edit size={16} />
                                        <span>Edit</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm hover:shadow-md transition-all">
                                        <Eye size={16} />
                                        <span>View Submissions</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChallengesList;