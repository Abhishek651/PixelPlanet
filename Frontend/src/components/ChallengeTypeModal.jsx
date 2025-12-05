// frontend/src/components/ChallengeTypeModal.jsx
// Version 2.0 - Updated design with 4 challenge cards
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChallengeTypeModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleNavigate = (path) => {
        console.log('ChallengeTypeModal: Navigating to', path);
        onClose();
        setTimeout(() => {
            navigate(path);
        }, 100); // Small delay to ensure modal closes first
    };

    const ChallengeCard = ({ title, description, icon, onClick }) => (
        <button
            onClick={(e) => {
                e.stopPropagation();
                console.log('Card clicked:', title);
                onClick();
            }}
            className="w-full p-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-left group"
        >
            <div className="flex items-center space-x-4">
                <div className="text-4xl">{icon}</div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {description}
                    </p>
                </div>
                <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-500 transition-colors">
                    arrow_forward
                </span>
            </div>
        </button>
    );

    return (
        <div 
            key="challenge-modal-v2"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create a Challenge</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <span className="material-symbols-outlined text-3xl">close</span>
                    </button>
                </div>
                
                <div className="space-y-4">
                    <ChallengeCard
                        title="Physical Challenge"
                        description="Create a real-world eco-activity challenge"
                        icon="🌱"
                        onClick={() => handleNavigate('/create-physical-challenge')}
                    />
                    
                    <ChallengeCard
                        title="Video Challenge"
                        description="Challenge students to create eco-awareness videos"
                        icon="🎥"
                        onClick={() => handleNavigate('/create-video-challenge')}
                    />
                    
                    <ChallengeCard
                        title="Auto Quiz"
                        description="AI-generated quiz on environmental topics"
                        icon="🤖"
                        onClick={() => handleNavigate('/create-auto-quiz')}
                    />
                    
                    <ChallengeCard
                        title="Manual Quiz"
                        description="Create your own custom quiz questions"
                        icon="✏️"
                        onClick={() => handleNavigate('/create-manual-quiz')}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChallengeTypeModal;
