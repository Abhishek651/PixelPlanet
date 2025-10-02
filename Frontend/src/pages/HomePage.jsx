// frontend/src/pages/HomePage.jsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import all the components
import SideNavbar from '../components/SideNavbar';
import BottomNavbar from '../components/BottomNavbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import StatsSection from '../components/StatsSection';
import AuthSidebar from '../components/AuthSidebar';
import InstituteCodeModal from '../components/InstituteCodeModal';
import GamesSection from '../components/GamesSection';
import GlobalLeaderboardSection from '../components/GlobalLeaderboardSection';

function HomePage() {
    const { currentUser, loading } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <p className="text-xl text-gray-600 animate-pulse">Initializing PixelPlanet...</p>
            </div>
        );
    }

    // If a user is already logged in, the MainRedirect in App.jsx should handle this.
    // This is an extra safeguard.
    if (currentUser) {
        return <Navigate to="/" replace />; // This will trigger MainRedirect again to send them to their dashboard
    }

    // Pass the function to open the modal to the AuthSidebar
    const AuthSidebarWithModal = () => (
        <aside className="hidden xl:flex flex-col w-80 p-6 space-y-6">
            <div className="glassmorphism p-6 rounded-2xl shadow-soft-lg text-center flex-grow flex flex-col justify-center">
                <h3 className="text-2xl font-bold font-display text-text-light dark:text-text-dark">Ready to Start?</h3>
                <p className="mt-2 mb-6 text-text-secondary-light dark:text-text-secondary-dark">Join a community of eco-warriors and make a difference.</p>
                <div className="space-y-4">
                    <a href="/register/institute" className="w-full block py-3 px-6 bg-primary text-white font-semibold rounded-full hover:bg-primary-light transition shadow-soft">
                        Register Institute
                    </a>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-3 px-6 bg-surface-light dark:bg-surface-dark border border-primary/20 text-primary font-semibold rounded-full hover:bg-primary/10 transition"
                    >
                        Join with Code
                    </button>
                </div>
                <div className="mt-8 text-sm">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">Already have an account? </span>
                    <a href="/login" className="font-semibold text-primary hover:underline">
                        Log In
                    </a>
                </div>
            </div>
        </aside>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 font-body">
            <div className="flex h-screen w-full max-w-screen-2xl mx-auto overflow-hidden">
                {/* Side Navbar - for Desktop */}
                <SideNavbar />

                {/* Main Scrolling Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-8 md:space-y-12">
                    <HeroSection />
                    <FeaturesSection />
                    <StatsSection />
                    <GamesSection />
                    <GlobalLeaderboardSection />
                    
                    {/* Footer or extra content can go here */}
                    <footer className="text-center py-8 text-text-secondary-light dark:text-text-secondary-dark text-sm">
                        &copy; {new Date().getFullYear()} PixelPlanet. All Rights Reserved.
                    </footer>
                </main>

                {/* Auth Sidebar - for large desktops */}
                <AuthSidebarWithModal />
            </div>

            {/* Bottom Navbar - for Mobile */}
            <BottomNavbar />

            {/* The modal, controlled by state */}
            <InstituteCodeModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default HomePage;