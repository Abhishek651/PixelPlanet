import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function InstituteAdminPage() {
    const { currentUser, loading, refreshAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [instituteData, setInstituteData] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isFetchingData, setIsFetchingData] = useState(true);

    useEffect(() => {
        console.log("InstituteAdminPage useEffect triggered.");
        console.log("Loading:", loading, "currentUser:", !!currentUser);

        const fetchInstituteDetails = async () => {
            setIsFetchingData(true);
            setError('');

            if (location.state?.instituteData) {
                console.log("Using institute data from location state (might be from old flow).");
                setInstituteData(location.state.instituteData);
                navigate(location.pathname, { replace: true, state: {} });
                setIsFetchingData(false);
                return;
            }

            if (currentUser && !loading) {
                console.log("Fetching institute data from backend for user:", currentUser.uid);
                try {
                    const token = await currentUser.getIdToken(true);
                    
                    const userProfileRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/users/${currentUser.uid}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const userInstituteId = userProfileRes.data.instituteId;

                    if (!userInstituteId) {
                        setError("Could not find Institute ID for this user account in Firestore profile. This account may be improperly set up.");
                        console.error("User profile missing instituteId:", userProfileRes.data);
                        setIsFetchingData(false);
                        return;
                    }

                    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/institute-codes/${userInstituteId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setInstituteData(response.data);
                    setError('');
                } catch (err) {
                    console.error("Failed to fetch institute codes:", err.response?.data?.debugInfo || err);
                    const errorMessage = err.response?.data?.message || err.message || 'Failed to load institute details from backend.';
                    setError(errorMessage);

                    if (err.response?.status === 401 || err.response?.status === 403) {
                        console.warn("Unauthorized/Forbidden while fetching institute codes. Attempting token refresh.");
                        await refreshAuth();
                    } else if (err.response?.status === 404) {
                        setError(`Institute data not found for your account. It may have been deleted or improperly linked. ${errorMessage}`);
                    }
                } finally {
                    setIsFetchingData(false);
                }
            } else if (!loading && !currentUser) {
                console.log("Not logged in, redirecting. CurrentUser:", !!currentUser);
                navigate('/login');
            }
        };

        if (!loading && currentUser) {
             fetchInstituteDetails();
        }

    }, [currentUser, loading, navigate, location.state, refreshAuth]);


    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Failed to log out.");
        }
    };

    const handleRegenerateCode = async (type) => {
        setMessage('');
        setError('');
        if (!instituteData || !instituteData.instituteId) {
            setError("Institute data not available to regenerate code.");
            return;
        }
        try {
            const token = await currentUser.getIdToken(true);
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/institute-codes/${instituteData.instituteId}/regenerate`,
                { type },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(response.data.message);
            setInstituteData(prev => ({ ...prev, [`${type}RegistrationCode`]: response.data.newCode }));
            alert(response.data.message);
        } catch (err) {
            console.error("Failed to regenerate code:", err.response?.data?.debugInfo || err);
            setError(err.response?.data?.message || err.message || `Failed to regenerate ${type} code.`);
        }
    };

    // --- Conditional Rendering ---

    if (loading || !currentUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>{loading ? 'Loading user data...' : 'Access Denied or Redirecting...'}</p>
                {error && <p className="text-red-600 mt-4">Error: {error}</p>}
            </div>
        );
    }

    if (isFetchingData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Fetching institute data...</p>
                {error && <p className="text-red-600 mt-4">Error: {error}</p>}
            </div>
        );
    }

    // New/Improved Fallback for missing instituteData
    if (!instituteData) {
        const isUserProfileNotFound = error.includes("User profile not found");
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        {isUserProfileNotFound ? "Account Data Incomplete" : "Institute Data Missing"}
                    </h2>
                    <p className="text-gray-700">
                        {isUserProfileNotFound
                            ? "Your HOD profile or institute's data could not be found in the database. This typically happens if it was deleted or never properly created."
                            : "We could not load your institute's details."
                        }
                    </p>
                    {error && <p className="text-red-600 mt-2">Error: {error}</p>}
                    <p className="text-gray-600 mt-4">
                        Please try logging in again, or if this is a new account, ensure registration completed successfully.
                    </p>

                    <button
                        onClick={handleLogout}
                        className="w-full mt-6 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Logout
                    </button>
                    {isUserProfileNotFound && (
                        <>
                            <p className="text-sm text-gray-500 mt-4">If you believe you haven't registered your institute yet:</p>
                            <button
                                onClick={() => navigate('/register-institute')}
                                className="w-full mt-2 py-2 font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 border border-indigo-300"
                            >
                                Register a New Institute
                            </button>
                        </>
                    )}
                    {!isUserProfileNotFound && ( // If it's a generic error, maybe just login again
                        <button
                            onClick={() => navigate('/login', { state: { emailHint: currentUser?.email } })}
                            className="w-full mt-2 py-2 font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 border border-indigo-300"
                        >
                            Go to Login Page
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Authenticated HOD, data successfully loaded
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 p-4">
            <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
                <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">{instituteData.instituteName} Admin Dashboard</h1>
                <p className="text-xl text-gray-700">Welcome, <span className="font-semibold text-indigo-600">{currentUser.email}</span>!</p>

                {error && <p className="text-red-600">{error}</p>}
                {message && <p className="text-green-600">{message}</p>}

                <div className="mt-8 space-y-6">
                    <div className="bg-indigo-50 p-6 rounded-lg shadow-inner border border-indigo-200">
                        <h2 className="text-2xl font-bold text-indigo-600 mb-2">Your Institute ID</h2>
                        <p className="text-4xl font-mono tracking-wider text-indigo-800 break-words select-all">{instituteData.instituteId}</p>
                        <p className="text-sm text-gray-500 mt-2">Share this ID with teachers and students so they can join your institute.</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-inner border border-blue-200">
                        <h2 className="text-2xl font-bold text-blue-600 mb-2">Teacher Registration Code</h2>
                        <p className="text-4xl font-mono tracking-wider text-blue-800 break-words select-all">{instituteData.teacherRegistrationCode}</p>
                        <p className="text-sm text-gray-500 mt-2">Teachers will use this code when they select "I am a Teacher" and join your institute.</p>
                        <button onClick={() => handleRegenerateCode('teacher')} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
                            Regenerate Teacher Code
                        </button>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg shadow-inner border border-purple-200">
                        <h2 className="text-2xl font-bold text-purple-600 mb-2">Student Registration Code</h2>
                        <p className="text-4xl font-mono tracking-wider text-purple-800 break-words select-all">{instituteData.studentRegistrationCode}</p>
                        <p className="text-sm text-gray-500 mt-2">Students will use this code when they select "I am a Student" and join your institute.</p>
                        <button onClick={() => handleRegenerateCode('student')} className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition">
                            Regenerate Student Code
                        </button>
                    </div>
                </div>

                <button onClick={handleLogout} className="w-full mt-8 py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 transform hover:scale-105">
                    Logout
                </button>
            </div>
        </div>
    );
}

export default InstituteAdminPage;