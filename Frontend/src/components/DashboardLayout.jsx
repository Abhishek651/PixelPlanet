import React from 'react';
import SideNavbar from '../components/SideNavbar';
import BottomNavbar from '../components/BottomNavbar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
            <SideNavbar />
            <main className="flex-1 m-6 p-6 lg:p-8 overflow-y-auto bg-white/50 dark:bg-black/20 rounded-2xl shadow-lg">
                <div className="w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <BottomNavbar />
        </div>
    );
};

export default DashboardLayout;
