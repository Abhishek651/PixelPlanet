import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/useAuth';
import DashboardLayout from '../components/DashboardLayout';
import { Loader } from 'lucide-react';

const QuizPage = () => {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [quiz, setQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!challengeId) return;
            setIsLoading(true);
            try {
                const quizDocRef = doc(db, 'quizzes', challengeId);
                const quizDoc = await getDoc(quizDocRef);
                if (quizDoc.exists()) {
                    setQuiz({ id: quizDoc.id, ...quizDoc.data() });
                } else {
                    console.error("Quiz not found");
                    navigate('/challenges');
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
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
        let finalScore = 0;
        quiz.quizData.questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.answer) {
                finalScore += 10; // 10 points for each correct answer
            }
        });
        setScore(finalScore);
        setIsQuizFinished(true);

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                ecoPoints: increment(finalScore),
                completedChallenges: arrayUnion(challengeId)
            });
        } catch (error) {
            console.error("Error updating user score:", error);
        }
    };

    if (isLoading) {
        return <DashboardLayout><div className="flex justify-center items-center p-10"><Loader className="animate-spin w-8 h-8 text-blue-500" /></div></DashboardLayout>;
    }

    if (!quiz || !quiz.quizData) {
        return <DashboardLayout><div className="p-6 text-center">Quiz not found.</div></DashboardLayout>;
    }

    const currentQuestion = quiz.quizData.questions[currentQuestionIndex];

    if (isQuizFinished) {
        return (
            <DashboardLayout>
                <div className="p-6 text-center">
                    <h1 className="text-2xl font-bold mb-4">Quiz Finished!</h1>
                    <p className="text-xl">Your score: {score}</p>
                    <button onClick={() => navigate('/dashboard/student')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Back to Dashboard</button>
                </div>
            </DashboardLayout>
        );
    }

    if (quiz.paragraph && !showQuiz) {
        return (
            <DashboardLayout>
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
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
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{currentQuestionIndex + 1}. {currentQuestion.question}</p>
                    <div className="mt-4 space-y-2">
                        {currentQuestion.options.map((option, oIndex) => (
                            <div
                                key={oIndex}
                                onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                                    selectedAnswers[currentQuestionIndex] === option
                                        ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-500'
                                        : 'bg-white dark:bg-gray-800'
                                } border`}
                            >
                                <span className={`font-medium ${
                                    selectedAnswers[currentQuestionIndex] === option
                                        ? 'text-blue-800 dark:text-blue-200'
                                        : 'text-gray-700 dark:text-gray-300'
                                }`}>{option}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    {currentQuestionIndex < quiz.quizData.questions.length - 1 ? (
                        <button onClick={handleNextQuestion} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Next</button>
                    ) : (
                        <button onClick={handleFinishQuiz} className="px-4 py-2 bg-green-600 text-white rounded-lg">Finish Quiz</button>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default QuizPage;