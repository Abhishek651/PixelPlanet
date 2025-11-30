import React from 'react';
import SideNavbar from '../components/SideNavbar';
import BottomNavbar from '../components/BottomNavbar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
            <SideNavbar />
            {/* remove outer margin so the main container fills the available space inside the layout
                (this removes the visible gap between the outer area and the blue section) */}
            <main className="flex-1 overflow-y-auto bg-white/50 dark:bg-black/20 p-4">
                <div className="w-full h-full">
                    {children}
                </div>
            </main>
            <BottomNavbar />
        </div>
    );
};

export default DashboardLayout;
