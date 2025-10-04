// frontend/src/pages/CreateManualQuizPage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChallenges } from '../context/ChallengeContext';

const CreateManualQuizPage = () => {
    const navigate = useNavigate();
    const { addChallenge } = useChallenges();
    const [title, setTitle] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [questions, setQuestions] = useState([{ text: '', options: ['', ''], correctAnswer: 0 }]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const newChallenge = {
            title,
            classes: selectedClasses.join(', '),
            type: 'Quiz-Manual',
            questions: questions.length,
            rewardPoints: 100, // Mock reward points
        };
        addChallenge(newChallenge);
        navigate('/challenges');
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

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-md text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                            >
                                Save Quiz
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateManualQuizPage;
