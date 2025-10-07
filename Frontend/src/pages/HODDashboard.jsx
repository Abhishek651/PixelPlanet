import React from 'react';
import { useAuth } from '../context/useAuth';
import DashboardLayout from '../components/DashboardLayout';
import LogoutButton from '../components/LogoutButton';

function HODDashboard() {
    const { currentUser } = useAuth();
    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold">HOD Dashboard</h1>
            <p>Welcome, {currentUser?.email}</p>
            <div className="mt-4">
                <LogoutButton />
            </div>
        </DashboardLayout>
    );
}
export default HODDashboard;
