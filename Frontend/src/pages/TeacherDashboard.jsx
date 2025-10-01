// frontend/src/pages/TeacherDashboard.jsx
import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom'; // Make sure Navigate is imported
import axios from 'axios';
import LogoutButton from '../components/LogoutButton'; // Ensure this path is correct

function TeacherDashboard() {
    const { currentUser, userRole, loading } = useAuth();
    const navigate = useNavigate();
    const [roleMessage, setRoleMessage] = useState('Checking role...');
    const [approvalStatus, setApprovalStatus] = useState('');

    console.log("TeacherDashboard RENDER - Current User:", currentUser?.uid, "Role:", userRole, "Loading:", loading);

    useEffect(() => {
        console.log("TeacherDashboard useEffect triggered. CurrentUser:", currentUser?.uid, "Loading:", loading);
        const fetchRoleAndStatusFromBackend = async () => {
            if (currentUser) {
                console.log("TeacherDashboard useEffect: Fetching backend data...");
                try {
                    const token = await currentUser.getIdToken();
                    const roleResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/get-role`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setRoleMessage(roleResponse.data.message);

                    const userDoc = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/users/${currentUser.uid}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (userDoc.data.isVerified) {
                        setApprovalStatus("Your account has been approved.");
                    } else {
                        setApprovalStatus("Your account is pending approval from your institute's administrator.");
                    }
                } catch (error) {
                    console.error("TeacherDashboard useEffect: Error fetching role/status from backend:", error);
                    setRoleMessage("Could not verify role with backend.");
                    setApprovalStatus("Failed to load approval status.");
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        console.log("TeacherDashboard useEffect: Forcing sign out due to backend error.");
                        await signOut(auth);
                        // No explicit navigate here, AuthContext and ProtectedRoute will handle it
                    }
                }
            } else {
                console.log("TeacherDashboard useEffect: currentUser is null, not fetching data.");
            }
        };

        if (!loading && currentUser) {
            fetchRoleAndStatusFromBackend();
        }
    }, [currentUser, loading]);

    if (loading) {
        console.log("TeacherDashboard: Rendering LOADING spinner.");
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading teacher data...</p>
            </div>
        );
    }

    if (!currentUser) {
        console.log("TeacherDashboard: currentUser is NULL after loading. Redirecting to /.");
        // This case should ideally be prevented by ProtectedRoute
        return <Navigate to="/" replace />;
    }

    console.log("TeacherDashboard: Rendering MAIN CONTENT. Logout button parent div should be next.");
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
            <div className="w-full max-w-3xl p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
                <h1 className="text-4xl font-extrabold text-purple-700 mb-4">Teacher Dashboard</h1>
                <p className="text-xl text-gray-700">
                    Welcome, <span className="font-semibold text-purple-600">{currentUser.email}</span>!
                </p>
                <p className="text-md text-gray-500">
                    Your role: <span className="font-medium capitalize">{userRole}</span>
                </p>

                {/* Approval Status Message for Teachers */}
                <p className={`mt-4 p-3 rounded-md border ${
                    approvalStatus.includes("pending") ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 'bg-green-50 text-green-800 border-green-200'
                }`}>
                    <strong>Approval Status:</strong> {approvalStatus || "Loading status..."}
                </p>

                {/* Backend Role Verification */}
                <p className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                    <strong>Backend Verification:</strong> {roleMessage}
                </p>

                {/* Placeholder for teacher-specific content */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-xl font-bold text-purple-600">My Classes</h2>
                        <p className="text-lg text-gray-700">Manage your assigned classes and student progress.</p>
                        <button className="mt-3 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition">
                            Go to Class Management
                        </button>
                    </div>
                    <div className="bg-pink-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-xl font-bold text-pink-600">Assign Challenges</h2>
                        <p className="text-lg text-gray-700">Create new challenges for your students.</p>
                        <button className="mt-3 bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition">
                            Create New Challenge
                        </button>
                    </div>
                </div>

                <div className="mt-8 border-2 border-dashed border-red-500 p-4"> {/* ADDED RED BORDER FOR DEBUGGING */}
                    <p className="text-red-600 font-bold">--- Logout Button Area ---</p> {/* ADDED TEXT FOR DEBUGGING */}
                    <LogoutButton className="w-full py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 transform hover:scale-105" />
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;