import React from 'react';
import { Check, X } from 'lucide-react';

const QuizPreview = ({ quiz, onApprove, onReject }) => {
    if (!quiz) return null;

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Preview: {quiz.title}</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{quiz.description}</p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {quiz.questions.map((q, index) => (
                            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{index + 1}. {q.question}</p>
                                <div className="mt-3 space-y-2">
                                    {q.options.map((option, i) => (
                                        <div key={i} className={`flex items-center p-2 rounded-md text-sm 
                                            ${option === q.correctAnswer 
                                                ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' 
                                                : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'}`}>
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
                        <button 
                            onClick={onReject}
                            className="flex items-center justify-center px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-semibold rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                        >
                            <X className="w-5 h-5 mr-2" />
                            Reject & Edit
                        </button>
                        <button 
                            onClick={onApprove}
                            className="flex items-center justify-center px-6 py-2.5 border border-transparent shadow-md text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                        >
                            <Check className="w-5 h-5 mr-2" />
                            Approve & Save Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPreview;
