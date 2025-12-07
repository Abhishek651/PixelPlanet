import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { DateTimePicker } from './base/DatePicker';

const ChallengeCreatorFAB = () => {
    const { currentUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [challengeType, setChallengeType] = useState('');
    const [formData, setFormData] = useState({
        title: '', description: '', targetClass: '', rewardPoints: 10,
        expiryDate: '', numQuestions: 5, difficulty: 'medium', questions: []
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await currentUser.getIdToken();
            const endpoints = {
                physical: '/api/challenges/create-physical',
                'quiz-auto': '/api/challenges/create-auto-quiz',
                'quiz-manual': '/api/challenges/create-manual-quiz'
            };

            await fetch(endpoints[challengeType], {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            setShowModal(false);
            setChallengeType('');
            setFormData({ title: '', description: '', targetClass: '', rewardPoints: 10, expiryDate: '', numQuestions: 5, difficulty: 'medium', questions: [] });
        } catch (error) {
            console.error('Error creating challenge:', error);
        }
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, { question: '', options: ['', '', '', ''], answer: '' }]
        }));
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full shadow-lg hover:scale-110 z-40"
            >
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {showModal && !challengeType && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Choose Challenge Type</h3>
                        <div className="space-y-3">
                            <button onClick={() => setChallengeType('physical')} className="w-full p-4 text-left border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">🏃</span>
                                    <div><h4 className="font-semibold">Physical Challenge</h4><p className="text-sm text-gray-600">Real-world activities</p></div>
                                </div>
                            </button>
                            <button onClick={() => setChallengeType('quiz-auto')} className="w-full p-4 text-left border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">🤖</span>
                                    <div><h4 className="font-semibold">Auto Quiz</h4><p className="text-sm text-gray-600">AI-generated questions</p></div>
                                </div>
                            </button>
                            <button onClick={() => setChallengeType('quiz-manual')} className="w-full p-4 text-left border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">✏️</span>
                                    <div><h4 className="font-semibold">Manual Quiz</h4><p className="text-sm text-gray-600">Custom questions</p></div>
                                </div>
                            </button>
                        </div>
                        <button onClick={() => setShowModal(false)} className="w-full mt-4 py-2 text-gray-600">Cancel</button>
                    </div>
                </div>
            )}

            {challengeType && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Create {challengeType.replace('-', ' ')} Challenge</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full border rounded-lg px-3 py-2" required />
                            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full border rounded-lg px-3 py-2" rows={3} required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Target Class" value={formData.targetClass} onChange={(e) => setFormData(prev => ({ ...prev, targetClass: e.target.value }))} className="border rounded-lg px-3 py-2" required />
                                <input type="number" placeholder="Reward Points" value={formData.rewardPoints} onChange={(e) => setFormData(prev => ({ ...prev, rewardPoints: parseInt(e.target.value) }))} className="border rounded-lg px-3 py-2" min="1" required />
                            </div>
                            <DateTimePicker
                                label="Expiry Date"
                                value={formData.expiryDate}
                                onChange={(value) => setFormData(prev => ({ ...prev, expiryDate: value }))}
                                required
                            />
                            
                            {challengeType === 'quiz-auto' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" placeholder="Questions" value={formData.numQuestions} onChange={(e) => setFormData(prev => ({ ...prev, numQuestions: parseInt(e.target.value) }))} className="border rounded-lg px-3 py-2" min="1" max="50" />
                                    <select value={formData.difficulty} onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))} className="border rounded-lg px-3 py-2">
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                            )}

                            {challengeType === 'quiz-manual' && (
                                <div>
                                    <button type="button" onClick={addQuestion} className="bg-primary text-white px-3 py-1 rounded mb-3">Add Question</button>
                                    {formData.questions.map((q, i) => (
                                        <div key={i} className="border rounded-lg p-4 mb-4">
                                            <input type="text" placeholder={`Question ${i + 1}`} value={q.question} onChange={(e) => {
                                                const newQuestions = [...formData.questions];
                                                newQuestions[i].question = e.target.value;
                                                setFormData(prev => ({ ...prev, questions: newQuestions }));
                                            }} className="w-full border rounded px-3 py-2 mb-3" />
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                {q.options.map((opt, j) => (
                                                    <input key={j} type="text" placeholder={`Option ${j + 1}`} value={opt} onChange={(e) => {
                                                        const newQuestions = [...formData.questions];
                                                        newQuestions[i].options[j] = e.target.value;
                                                        setFormData(prev => ({ ...prev, questions: newQuestions }));
                                                    }} className="border rounded px-3 py-2" />
                                                ))}
                                            </div>
                                            <select value={q.answer} onChange={(e) => {
                                                const newQuestions = [...formData.questions];
                                                newQuestions[i].answer = e.target.value;
                                                setFormData(prev => ({ ...prev, questions: newQuestions }));
                                            }} className="w-full border rounded px-3 py-2">
                                                <option value="">Select correct answer</option>
                                                {q.options.map((opt, j) => <option key={j} value={opt}>{opt || `Option ${j + 1}`}</option>)}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg">Create Challenge</button>
                                <button type="button" onClick={() => setChallengeType('')} className="px-4 py-2 text-gray-600">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChallengeCreatorFAB;