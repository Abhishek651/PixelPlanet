// frontend/src/pages/SubmissionsPage.jsx
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const SubmissionsPage = () => {
    const navigate = useNavigate();
    const { challengeId } = useParams();

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Submissions for Challenge {challengeId}</h2>
                        </div>
                    </div>
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Coming Soon!</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
                            The ability to view and manage submissions is currently under development.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SubmissionsPage;
