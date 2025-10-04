// frontend/src/components/ChallengeTypeModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChallengeTypeModal = ({ isOpen, onClose }) => {
    const [challengeType, setChallengeType] = useState('physical');
    const [quizType, setQuizType] = useState('auto');
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleCreate = () => {
        onClose(); // Close the modal first
        switch (challengeType) {
            case 'quiz':
                if (quizType === 'auto') {
                    navigate('/create-auto-quiz');
                } else {
                    navigate('/create-manual-quiz');
                }
                break;
            case 'physical':
                navigate('/create-physical-challenge');
                break;
            case 'video':
                navigate('/create-video-challenge');
                break;
            default:
                console.error("Unknown challenge type");
        }
    };

    const RadioOption = ({ name, value, checked, onChange, label, children }) => (
        <div 
            className={`p-4 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${checked ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-500' : 'bg-white dark:bg-gray-800'}`}
            onClick={() => onChange(value)}
        >
            <label className="flex items-center space-x-4 cursor-pointer">
                <input 
                    type="radio" 
                    name={name} 
                    value={value} 
                    checked={checked} 
                    onChange={(e) => onChange(e.target.value)}
                    className="form-radio h-5 w-5 text-blue-600 dark:text-blue-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <span className="text-gray-800 dark:text-gray-200 font-medium">{label}</span>
            </label>
            {checked && children && (
                <div className="ml-9 mt-4 space-y-3">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Create a New Challenge</h2>
                
                <div className="space-y-4">
                    <RadioOption 
                        name="challengeType" 
                        value="physical" 
                        checked={challengeType === 'physical'} 
                        onChange={setChallengeType}
                        label="Physical Challenge"
                    />
                    <RadioOption 
                        name="challengeType" 
                        value="video" 
                        checked={challengeType === 'video'} 
                        onChange={setChallengeType}
                        label="Video Challenge"
                    />
                    <RadioOption 
                        name="challengeType" 
                        value="quiz" 
                        checked={challengeType === 'quiz'} 
                        onChange={setChallengeType}
                        label="Quiz Challenge"
                    >
                        <div className="flex items-center space-x-6">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="quizType" 
                                    value="auto" 
                                    checked={quizType === 'auto'} 
                                    onChange={() => setQuizType('auto')}
                                    className="form-radio h-4 w-4 text-blue-500"
                                />
                                <span className="text-gray-600 dark:text-gray-300">Auto-generate</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="quizType" 
                                    value="manual" 
                                    checked={quizType === 'manual'} 
                                    onChange={() => setQuizType('manual')}
                                    className="form-radio h-4 w-4 text-blue-500"
                                />
                                <span className="text-gray-600 dark:text-gray-300">Create Manually</span>
                            </label>
                        </div>
                    </RadioOption>
                </div>

                <div className="mt-10 flex justify-end space-x-4">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2.5 rounded-lg text-gray-800 dark:text-gray-200 bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreate} 
                        className="px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        Create Challenge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeTypeModal;
