// frontend/src/pages/TeacherDashboard.jsx
import React from 'react';
import SideNavbar from '../components/SideNavbar'; // <--- UPDATED IMPORT
import TeacherHeader from '../components/TeacherHeader';
import ClassOverview from '../components/ClassOverview';
import ClassProgressChart from '../components/ClassProgressChart';
import AverageEcoPoints from '../components/AverageEcoPoints';
import StudentPerformanceOverview from '../components/StudentPerformanceOverview';
import StudentPerformanceList from '../components/StudentPerformanceList';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const { currentUser, loading } = useAuth();

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
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
            <SideNavbar />
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                <div className="w-full max-w-7xl mx-auto">
                    <TeacherHeader />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <div className="md:col-span-2 flex flex-col gap-6 lg:gap-8">
                            <ClassOverview />
                            <ClassProgressChart />
                        </div>
                        <div className="flex flex-col gap-6 lg:gap-8">
                            <AverageEcoPoints />
                            <StudentPerformanceOverview />
                        </div>
                    </div>

                    <div className="mt-6 lg:mt-8">
                        <StudentPerformanceList />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;