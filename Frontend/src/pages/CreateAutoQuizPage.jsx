// frontend/src/pages/CreateAutoQuizPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowLeft, Loader, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/useAuth';
import { useChallenges } from '../context/useChallenges';
import { getUserFriendlyError, getValidationError } from '../utils/errorMessages';
import { logUserAction, logError, logApiRequest, logApiResponse } from '../utils/logger';

const CreateAutoQuizPage = () => {
    const navigate = useNavigate();
    const { currentUser, userRole } = useAuth();
    const { refreshChallenges } = useChallenges();
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [targetClass, setTargetClass] = useState('');
    const [classes, setClasses] = useState([]);
    const [numQuestions, setNumQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('Medium');
    const [generatedQuiz, setGeneratedQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [generationMethod, setGenerationMethod] = useState('topic');
    const [paragraph, setParagraph] = useState('');
    const [generateParagraph, setGenerateParagraph] = useState(false);
    const [paragraphLength, setParagraphLength] = useState('medium'); // short, medium, long
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [rewardEcoPoints, setRewardEcoPoints] = useState(100);
    const [rewardCoins, setRewardCoins] = useState(50);
    const [rewardXP, setRewardXP] = useState(30);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [regeneratingQuestion, setRegeneratingQuestion] = useState(null);


    useEffect(() => {
        const fetchClasses = async () => {
            const classesCollection = collection(db, 'classes');
            const classesSnapshot = await getDocs(classesCollection);
            const classesList = classesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setClasses(classesList);
        };

        fetchClasses();
    }, []);

    const handleGenerateQuiz = async () => {
        // Clear previous messages
        setError('');
        setSuccess('');

        // Validation
        if (!title.trim()) {
            setError(getValidationError('title', 'required'));
            return;
        }

        if (generationMethod === 'topic' && !topic.trim()) {
            setError(getValidationError('topic', 'required'));
            return;
        }

        if (generationMethod === 'paragraph' && !paragraph.trim()) {
            setError(getValidationError('paragraph', 'required'));
            return;
        }

        setIsLoading(true);
        setGeneratedQuiz(null);

        logUserAction('Generate quiz attempt', { 
            title, 
            method: generationMethod, 
            numQuestions, 
            difficulty 
        });

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const payload = {
                title: generationMethod === 'topic' ? topic : undefined,
                description: description,
                numQuestions,
                difficulty,
                targetClass: targetClass || 'General',
                generationMethod,
                paragraph: generationMethod === 'paragraph' ? paragraph : undefined,
                generateParagraph: generationMethod === 'topic' ? generateParagraph : false,
                paragraphLength: generateParagraph ? paragraphLength : undefined,
            };

            logApiRequest('POST', '/api/quiz/generate', payload);

            const response = await fetch(`${apiUrl}/api/quiz/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            logApiResponse('POST', '/api/quiz/generate', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setGeneratedQuiz(data);
            if (data.paragraph) {
                setParagraph(data.paragraph);
            }
            setSuccess('Quiz generated successfully! Review and save below.');
        } catch (error) {
            logError('CreateAutoQuizPage', 'Quiz generation failed', error);
            setError(getUserFriendlyError(error, 'generate'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerateQuestion = async (qIndex) => {
        setRegeneratingQuestion(qIndex);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const payload = {
                title: generationMethod === 'topic' ? topic : undefined,
                numQuestions: 1, // Generate only 1 question
                difficulty,
                generationMethod,
                paragraph: generationMethod === 'paragraph' ? paragraph : undefined,
            };

            const response = await fetch(`${apiUrl}/api/quiz/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to regenerate question');
            }

            const data = await response.json();
            if (data.questions && data.questions.length > 0) {
                const updated = { ...generatedQuiz };
                updated.questions[qIndex] = data.questions[0];
                setGeneratedQuiz(updated);
                setSuccess(`Question ${qIndex + 1} regenerated successfully!`);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            logError('CreateAutoQuizPage', 'Question regeneration failed', error);
            setError('Failed to regenerate question. Please try again.');
        } finally {
            setRegeneratingQuestion(null);
        }
    };

    const handleSaveQuiz = async () => {
        if (!generatedQuiz) return;

        // Clear previous messages
        setError('');
        setSuccess('');
        setIsLoading(true);

        // Automatically set isGlobal based on user role
        const isGlobal = userRole === 'creator' || userRole === 'admin';
        
        logUserAction('Save quiz attempt', { title, isGlobal });

        try {
            const token = await currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            // Calculate expiry date (7 days from now by default)
            const DEFAULT_EXPIRY_DAYS = 7;
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + DEFAULT_EXPIRY_DAYS);
            
            const payload = {
                title,
                description: description || `Auto-generated quiz on ${topic || 'the given topic'}`,
                numQuestions,
                difficulty: difficulty.toLowerCase(),
                targetClass: targetClass || 'All',
                rewardPoints: rewardEcoPoints,
                rewardCoins: rewardCoins,
                rewardXP: rewardXP,
                questions: generatedQuiz.questions,
                paragraph: paragraph || null,
                expiryDate: expiryDate.toISOString(),
                isGlobal: isGlobal
            };

            logApiRequest('POST', '/api/challenges/create-auto-quiz', payload);

            const res = await fetch(`${apiUrl}/api/challenges/create-auto-quiz`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            logApiResponse('POST', '/api/challenges/create-auto-quiz', res.status);

            if (res.ok) {
                setSuccess('Auto quiz created successfully! Redirecting...');
                refreshChallenges();
                setTimeout(() => navigate('/challenges'), 1500);
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create quiz');
            }
        } catch (error) {
            logError('CreateAutoQuizPage', 'Quiz save failed', error);
            setError(getUserFriendlyError(error, 'create'));
        } finally {
            setIsLoading(false);
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
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Auto Quiz</h2>
                        </div>
                    </div>
                    <div className="p-6 space-y-8">
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
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                placeholder="A brief description of the quiz."
                                rows="3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generation Method</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="topic"
                                        checked={generationMethod === 'topic'}
                                        onChange={() => setGenerationMethod('topic')}
                                        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                    />
                                    <span className="ml-2 text-gray-700 dark:text-gray-300">From Topic</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="paragraph"
                                        checked={generationMethod === 'paragraph'}
                                        onChange={() => setGenerationMethod('paragraph')}
                                        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                    />
                                    <span className="ml-2 text-gray-700 dark:text-gray-300">From Paragraph</span>
                                </label>
                            </div>
                        </div>

                        {generationMethod === 'topic' ? (
                            <div>
                                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>
                                <input
                                    type="text"
                                    id="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                    placeholder="e.g., Photosynthesis, World War II"
                                    required
                                />
                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            id="generate-paragraph"
                                            type="checkbox"
                                            checked={generateParagraph}
                                            onChange={(e) => setGenerateParagraph(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="generate-paragraph" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                            Generate paragraph for students
                                        </label>
                                    </div>
                                    
                                    {generateParagraph && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Paragraph Length
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setParagraphLength('short')}
                                                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                                                        paragraphLength === 'short'
                                                            ? 'bg-blue-600 text-white shadow-md'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                                >
                                                    <div className="text-center">
                                                        <div className="font-bold">Short</div>
                                                        <div className="text-xs opacity-80">100-150 words</div>
                                                    </div>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setParagraphLength('medium')}
                                                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                                                        paragraphLength === 'medium'
                                                            ? 'bg-blue-600 text-white shadow-md'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                                >
                                                    <div className="text-center">
                                                        <div className="font-bold">Medium</div>
                                                        <div className="text-xs opacity-80">200-300 words</div>
                                                    </div>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setParagraphLength('long')}
                                                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                                                        paragraphLength === 'long'
                                                            ? 'bg-blue-600 text-white shadow-md'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                                >
                                                    <div className="text-center">
                                                        <div className="font-bold">Long</div>
                                                        <div className="text-xs opacity-80">400-500 words</div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="paragraph" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paragraph</label>
                                <textarea
                                    id="paragraph"
                                    value={paragraph}
                                    onChange={(e) => setParagraph(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                    placeholder="Enter the paragraph to generate questions from."
                                    rows="6"
                                    required
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Questions</label>
                                <input
                                    type="number"
                                    id="numQuestions"
                                    value={numQuestions}
                                    onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                    min="1"
                                    max="20"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                                <select
                                    id="difficulty"
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                >
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="targetClass" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Class</label>
                                <select
                                    id="targetClass"
                                    value={targetClass}
                                    onChange={(e) => setTargetClass(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                >
                                    <option value="">All Classes</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Custom Rewards */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">🏆</span>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Challenge Rewards
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="rewardEcoPoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        🌱 Eco Points
                                    </label>
                                    <input
                                        type="number"
                                        id="rewardEcoPoints"
                                        value={rewardEcoPoints}
                                        onChange={(e) => setRewardEcoPoints(parseInt(e.target.value) || 0)}
                                        className="block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rewardCoins" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        🪙 Coins
                                    </label>
                                    <input
                                        type="number"
                                        id="rewardCoins"
                                        value={rewardCoins}
                                        onChange={(e) => setRewardCoins(parseInt(e.target.value) || 0)}
                                        className="block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rewardXP" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        ⭐ XP
                                    </label>
                                    <input
                                        type="number"
                                        id="rewardXP"
                                        value={rewardXP}
                                        onChange={(e) => setRewardXP(parseInt(e.target.value) || 0)}
                                        className="block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                                Students will receive these rewards upon completing the quiz successfully
                            </p>
                        </div>

                        {/* Challenge Visibility Info */}
                        {(userRole === 'creator' || userRole === 'admin') && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🌍</span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            Global Challenge
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            This challenge will be visible to all users worldwide
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {(userRole === 'teacher' || userRole === 'hod') && (
                            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🏫</span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            Institute Challenge
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            This challenge will only be visible to students in your institute
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleGenerateQuiz}
                                disabled={isLoading}
                                className="inline-flex items-center justify-center py-2.5 px-6 border border-transparent shadow-md text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Quiz'
                                )}
                            </button>
                        </div>

                        {generatedQuiz && (
                            <div className="space-y-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Preview</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {generatedQuiz.questions.length} questions
                                    </p>
                                </div>
                                {generatedQuiz.questions.map((q, qIndex) => (
                                    <div key={qIndex} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                        {editingQuestion === qIndex ? (
                                            // Edit Mode
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Question {qIndex + 1}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={q.question}
                                                        onChange={(e) => {
                                                            const updated = { ...generatedQuiz };
                                                            updated.questions[qIndex].question = e.target.value;
                                                            setGeneratedQuiz(updated);
                                                        }}
                                                        className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Options
                                                    </label>
                                                    {q.options.map((option, oIndex) => (
                                                        <div key={oIndex} className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name={`correct-${qIndex}`}
                                                                checked={option === q.answer}
                                                                onChange={() => {
                                                                    const updated = { ...generatedQuiz };
                                                                    updated.questions[qIndex].answer = option;
                                                                    setGeneratedQuiz(updated);
                                                                }}
                                                                className="w-4 h-4 text-green-600"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={option}
                                                                onChange={(e) => {
                                                                    const updated = { ...generatedQuiz };
                                                                    const oldOption = updated.questions[qIndex].options[oIndex];
                                                                    updated.questions[qIndex].options[oIndex] = e.target.value;
                                                                    // Update answer if this was the correct option
                                                                    if (updated.questions[qIndex].answer === oldOption) {
                                                                        updated.questions[qIndex].answer = e.target.value;
                                                                    }
                                                                    setGeneratedQuiz(updated);
                                                                }}
                                                                className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                                            />
                                                        </div>
                                                    ))}
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                        Select the radio button to mark the correct answer
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        onClick={() => setEditingQuestion(null)}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Save Changes
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingQuestion(null);
                                                            // Reset to original if needed
                                                        }}
                                                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // View Mode
                                            <>
                                                <div className="flex items-start justify-between gap-4">
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200 flex-1">
                                                        {qIndex + 1}. {q.question}
                                                    </p>
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <button
                                                            onClick={() => setEditingQuestion(qIndex)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                            title="Edit question"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleRegenerateQuestion(qIndex)}
                                                            disabled={regeneratingQuestion === qIndex}
                                                            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Regenerate question"
                                                        >
                                                            {regeneratingQuestion === qIndex ? (
                                                                <Loader className="w-5 h-5 animate-spin" />
                                                            ) : (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const updated = { ...generatedQuiz };
                                                                updated.questions.splice(qIndex, 1);
                                                                setGeneratedQuiz(updated);
                                                            }}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Delete question"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-4 space-y-2">
                                                    {q.options.map((option, oIndex) => (
                                                        <div
                                                            key={oIndex}
                                                            className={`flex items-center p-3 rounded-lg ${option === q.answer ? 'bg-green-100 dark:bg-green-900/50 border-green-500' : 'bg-white dark:bg-gray-800'} border`}
                                                        >
                                                            <span className={`font-medium ${option === q.answer ? 'text-green-800 dark:text-green-200' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                {option}
                                                                {option === q.answer && (
                                                                    <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                                                                        Correct
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={handleSaveQuiz}
                                        className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-md text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                                    >
                                        Save Quiz
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateAutoQuizPage;