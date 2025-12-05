// frontend/src/pages/CreateManualQuizPage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowLeft, Plus, Trash2, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useAuth } from '../context/useAuth';
import { getUserFriendlyError, getValidationError } from '../utils/errorMessages';
import { logUserAction, logError, logApiRequest, logApiResponse } from '../utils/logger';

const CreateManualQuizPage = () => {
    const navigate = useNavigate();
    const { currentUser, userRole } = useAuth();
    const [title, setTitle] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [questions, setQuestions] = useState([{ text: '', options: ['', ''], correctAnswer: 0 }]);
    const [isGlobal, setIsGlobal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const classes = [
        { id: '1', name: 'Class A' },
        { id: '2', name: 'Class B' },
        { id: '3', name: 'Class C' },
    ];

    const handleClassChange = (e) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedClasses(values);
    };
    
    const handleQuestionChange = (index, text) => {
        const newQuestions = [...questions];
        newQuestions[index].text = text;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, text) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = text;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = oIndex;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', ''], correctAnswer: 0 }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push('');
        setQuestions(newQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, optIndex) => optIndex !== oIndex);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous messages
        setError('');
        setSuccess('');

        // Validation
        if (!currentUser) {
            setError('You must be logged in to create a quiz.');
            return;
        }

        if (!title.trim()) {
            setError(getValidationError('title', 'required'));
            return;
        }

        // Validate questions
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].text.trim()) {
                setError(`Question ${i + 1} text is required`);
                return;
            }
            if (questions[i].options.some(opt => !opt.trim())) {
                setError(`All options for Question ${i + 1} must be filled`);
                return;
            }
        }

        setLoading(true);
        logUserAction('Create manual quiz attempt', { title, questionCount: questions.length, isGlobal });

        try {
            const token = await currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            const payload = {
                title,
                targetClass: selectedClasses.join(',') || 'All',
                questions: questions,
                rewardPoints: 100,
                isGlobal: isGlobal && (userRole === 'admin' || userRole === 'creator')
            };

            logApiRequest('POST', '/api/challenges/create-manual-quiz', payload);

            const res = await fetch(`${apiUrl}/api/challenges/create-manual-quiz`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            logApiResponse('POST', '/api/challenges/create-manual-quiz', res.status);

            if (res.ok) {
                setSuccess('Manual quiz created successfully! Redirecting...');
                setTimeout(() => navigate('/challenges'), 1500);
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create quiz');
            }
        } catch (error) {
            logError('CreateManualQuizPage', 'Quiz creation failed', error);
            setError(getUserFriendlyError(error, 'create'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Manual Quiz</h2>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quiz Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign to Classes</label>
                                <select
                                    id="class"
                                    multiple
                                    value={selectedClasses}
                                    onChange={handleClassChange}
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                >
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 relative">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-md font-semibold text-gray-800 dark:text-gray-200">Question {qIndex + 1}</label>
                                        {questions.length > 1 && (
                                            <button type="button" onClick={() => removeQuestion(qIndex)} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                                <Trash2 className="w-5 h-5 text-red-500" />
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={q.text}
                                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                        className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                        placeholder="Enter the question"
                                    />
                                    <div className="mt-4 space-y-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="flex items-center space-x-3">
                                                <input
                                                    type="radio"
                                                    name={`correctAnswer-${qIndex}`}
                                                    checked={q.correctAnswer === oIndex}
                                                    onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                                    className="form-radio h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    className="block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                                    placeholder={`Option ${oIndex + 1}`}
                                                />
                                                {q.options.length > 2 && (
                                                    <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                                        <Trash2 className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={() => addOption(qIndex)} className="mt-4 flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                                        <Plus size={16} />
                                        <span>Add Option</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button type="button" onClick={addQuestion} className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                            <Plus size={16} />
                            <span>Add Another Question</span>
                        </button>

                        {/* Global Challenge Toggle (only for admin/creator) */}
                        {(userRole === 'admin' || userRole === 'creator') && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isGlobal}
                                        onChange={(e) => setIsGlobal(e.target.checked)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            Make this a global challenge
                                        </span>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            Global challenges are visible to all users, not just your institute
                                        </p>
                                    </div>
                                </label>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center py-2.5 px-6 border border-transparent shadow-md text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-all"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Creating...
                                    </>
                                ) : (
                                    'Save Quiz'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateManualQuizPage;
