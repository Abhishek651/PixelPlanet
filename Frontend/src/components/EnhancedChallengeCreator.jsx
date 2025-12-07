import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { DateTimePicker } from './base/DatePicker';

const EnhancedChallengeCreator = () => {
    const { currentUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [challengeType, setChallengeType] = useState('');
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetClass: '',
        rewardPoints: 10,
        expiryDate: '',
        startDate: '',
        // Quiz specific
        numQuestions: 5,
        difficulty: 'medium',
        questions: [],
        // Video specific
        videoUrl: '',
        generateQuiz: false
    });

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('/api/challenges/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setChallenges(data.challenges);
            }
        } catch (error) {
            console.error('Error fetching challenges:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await currentUser.getIdToken();
            let endpoint = '';
            
            switch (challengeType) {
                case 'physical':
                    endpoint = '/api/challenges/create-physical';
                    break;
                case 'quiz-auto':
                    endpoint = '/api/challenges/create-auto-quiz';
                    break;
                case 'quiz-manual':
                    endpoint = '/api/challenges/create-manual-quiz';
                    break;
                case 'video':
                    endpoint = '/api/challenges/create-video-challenge';
                    break;
                default:
                    throw new Error('Invalid challenge type');
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowModal(false);
                setChallengeType('');
                setFormData({
                    title: '',
                    description: '',
                    targetClass: '',
                    rewardPoints: 10,
                    expiryDate: '',
                    startDate: '',
                    numQuestions: 5,
                    difficulty: 'medium',
                    questions: [],
                    videoUrl: '',
                    generateQuiz: false
                });
                fetchChallenges();
            }
        } catch (error) {
            console.error('Error creating challenge:', error);
        } finally {
            setLoading(false);
        }
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, {
                question: '',
                options: ['', '', '', ''],
                answer: ''
            }]
        }));
    };

    const updateQuestion = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => 
                i === index ? { ...q, [field]: value } : q
            )
        }));
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => 
                i === questionIndex 
                    ? { ...q, options: q.options.map((opt, j) => j === optionIndex ? value : opt) }
                    : q
            )
        }));
    };

    const toggleChallengeStatus = async (challengeId, isActive) => {
        try {
            const token = await currentUser.getIdToken();
            await fetch(`/api/challenges/${challengeId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isActive: !isActive })
            });
            fetchChallenges();
        } catch (error) {
            console.error('Error toggling challenge status:', error);
        }
    };

    const ChallengeTypeModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Choose Challenge Type</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => setChallengeType('physical')}
                            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🏃</span>
                                <div>
                                    <h4 className="font-semibold">Physical Challenge</h4>
                                    <p className="text-sm text-gray-600">Real-world environmental activities</p>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => setChallengeType('quiz-auto')}
                            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🤖</span>
                                <div>
                                    <h4 className="font-semibold">Auto Quiz</h4>
                                    <p className="text-sm text-gray-600">AI-generated quiz questions</p>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => setChallengeType('quiz-manual')}
                            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">✏️</span>
                                <div>
                                    <h4 className="font-semibold">Manual Quiz</h4>
                                    <p className="text-sm text-gray-600">Create custom quiz questions</p>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => setChallengeType('video')}
                            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🎥</span>
                                <div>
                                    <h4 className="font-semibold">Video Challenge</h4>
                                    <p className="text-sm text-gray-600">Video-based learning with optional quiz</p>
                                </div>
                            </div>
                        </button>
                    </div>
                    <button
                        onClick={() => setShowModal(false)}
                        className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    const ChallengeForm = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">
                            Create {challengeType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Challenge
                        </h3>
                        <button
                            onClick={() => setChallengeType('')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Common Fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Class</label>
                                <input
                                    type="text"
                                    value={formData.targetClass}
                                    onChange={(e) => setFormData(prev => ({ ...prev, targetClass: e.target.value }))}
                                    placeholder="e.g., Grade 10, Class A"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reward Points</label>
                                <input
                                    type="number"
                                    value={formData.rewardPoints}
                                    onChange={(e) => setFormData(prev => ({ ...prev, rewardPoints: parseInt(e.target.value) }))}
                                    min="1"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>

                        {/* Quiz-specific fields */}
                        {challengeType.includes('quiz') && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DateTimePicker
                                        label="Start Date"
                                        value={formData.startDate}
                                        onChange={(value) => setFormData(prev => ({ ...prev, startDate: value }))}
                                    />
                                    <DateTimePicker
                                        label="Expiry Date"
                                        value={formData.expiryDate}
                                        onChange={(value) => setFormData(prev => ({ ...prev, expiryDate: value }))}
                                        required
                                    />
                                </div>

                                {challengeType === 'quiz-auto' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
                                            <input
                                                type="number"
                                                value={formData.numQuestions}
                                                onChange={(e) => setFormData(prev => ({ ...prev, numQuestions: parseInt(e.target.value) }))}
                                                min="1"
                                                max="50"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                            <select
                                                value={formData.difficulty}
                                                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {challengeType === 'quiz-manual' && (
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="block text-sm font-medium text-gray-700">Questions</label>
                                            <button
                                                type="button"
                                                onClick={addQuestion}
                                                className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark"
                                            >
                                                Add Question
                                            </button>
                                        </div>
                                        {formData.questions.map((question, qIndex) => (
                                            <div key={qIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                                                <div className="mb-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Question {qIndex + 1}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={question.question}
                                                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mb-3">
                                                    {question.options.map((option, oIndex) => (
                                                        <input
                                                            key={oIndex}
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                            placeholder={`Option ${oIndex + 1}`}
                                                            className="border border-gray-300 rounded px-3 py-2"
                                                            required
                                                        />
                                                    ))}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Correct Answer
                                                    </label>
                                                    <select
                                                        value={question.answer}
                                                        onChange={(e) => updateQuestion(qIndex, 'answer', e.target.value)}
                                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                                        required
                                                    >
                                                        <option value="">Select correct answer</option>
                                                        {question.options.map((option, oIndex) => (
                                                            <option key={oIndex} value={option}>
                                                                {option || `Option ${oIndex + 1}`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Video-specific fields */}
                        {challengeType === 'video' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                                    <input
                                        type="url"
                                        value={formData.videoUrl}
                                        onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <DateTimePicker
                                    label="Expiry Date"
                                    value={formData.expiryDate}
                                    onChange={(value) => setFormData(prev => ({ ...prev, expiryDate: value }))}
                                />
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="generateQuiz"
                                        checked={formData.generateQuiz}
                                        onChange={(e) => setFormData(prev => ({ ...prev, generateQuiz: e.target.checked }))}
                                        className="mr-2"
                                    />
                                    <label htmlFor="generateQuiz" className="text-sm text-gray-700">
                                        Generate quiz questions based on video content
                                    </label>
                                </div>
                            </>
                        )}

                        {/* Physical challenge specific */}
                        {challengeType === 'physical' && (
                            <DateTimePicker
                                label="Expiry Date"
                                value={formData.expiryDate}
                                onChange={(value) => setFormData(prev => ({ ...prev, expiryDate: value }))}
                                required
                            />
                        )}

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Creating...' : 'Create Challenge'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setChallengeType('')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {/* Floating Action Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full shadow-lg hover:bg-primary-dark transition-all hover:scale-110 z-40"
                title="Create Challenge"
            >
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {/* Challenges List */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">My Challenges</h3>
                <div className="space-y-4">
                    {challenges.map((challenge) => (
                        <div key={challenge.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-lg">{challenge.title}</h4>
                                    <p className="text-gray-600 text-sm mb-2">{challenge.description}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>Type: {challenge.type}</span>
                                        <span>Class: {challenge.targetClass}</span>
                                        <span>Points: {challenge.rewardPoints}</span>
                                        <span>Enrolled: {challenge.enrolledStudents?.length || 0}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        challenge.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {challenge.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <button
                                        onClick={() => toggleChallengeStatus(challenge.id, challenge.isActive)}
                                        className="text-primary hover:text-primary-dark text-sm"
                                    >
                                        {challenge.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            {showModal && !challengeType && <ChallengeTypeModal />}
            {challengeType && <ChallengeForm />}
        </div>
    );
};

export default EnhancedChallengeCreator;