// frontend/src/pages/CreateAutoQuizPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowLeft, Loader, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/useAuth';
import { useChallenges } from '../context/useChallenges';

const CreateAutoQuizPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
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
        setIsLoading(true);
        setGeneratedQuiz(null);

        try {
            const response = await fetch('/api/quiz/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: topic,
                    numQuestions,
                    difficulty,
                    generationMethod,
                    paragraph,
                    generateParagraph,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setGeneratedQuiz(data);
            if (data.paragraph) {
                setParagraph(data.paragraph);
            }
        } catch (error) {
            console.error("Error generating quiz:", error);
            alert("Failed to generate quiz. Please check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveQuiz = async () => {
        if (!generatedQuiz) return;

        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userInstitute = userDoc.exists() ? userDoc.data().instituteId : null;

        if (!userInstitute) {
            alert("Could not determine your institute. Please ensure your profile is set up correctly.");
            return;
        }

        const newChallenge = {
            title,
            topic,
            description,
            difficulty,
            type: 'Quiz-Auto',
            questions: generatedQuiz.questions.length,
            rewardPoints: 100, // Mock reward points
            quizData: generatedQuiz,
            createdBy: currentUser.uid,
            createdAt: new Date(),
            classes: targetClass || null,
            instituteId: userInstitute,
            status: 'Active',
            completion: 0,
            generationMethod,
            paragraph,
            generateParagraph,
        };

        console.log('Saving challenge:', newChallenge);

        try {
            await addDoc(collection(db, 'quizzes'), newChallenge);
            refreshChallenges();
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
                                <div className="flex items-center mt-4">
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