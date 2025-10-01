// frontend/src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // For making requests to your backend
import LogoutButton from '../components/LogoutButton'; // Using the new component

function StudentDashboard() {
    const { currentUser, userRole, loading } = useAuth();
    const navigate = useNavigate();
    const [roleMessage, setRoleMessage] = useState('Checking role...');

    // The handleLogout function is now removed, as its logic is in LogoutButton.jsx

    // Use effect to fetch the user's role from the backend for verification
    useEffect(() => {
        const fetchRoleFromBackend = async () => {
            if (currentUser && !loading) {
                try {
                    const token = await currentUser.getIdToken();
                    
                    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/get-role`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setRoleMessage(response.data.message);
                } catch (error) {
                    console.error("Error fetching role from backend:", error);
                    setRoleMessage("Could not verify role with backend.");
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        await signOut(auth); // Still need signOut for this error case
                        navigate('/login');
                    }
                }
            } else if (!currentUser && !loading) {
                navigate('/login');
            }
        };

        fetchRoleFromBackend();
    }, [currentUser, loading, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading user data...</p>
            </div>
        );
    }

    if (!currentUser) {
        return <p>Redirecting to login...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
                <h1 className="text-4xl font-extrabold text-green-700 mb-4">Student Dashboard</h1>
                <p className="text-xl text-gray-700">
                    Welcome, <span className="font-semibold text-green-600">{currentUser.email}</span>!
                </p>
                <p className="text-md text-gray-500">
                    Your role: <span className="font-medium capitalize">{userRole}</span>
                </p>
                <p className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                    <strong>Backend Verification:</strong> {roleMessage}
                </p>

                {/* Placeholder for student-specific content */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-xl font-bold text-green-600">Your Eco-Points</h2>
                        <p className="text-3xl font-extrabold text-green-800">0 EP</p>
                        <p className="text-sm text-gray-500">Start playing games and completing challenges to earn more!</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-xl font-bold text-blue-600">Current Challenges</h2>
                        <p className="text-lg text-gray-700">No active challenges. Check back soon!</p>
                        <button className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
                            View All Challenges
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <LogoutButton className="w-full py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 transform hover:scale-105" />
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
