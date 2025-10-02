import React from 'react';
import { useAuth } from '../context/AuthContext';
import SideNavbar from '../components/SideNavbar';
import BottomNavbar from '../components/BottomNavbar';
import LogoutButton from '../components/LogoutButton';

function HODDashboard() {
    const { currentUser } = useAuth();
    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
            <SideNavbar />
            <main className="flex-1 m-6 p-6 lg:p-8 overflow-y-auto bg-white/50 dark:bg-black/20 rounded-2xl shadow-lg">
                <div className="w-full max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold">HOD Dashboard</h1>
                    <p>Welcome, {currentUser?.email}</p>
                    <div className="mt-4">
                        <LogoutButton />
                    </div>
                </div>
            </main>
            <BottomNavbar />
        </div>
    );
}
export default HODDashboard;