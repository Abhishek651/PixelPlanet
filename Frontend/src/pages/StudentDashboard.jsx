import React from 'react';
import SideNavbar from '../components/SideNavbar';
import BottomNavbar from '../components/BottomNavbar';
import ProfileCard from '../components/ProfileCard';
import Leaderboard from '../components/Leaderboard';
import ChallengesList from '../components/ChallengesList';
import GamifiedActions from '../components/GamifiedActions';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <p className="text-text-light dark:text-text-dark">Loading dashboard...</p>
            </div>
        );
    }

    if (!currentUser) {
        // If not logged in after loading, redirect to home/login
        return <Navigate to="/" replace />;
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 p-4 min-h-screen">
            <div className="flex h-full max-h-[1024px] w-full max-w-7xl mx-auto bg-transparent rounded-xl overflow-hidden">
                <SideNavbar /> {/* Side Navbar for large screens */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white/50 dark:bg-black/20 rounded-lg">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 h-full">
                        {/* Left column for Profile and Leaderboard */}
                        <div className="xl:col-span-2 flex flex-col gap-6 lg:gap-8">
                            <ProfileCard />
                            <Leaderboard />
                        </div>
                        {/* Right column for Challenges and Gamified Actions */}
                        <div className="flex flex-col gap-6 lg:gap-8">
                            <ChallengesList />
                            <GamifiedActions />
                        </div>
                    </div>
                </main>
            </div>
            <BottomNavbar /> {/* Bottom Navbar for mobile screens */}
        </div>
    );
};

export default StudentDashboard;