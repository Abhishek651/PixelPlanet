import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/useAuth';
import DashboardLayout from '../components/DashboardLayout';
import { Loader, Edit, Trash2 } from 'lucide-react';

const QuizPage = () => {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const { currentUser, userRole } = useAuth();
    const [quiz, setQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [viewMode, setViewMode] = useState('take'); // 'take', 'review', 'edit'
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [editedQuiz, setEditedQuiz] = useState(null);
    const [regeneratingQuestion, setRegeneratingQuestion] = useState(null);
    const [showExpandModal, setShowExpandModal] = useState(false);
    const [expandingParagraph, setExpandingParagraph] = useState(false);
    
    const isCreator = ['creator', 'teacher', 'hod', 'admin'].includes(userRole);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!challengeId) return;
            setIsLoading(true);
            try {
                const quizDocRef = doc(db, 'challenges', challengeId);
                const quizDoc = await getDoc(quizDocRef);
                if (quizDoc.exists()) {
                    const data = quizDoc.data();
                    console.log('Fetched challenge data:', data);
                    
                    // Check if this is a quiz challenge
                    if (!data.type?.includes('quiz')) {
                        console.error('Not a quiz challenge:', data.type);
                        alert('This is not a quiz challenge');
                        navigate('/challenges');
                        return;
                    }
                    
                    // Check if questions exist
                    if (!data.questions || data.questions.length === 0) {
                        console.error('No questions found in challenge');
                        alert('This quiz has no questions. Please contact your teacher.');
                        navigate('/challenges');
                        return;
                    }
                    
                    // Map the challenge data to quiz format
                    setQuiz({ 
                        id: quizDoc.id, 
                        title: data.title,
                        paragraph: data.paragraph,
                        quizData: {
                            questions: data.questions
                        }
                    });
                } else {
                    console.error("Quiz not found");
                    alert('Quiz not found');
                    navigate('/challenges');
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
                alert('Error loading quiz. Please try again.');
                navigate('/challenges');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuiz();
    }, [challengeId, navigate]);

    const handleAnswerSelect = (questionIndex, answer) => {
        setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.quizData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleFinishQuiz = async () => {
        let correctCount = 0;
        quiz.quizData.questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.answer) {
                correctCount++;
            }
        });
        
        // Calculate rewards
        const coinsEarned = correctCount * 10; // 10 coins per correct answer
        const ecoPointsEarned = 100; // Base eco points for completing quiz
        
        // Calculate XP based on performance
        const baseXP = 50;
        const perfectBonus = correctCount === quiz.quizData.questions.length ? 50 : 0;
        const performanceBonus = Math.floor((correctCount / quiz.quizData.questions.length) * 50);
        const xpEarned = baseXP + perfectBonus + performanceBonus;
        
        console.log('Quiz completed! Rewards:', {
            correctCount,
            totalQuestions: quiz.quizData.questions.length,
            coinsEarned,
            ecoPointsEarned,
            xpEarned
        });
        
        setScore(coinsEarned);
        setIsQuizFinished(true);

        try {
            if (!currentUser || !currentUser.uid) {
                console.error('No current user found');
                alert('Error: User not logged in');
                return;
            }
            
            const userDocRef = doc(db, 'users', currentUser.uid);
            console.log('Updating user document:', currentUser.uid);
            
            await updateDoc(userDocRef, {
                ecoPoints: increment(ecoPointsEarned),
                coins: increment(coinsEarned),
                xp: increment(xpEarned),
                completedChallenges: arrayUnion(challengeId)
            });
            
            console.log('User rewards updated successfully!');
        } catch (error) {
            console.error("Error updating user score:", error);
            alert(`Error saving rewards: ${error.message}`);
        }
    };

    const handleRegenerateQuestion = async (qIndex) => {
        setRegeneratingQuestion(qIndex);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const maxAttempts = 3;
            let attempt = 0;
            let newQuestion = null;
            
            // Get existing questions to avoid duplicates
            const existingQuestions = editedQuiz.quizData.questions
                .filter((_, idx) => idx !== qIndex)
                .map(q => q.question);
            
            while (attempt < maxAttempts) {
                const payload = {
                    title: editedQuiz.paragraph ? undefined : editedQuiz.title,
                    numQuestions: 1,
                    difficulty: 'Medium',
                    generationMethod: editedQuiz.paragraph ? 'paragraph' : 'topic',
                    paragraph: editedQuiz.paragraph || undefined,
                    existingQuestions: existingQuestions, // Send existing questions to backend
                };

                const response = await fetch(`${apiUrl}/api/quiz/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) throw new Error('Failed to regenerate question');

                const data = await response.json();
                if (data.questions && data.questions.length > 0) {
                    const candidate = data.questions[0];
                    const isDuplicate = existingQuestions.some(eq => 
                        eq.toLowerCase().trim() === candidate.question.toLowerCase().trim()
                    );
                    
                    if (!isDuplicate) {
                        newQuestion = candidate;
                        break;
                    }
                }
                attempt++;
            }
            
            if (newQuestion) {
                setEditedQuiz(prev => {
                    const updated = JSON.parse(JSON.stringify(prev));
                    updated.quizData.questions[qIndex] = {
                        question: newQuestion.question,
                        options: newQuestion.options,
                        answer: newQuestion.answer
                    };
                    return updated;
                });
            } else {
                if (editedQuiz.paragraph) {
                    setShowExpandModal(true);
                } else {
                    alert('Could not generate a unique question. The topic may be too narrow or all variations exhausted.');
                }
            }
        } catch (error) {
            console.error('Error regenerating question:', error);
            alert('Failed to regenerate question. Please try again.');
        } finally {
            setRegeneratingQuestion(null);
        }
    };

    const handleExpandParagraph = async () => {
        setExpandingParagraph(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/quiz/expand-paragraph`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paragraph: editedQuiz.paragraph }),
            });

            if (!response.ok) throw new Error('Failed to expand paragraph');

            const data = await response.json();
            if (data.expandedParagraph) {
                setEditedQuiz(prev => ({
                    ...prev,
                    paragraph: data.expandedParagraph
                }));
                setShowExpandModal(false);
                alert('Paragraph expanded successfully! You can now try regenerating questions.');
            }
        } catch (error) {
            console.error('Error expanding paragraph:', error);
            alert('Failed to expand paragraph. Please try again.');
        } finally {
            setExpandingParagraph(false);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const quizDocRef = doc(db, 'challenges', challengeId);
            await updateDoc(quizDocRef, {
                questions: editedQuiz.quizData.questions,
                title: editedQuiz.title,
                paragraph: editedQuiz.paragraph
            });
            setQuiz(editedQuiz);
            setViewMode('review');
            alert('Quiz updated successfully!');
        } catch (error) {
            console.error('Error updating quiz:', error);
            alert('Failed to update quiz. Please try again.');
        }
    };

    if (isLoading) {
        return <DashboardLayout><div className="flex justify-center items-center p-10"><Loader className="animate-spin w-8 h-8 text-blue-500" /></div></DashboardLayout>;
    }

    if (!quiz || !quiz.quizData || !quiz.quizData.questions || quiz.quizData.questions.length === 0) {
        return <DashboardLayout><div className="p-6 text-center">Quiz not found or has no questions.</div></DashboardLayout>;
    }

    const currentQuestion = quiz.quizData.questions[currentQuestionIndex];
    
    // Safety check for current question
    if (!currentQuestion) {
        return <DashboardLayout><div className="p-6 text-center">Error loading question. Please try again.</div></DashboardLayout>;
    }

    if (isQuizFinished) {
        const totalQuestions = quiz.quizData.questions.length;
        const correctAnswers = quiz.quizData.questions.filter((q, index) => selectedAnswers[index] === q.answer).length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        return (
            <DashboardLayout>
                <div className="p-6 max-w-4xl mx-auto">
                    {/* Score Summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6 text-center">
                        <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            percentage >= 80 ? 'bg-green-100 dark:bg-green-900/30' : 
                            percentage >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
                            'bg-red-100 dark:bg-red-900/30'
                        }`}>
                            <span className={`text-4xl font-bold ${
                                percentage >= 80 ? 'text-green-600 dark:text-green-400' : 
                                percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                                'text-red-600 dark:text-red-400'
                            }`}>{percentage}%</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                            You scored {correctAnswers} out of {totalQuestions} questions correctly
                        </p>
                        <div className="flex flex-col gap-2">
                            <p className="text-lg text-green-600 dark:text-green-400 font-semibold flex items-center justify-center gap-2">
                                <span>🌱</span>
                                <span>+100 Eco Points</span>
                            </p>
                            <p className="text-lg text-yellow-600 dark:text-yellow-400 font-semibold flex items-center justify-center gap-2">
                                <span>🪙</span>
                                <span>+{score} Coins</span>
                            </p>
                            <p className="text-lg text-purple-600 dark:text-purple-400 font-semibold flex items-center justify-center gap-2">
                                <span>⭐</span>
                                <span>+{50 + (correctAnswers === totalQuestions ? 50 : 0) + Math.floor((correctAnswers / totalQuestions) * 50)} XP</span>
                            </p>
                        </div>
                    </div>

                    {/* Detailed Results */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Review Your Answers</h2>
                        <div className="space-y-6">
                            {quiz.quizData.questions.map((question, index) => {
                                const userAnswer = selectedAnswers[index];
                                const isCorrect = userAnswer === question.answer;
                                
                                return (
                                    <div key={index} className={`p-5 rounded-lg border-2 ${
                                        isCorrect 
                                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
                                            : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                                    }`}>
                                        <div className="flex items-start gap-3 mb-3">
                                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                                isCorrect 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-red-500 text-white'
                                            }`}>
                                                {isCorrect ? '✓' : '✗'}
                                            </span>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 dark:text-white mb-3">
                                                    {index + 1}. {question.question}
                                                </p>
                                                
                                                {/* Show all options with indicators */}
                                                <div className="space-y-2">
                                                    {question.options.map((option, optIndex) => {
                                                        const isUserAnswer = option === userAnswer;
                                                        const isCorrectAnswer = option === question.answer;
                                                        
                                                        return (
                                                            <div
                                                                key={optIndex}
                                                                className={`p-3 rounded-lg border ${
                                                                    isCorrectAnswer
                                                                        ? 'bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600'
                                                                        : isUserAnswer
                                                                        ? 'bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-600'
                                                                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className={`${
                                                                        isCorrectAnswer
                                                                            ? 'text-green-900 dark:text-green-100 font-semibold'
                                                                            : isUserAnswer
                                                                            ? 'text-red-900 dark:text-red-100 font-semibold'
                                                                            : 'text-gray-700 dark:text-gray-300'
                                                                    }`}>
                                                                        {option}
                                                                    </span>
                                                                    {isCorrectAnswer && (
                                                                        <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                                                                            ✓ Correct Answer
                                                                        </span>
                                                                    )}
                                                                    {isUserAnswer && !isCorrectAnswer && (
                                                                        <span className="text-red-600 dark:text-red-400 text-sm font-semibold">
                                                                            Your Answer
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button 
                            onClick={() => navigate('/challenges')} 
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Back to Challenges
                        </button>
                        <button 
                            onClick={() => navigate('/dashboard/student')} 
                            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (isCreator && viewMode === 'review') {
        return (
            <DashboardLayout>
                <div className="p-6 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setEditedQuiz(JSON.parse(JSON.stringify(quiz)));
                                    setViewMode('edit');
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Quiz
                            </button>
                            <button
                                onClick={() => setViewMode('take')}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                                Take Quiz
                            </button>
                        </div>
                    </div>
                    
                    {quiz.paragraph && (
                        <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Paragraph</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quiz.paragraph}</p>
                        </div>
                    )}
                    
                    <div className="space-y-6">
                        {quiz.quizData.questions.map((q, qIndex) => (
                            <div key={qIndex} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                                <p className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                    {qIndex + 1}. {q.question}
                                </p>
                                <div className="space-y-2">
                                    {q.options.map((option, oIndex) => (
                                        <div
                                            key={oIndex}
                                            className={`flex items-center p-3 rounded-lg border ${
                                                option === q.answer
                                                    ? 'bg-green-100 dark:bg-green-900/50 border-green-500'
                                                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                            }`}
                                        >
                                            <span className={`font-medium ${
                                                option === q.answer
                                                    ? 'text-green-800 dark:text-green-200'
                                                    : 'text-gray-700 dark:text-gray-300'
                                            }`}>
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
                            </div>
                        ))}
                    </div>
                    
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                        Back
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    if (isCreator && viewMode === 'edit') {
        return (
            <DashboardLayout>
                <div className="p-6 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Quiz</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setViewMode('review')}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quiz Title</label>
                        <input
                            type="text"
                            value={editedQuiz.title}
                            onChange={(e) => setEditedQuiz({...editedQuiz, title: e.target.value})}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        />
                    </div>
                    
                    {editedQuiz.paragraph !== null && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paragraph</label>
                            <textarea
                                value={editedQuiz.paragraph || ''}
                                onChange={(e) => setEditedQuiz({...editedQuiz, paragraph: e.target.value})}
                                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                rows="4"
                            />
                        </div>
                    )}
                    
                    <div className="space-y-6">
                        {editedQuiz.quizData.questions.map((q, qIndex) => (
                            <div key={qIndex} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                                {editingQuestion === qIndex ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Question {qIndex + 1}
                                            </label>
                                            <input
                                                type="text"
                                                value={q.question}
                                                onChange={(e) => {
                                                    const updated = {...editedQuiz};
                                                    updated.quizData.questions[qIndex].question = e.target.value;
                                                    setEditedQuiz(updated);
                                                }}
                                                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Options</label>
                                            {q.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={`correct-${qIndex}`}
                                                        checked={option === q.answer}
                                                        onChange={() => {
                                                            const updated = {...editedQuiz};
                                                            updated.quizData.questions[qIndex].answer = option;
                                                            setEditedQuiz(updated);
                                                        }}
                                                        className="w-4 h-4 text-green-600"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => {
                                                            const updated = {...editedQuiz};
                                                            const oldOption = updated.quizData.questions[qIndex].options[oIndex];
                                                            updated.quizData.questions[qIndex].options[oIndex] = e.target.value;
                                                            if (updated.quizData.questions[qIndex].answer === oldOption) {
                                                                updated.quizData.questions[qIndex].answer = e.target.value;
                                                            }
                                                            setEditedQuiz(updated);
                                                        }}
                                                        className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setEditingQuestion(null)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between gap-4">
                                            <p className="font-semibold text-gray-800 dark:text-gray-200 flex-1">
                                                {qIndex + 1}. {q.question}
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingQuestion(qIndex)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Edit question"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleRegenerateQuestion(qIndex)}
                                                    disabled={regeneratingQuestion === qIndex}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Regenerate question"
                                                >
                                                    {regeneratingQuestion === qIndex ? (
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const updated = {...editedQuiz};
                                                        updated.quizData.questions.splice(qIndex, 1);
                                                        setEditedQuiz(updated);
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete question"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            {q.options.map((option, oIndex) => (
                                                <div
                                                    key={oIndex}
                                                    className={`flex items-center p-3 rounded-lg border ${
                                                        option === q.answer
                                                            ? 'bg-green-100 dark:bg-green-900/50 border-green-500'
                                                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                                    }`}
                                                >
                                                    <span className={`font-medium ${
                                                        option === q.answer
                                                            ? 'text-green-800 dark:text-green-200'
                                                            : 'text-gray-700 dark:text-gray-300'
                                                    }`}>
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
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Expand Paragraph Modal
    if (showExpandModal) {
        return (
            <DashboardLayout>
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Expand Paragraph?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Unable to generate unique questions. Would you like to expand the paragraph to provide more content for question generation?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleExpandParagraph}
                                disabled={expandingParagraph}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {expandingParagraph ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Expanding...
                                    </>
                                ) : (
                                    'Expand Paragraph'
                                )}
                            </button>
                            <button
                                onClick={() => setShowExpandModal(false)}
                                disabled={expandingParagraph}
                                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (quiz.paragraph && !showQuiz) {
        return (
            <DashboardLayout>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">{quiz.title}</h1>
                        {isCreator && (
                            <button
                                onClick={() => setViewMode('review')}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                            >
                                Review Quiz
                            </button>
                        )}
                    </div>
                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Read the paragraph below and then start the quiz.</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quiz.paragraph}</p>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button onClick={() => setShowQuiz(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Start Quiz</button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">{quiz.title}</h1>
                    {isCreator && (
                        <button
                            onClick={() => setViewMode('review')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                        >
                            Review Quiz
                        </button>
                    )}
                </div>
                
                {/* Progress Indicator */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Question {currentQuestionIndex + 1} of {quiz.quizData.questions.length}
                        </span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {Object.keys(selectedAnswers).length} answered
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / quiz.quizData.questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
                        {currentQuestionIndex + 1}. {currentQuestion.question}
                    </p>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, oIndex) => (
                            <div
                                key={oIndex}
                                onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                                className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                                    selectedAnswers[currentQuestionIndex] === option
                                        ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500 shadow-md'
                                        : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                                    selectedAnswers[currentQuestionIndex] === option
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-400 dark:border-gray-500'
                                }`}>
                                    {selectedAnswers[currentQuestionIndex] === option && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`font-medium ${
                                    selectedAnswers[currentQuestionIndex] === option
                                        ? 'text-blue-900 dark:text-blue-100'
                                        : 'text-gray-700 dark:text-gray-300'
                                }`}>{option}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    <button 
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Previous
                    </button>
                    {currentQuestionIndex < quiz.quizData.questions.length - 1 ? (
                        <button 
                            onClick={handleNextQuestion} 
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Next Question
                        </button>
                    ) : (
                        <button 
                            onClick={handleFinishQuiz} 
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Finish Quiz
                        </button>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default QuizPage;