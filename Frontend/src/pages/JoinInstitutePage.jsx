// frontend/src/pages/JoinInstitutePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function JoinInstitutePage() {
    const { instituteId, role } = useParams(); // Get instituteId and role from URL params
    const location = useLocation(); // To access state passed from modal
    const instituteName = location.state?.instituteName || 'Your Institute'; // Get instituteName from state

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(true); // Default to signup
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { refreshAuth } = useAuth(); // We need refreshAuth here

    useEffect(() => {
        // Redirect if instituteId or role are missing (e.g., direct access)
        if (!instituteId || !role) {
            navigate('/'); // Go back home if no context
            setError('Missing institute context. Please join via the home page.');
        }
    }, [instituteId, role, navigate]);

    // Helper function to get the correct dashboard path based on role
    const getDashboardPath = (userRole) => {
        switch (userRole) {
            case 'hod': // Although HODs don't use this page for signup, good for completeness
                return '/dashboard/institute-admin';
            case 'teacher':
                return '/dashboard/teacher';
            case 'student':
                return '/dashboard/student';
            default:
                return '/dashboard'; // Fallback to a generic dashboard or home
        }
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (!instituteId || !role) {
            setError('Institute information is missing. Please try again from the home page.');
            setLoading(false);
            return;
        }

        try {
            let userCredential;
            let firebaseUser; // Renamed from 'user' to avoid confusion with the 'user' object in AuthContext

            if (isSigningUp) {
                if (!name) {
                    setError('Please enter your full name.');
                    setLoading(false);
                    return;
                }
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                firebaseUser = userCredential.user;

                const idToken = await firebaseUser.getIdToken();
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/set-user-claims`, {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: name,
                    role: role, // Use the role from URL params
                    instituteId: instituteId, // Use the instituteId from URL params
                }, {
                    headers: { Authorization: `Bearer ${idToken}` }
                });
                setMessage('Account created successfully!');

            } else { // Login scenario
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                firebaseUser = userCredential.user;
                setMessage('Logged in successfully!');

                // For login, we need to ensure their claims match the institute/role they are trying to join/login to.
                // refreshAuth will fetch the latest claims. After that, the ProtectedRoute logic will handle redirection
                // based on their actual claims. If an existing user logs in here with claims that don't match,
                // the ProtectedRoute will redirect them appropriately (e.g., to their original dashboard or home).
                // For now, we'll try to redirect them to the dashboard matching the `role` from the URL,
                // and the ProtectedRoute will do the final check.
            }

            console.log("Auth operation successful, calling refreshAuth.");
            await refreshAuth(); // CRUCIAL: Refresh AuthContext to get updated custom claims

            // --- THIS IS THE CORRECTED REDIRECT LOGIC ---
            const redirectToPath = getDashboardPath(role); // Use the 'role' from URL params
            console.log(`Navigating to dashboard: ${redirectToPath}`);
            navigate(redirectToPath, { replace: true }); // Use replace to prevent going back to signup/login page
            // --- END CORRECTED REDIRECT LOGIC ---

        } catch (err) {
            console.error("Auth operation failed:", err.response?.data?.debugInfo || err);
            let errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred.';
            if (err.code && err.code.startsWith('auth/')) {
                switch (err.code) {
                    case 'auth/invalid-credential':
                        errorMessage = 'Invalid email or password. Please try again.';
                        break;
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email is already registered. Please login or use a different email.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password should be at least 6 characters.';
                        break;
                    default:
                        errorMessage = err.message;
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!instituteId || !role) {
        return <div className="text-center p-8 text-red-600">Loading or redirecting...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-purple-50 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-3xl font-bold text-purple-700">
                    {isSigningUp ? 'Sign Up' : 'Login'} for {instituteName}
                </h2>
                <p className="text-gray-600 text-lg">
                    As a <span className="font-semibold capitalize">{role}</span>
                </p>

                {error && <p className="text-red-600 text-sm">{error}</p>}
                {message && <p className="text-green-600 text-sm">{message}</p>}

                <div className="mt-4 flex justify-center space-x-4">
                    <button
                        onClick={() => setIsSigningUp(true)}
                        className={`py-2 px-4 rounded-md font-semibold ${isSigningUp ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                        disabled={loading}
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => setIsSigningUp(false)}
                        className={`py-2 px-4 rounded-md font-semibold ${!isSigningUp ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                        disabled={loading}
                    >
                        Login
                    </button>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4 mt-4">
                    {isSigningUp && (
                        <input
                            type="text"
                            placeholder="Your Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={loading}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="w-full py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isSigningUp ? 'Complete Sign Up' : 'Complete Login')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full py-2 mt-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                        disabled={loading}
                    >
                        Back to Home
                    </button>
                </form>
            </div>
        </div>
    );
}

export default JoinInstitutePage;