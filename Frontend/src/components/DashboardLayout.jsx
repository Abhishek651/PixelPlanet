import React from 'react';
import SideNavbar from '../components/SideNavbar';
import BottomNavbar from '../components/BottomNavbar';

// ============================================
// COMPONENT: DashboardLayout
// Main layout wrapper for dashboard pages
// Includes SideNavbar (desktop) and BottomNavbar (mobile)
// Adds bottom padding on mobile to prevent content hiding
// ============================================

const DashboardLayout = ({ children }) => {
    return (
        <div className="relative flex h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
            {/* Desktop sidebar navigation */}
            <SideNavbar />
            
            {/* Main content area with bottom padding for mobile navbar */}
            <main className="relative flex-1 overflow-y-auto bg-white/50 dark:bg-black/20 p-4 pb-24 lg:pb-4">
                <div className="w-full h-full">
                    {children}
                </div>
            </main>
            
            {/* Mobile bottom navigation */}
            <BottomNavbar />
        </div>
    );
};

export default DashboardLayout;
