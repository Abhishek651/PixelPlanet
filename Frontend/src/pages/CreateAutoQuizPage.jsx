// frontend/src/pages/CreateAutoQuizPage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowLeft, Loader, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const CreateAutoQuizPage = () => {
    const navigate = useNavigate();
    const { addChallenge } = useChallenges();
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('Medium');
    const [generatedQuiz, setGeneratedQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openRouterApiKey, setOpenRouterApiKey] = useState('');

    const handleGenerateQuiz = async () => {
        if (!openRouterApiKey) {
            alert('Please enter your OpenRouter API key.');
            return;
        }

        setIsLoading(true);
        setGeneratedQuiz(null);

        const prompt = `Create a quiz with ${numQuestions} questions about ${topic} with ${difficulty} difficulty.
Each question should have 4 multiple-choice options, and one correct answer.
Provide the output in the following JSON format:
{
  "questions": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer": "..."
    }
  ]
}`;

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openRouterApiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "openai/gpt-3.5-turbo",
                    "messages": [
                        { "role": "user", "content": prompt }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const quizData = JSON.parse(data.choices[0].message.content);
            setGeneratedQuiz(quizData);
        } catch (error) {
            console.error("Error generating quiz:", error);
            alert("Failed to generate quiz. Please check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

const { currentUser } = useAuth();

    const handleSaveQuiz = async () => {
        if (!generatedQuiz) return;

        const newChallenge = {
            title,
            topic,
            difficulty,
            type: 'Quiz-Auto',
            questions: generatedQuiz.questions.length,
            rewardPoints: 100, // Mock reward points
            quizData: generatedQuiz,
            createdBy: currentUser.uid,
            createdAt: new Date(),
        };

        try {
            await addDoc(collection(db, 'quizzes'), newChallenge);
            navigate('/challenges');
        } catch (error) {
            console.error("Error saving quiz:", error);
            alert("Failed to save quiz. Please check the console for details.");
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
                        <div>
                            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">OpenRouter API Key</label>
                            <input
                                type="text"
                                id="apiKey"
                                value={openRouterApiKey}
                                onChange={(e) => setOpenRouterApiKey(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                placeholder="Enter your OpenRouter API key"
                                required
                            />
                        </div>
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
                        </div>
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
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleGenerateQuiz}
                                disabled={isLoading}
                                className="inline-flex items-center justify-center py-2.5 px-6 border border-transparent shadow-md text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-all"
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
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Preview</h3>
                                {generatedQuiz.questions.map((q, qIndex) => (
                                    <div key={qIndex} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{qIndex + 1}. {q.question}</p>
                                        <div className="mt-4 space-y-2">
                                            {q.options.map((option, oIndex) => (
                                                <div
                                                    key={oIndex}
                                                    className={`flex items-center p-3 rounded-lg ${option === q.answer ? 'bg-green-100 dark:bg-green-900/50 border-green-500' : 'bg-white dark:bg-gray-800'} border`}
                                                >
                                                    <span className={`font-medium ${option === q.answer ? 'text-green-800 dark:text-green-200' : 'text-gray-700 dark:text-gray-300'}`}>{option}</span>
                                                </div>
                                            ))}
                                        </div>
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