// frontend/src/components/ChallengesList.jsx
import React, { useState } from 'react';
import { ChevronDown, Edit, Eye, ClipboardCheck, Film, FileText, Loader, Trash2 } from 'lucide-react';
import { useChallenges } from '../context/useChallenges';
import { useAuth } from '../context/useAuth';
import SegmentedControl from './SegmentedControl';

import { useNavigate } from 'react-router-dom';

import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const ChallengesList = ({ challenges: propChallenges }) => {
    const { challenges: contextChallenges, isLoading, error, setChallenges, clearError } = useChallenges();
    const { userRole } = useAuth();
    const [expandedChallenge, setExpandedChallenge] = useState(null);
    const [activeTab, setActiveTab] = useState('active');
    const navigate = useNavigate();
    
    // Use prop challenges if provided, otherwise use context challenges
    const challenges = propChallenges || contextChallenges;

    // Filter challenges by active/expired status
    const now = new Date();
    const activeChallenges = challenges.filter(challenge => {
        if (!challenge.expiryDate) return true; // No expiry date means always active
        const expiryDate = challenge.expiryDate?.toDate?.() || new Date(challenge.expiryDate);
        return expiryDate > now;
    });
    
    const expiredChallenges = challenges.filter(challenge => {
        if (!challenge.expiryDate) return false; // No expiry date means never expired
        const expiryDate = challenge.expiryDate?.toDate?.() || new Date(challenge.expiryDate);
        return expiryDate <= now;
    });

    // Get challenges to display based on active tab
    const displayChallenges = activeTab === 'active' ? activeChallenges : expiredChallenges;

    const canEdit = userRole === 'teacher' || userRole === 'hod' || userRole === 'admin';

    // Tabs for teachers only
    const challengeTabs = canEdit ? [
        { id: 'active', label: 'Active' },
        { id: 'expired', label: 'Expired' },
    ] : null;

    const toggleChallenge = (id) => {
        setExpandedChallenge(expandedChallenge === id ? null : id);
    };

    const handleStartChallenge = (challenge) => {
        console.log('Starting challenge:', challenge);
        console.log('Challenge type:', challenge.type);
        console.log('Challenge ID:', challenge.id);
        
        if (!challenge.id) {
            console.error('Challenge ID is missing!');
            alert('Error: Challenge ID is missing. Please refresh and try again.');
            return;
        }
        
        const challengeType = challenge.type?.toLowerCase() || '';
        
        if (challengeType === 'quiz_auto' || challengeType === 'quiz_manual') {
            console.log('Navigating to quiz page:', `/quiz/${challenge.id}`);
            navigate(`/quiz/${challenge.id}`);
        } else {
            console.log('Navigating to challenge detail page:', `/challenge/${challenge.id}`);
            navigate(`/challenge/${challenge.id}`);
        }
    };

    const handleDeleteChallenge = async (challengeId) => {
        if (!window.confirm('Are you sure you want to delete this challenge?')) return;
        
        try {
            await deleteDoc(doc(db, 'challenges', challengeId));
            setChallenges(challenges.filter(c => c.id !== challengeId));
        } catch (error) {
            console.error("Error deleting challenge:", error.message || error);
            alert("Failed to delete challenge. Please try again.");
        }
    };

    const getIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'physical':
                return <ClipboardCheck className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'video':
                return <Film className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
            case 'quiz_auto':
            case 'quiz_manual':
                return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
            default:
                return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
        }
    };

    const getChallengeStatus = (challenge) => {
        if (!challenge.expiryDate) return 'active'; // No expiry date means always active
        const expiryDate = challenge.expiryDate?.toDate?.() || new Date(challenge.expiryDate);
        return expiryDate > now ? 'active' : 'expired';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-10">
                <Loader className="animate-spin w-8 h-8 text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-6">
                <p className="text-red-800 dark:text-red-200">{error}</p>
                <button onClick={clearError} className="mt-2 text-red-600 hover:text-red-800 underline">
                    Dismiss
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {canEdit ? 'Created Challenges' : 'Assigned Challenges'}
            </h2>
            
            {/* Tabs for teachers */}
            {challengeTabs && (
                <div className="mb-6">
                    <SegmentedControl
                        segments={challengeTabs}
                        activeSegment={activeTab}
                        onSegmentChange={setActiveTab}
                    />
                </div>
            )}
            
            {displayChallenges.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="material-icons text-gray-400 text-2xl">assignment</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                        No {activeTab} challenges found
                    </p>
                    {activeTab === 'active' && canEdit && (
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                            Create your first challenge to get started!
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {displayChallenges.map((challenge) => {
                        const challengeStatus = getChallengeStatus(challenge);
                        return (
                            <div key={challenge.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-shadow duration-300 hover:shadow-lg">
                                <div className="p-4 cursor-pointer" onClick={() => toggleChallenge(challenge.id)}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-full ${challenge.type.includes('Quiz') ? 'bg-blue-100 dark:bg-blue-900/50' : challenge.type === 'Physical' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-purple-100 dark:bg-purple-900/50'}`}>
                                                {getIcon(challenge.type)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{challenge.title || 'Untitled Challenge'}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.type} Challenge</p>
                                                {challengeStatus === 'expired' && challenge.expiryDate && (
                                                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                                                        Expired: {(challenge.expiryDate?.toDate?.() || new Date(challenge.expiryDate)).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                challengeStatus === 'active'
                                                    ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                    : 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                {challengeStatus === 'active' ? 'Active' : 'Expired'}
                                            </span>
                                            <ChevronDown className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform ${expandedChallenge === challenge.id ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </div>
                                {expandedChallenge === challenge.id && (
                                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/60 rounded-b-lg">
                                        {(challenge.generationMethod === 'paragraph' || challenge.generateParagraph) && challenge.paragraph && (
                                            <div className="mb-6">
                                                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Read the paragraph below and then start the quiz.</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{challenge.paragraph}</p>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Assigned Classes</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{Array.isArray(challenge.classes) ? challenge.classes.join(', ') : challenge.classes}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Reward Points</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.rewardPoints}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end space-x-4">
                                            {canEdit ? (
                                                <>
                                                    <button 
                                                        onClick={(e) => e.stopPropagation()} 
                                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-all"
                                                    >
                                                        <Edit size={16} />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => e.stopPropagation()} 
                                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm hover:shadow-md transition-all"
                                                    >
                                                        <Eye size={16} />
                                                        <span>View Submissions</span>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteChallenge(challenge.id);
                                                        }} 
                                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold shadow-sm hover:shadow-md transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                        <span>Delete</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStartChallenge(challenge);
                                                    }} 
                                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 font-semibold shadow-sm hover:shadow-md transition-all"
                                                >
                                                    <span>Start Challenge</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ChallengesList;