// frontend/src/pages/TeacherDashboard.jsx
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TeacherHeader from '../components/TeacherHeader';
import ClassOverview from '../components/ClassOverview';
import ClassProgressChart from '../components/ClassProgressChart';
import AverageEcoPoints from '../components/AverageEcoPoints';
import StudentPerformanceOverview from '../components/StudentPerformanceOverview';
import StudentPerformanceList from '../components/StudentPerformanceList';
import ChallengesList from '../components/ChallengesList';
import ChallengeCreatorFAB from '../components/ChallengeCreatorFAB';
import EcoBot from '../components/EcoBot';
import { useAuth } from '../context/useAuth';
import { Navigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const { currentUser, loading } = useAuth();
    const [showEcoBot, setShowEcoBot] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <p className="text-text-light dark:text-text-dark">Loading dashboard...</p>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return (
        <DashboardLayout>
            <TeacherHeader />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                <div className="md:col-span-2 flex flex-col gap-6 lg:gap-8">
                    <ClassOverview />
                    <ClassProgressChart />
                </div>
                <div className="flex flex-col gap-6 lg:gap-8">
                    <AverageEcoPoints />
                    <StudentPerformanceOverview />
                    <button 
                        onClick={() => setShowEcoBot(true)}
                        className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        🌱 Ask EcoBot
                    </button>
                </div>
            </div>

            <div className="mt-6 lg:mt-8">
                <StudentPerformanceList />
            </div>

            <div className="mt-6 lg:mt-8">
                <ChallengesList />
            </div>

            <ChallengeCreatorFAB />
            <EcoBot isOpen={showEcoBot} onClose={() => setShowEcoBot(false)} />
        </DashboardLayout>
    );
};

export default TeacherDashboard;
