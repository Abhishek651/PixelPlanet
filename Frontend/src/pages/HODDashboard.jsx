// frontend/src/pages/HODDashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../components/LogoutButton';

function HODDashboard() {
    const { currentUser } = useAuth();
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">HOD Dashboard</h1>
            <p>Welcome, {currentUser?.email}</p>
            <div className="mt-4">
                <LogoutButton />
            </div>
        </div>
    );
}
export default HODDashboard;
// Create similar placeholder files for TeacherDashboard.jsx and StudentDashboard.jsx
