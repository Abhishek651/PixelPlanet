// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../services/firebase';
import axios from 'axios';

function LoginPage() {
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '', admissionId: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const mode = searchParams.get('mode');
    const role = searchParams.get('role');
    const instituteId = searchParams.get('instituteId');




    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const { email, password, name, admissionId } = formData;

        try {
            if (isSigningUp) {
                // --- SIGN UP LOGIC ---
                if (role === 'teacher') {
                    // Teacher registration does not auto-login; it waits for HOD approval
                    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register-teacher`, { name, email, password, instituteId });
                    setMessage(res.data.message);
                    // Optionally clear form or redirect to a "waiting for approval" page
                    setFormData({ email: '', password: '', name: '', admissionId: '' }); // Clear form
                    setIsSigningUp(false); // Switch to login mode
                } else if (role === 'student') {
                    // Student registration auto-logs in and redirects
                    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register-student`, { name, email, password, instituteId, admissionId });
                    await signInWithEmailAndPassword(auth, email, password); // Auto-login student
                    navigate('/dashboard/student'); // Redirect to student dashboard
                } else {
                    // Default / Global student signup (no instituteId provided)
                    // This implies a student signing up without going through an institute's specific flow
                    await createUserWithEmailAndPassword(auth, email, password);
                    navigate('/dashboard/student'); // Redirect to a general student dashboard
                }
            } else {
                // --- LOGIN LOGIC ---
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user; // The logged-in Firebase user



                // Default redirect if not a special post-registration HOD login.
                // App.jsx's ProtectedRoute/MainRedirect will handle role-based redirection from here.
                navigate('/');
            }
        } catch (err) {
            console.error("Frontend caught error during authentication:", err.response?.data?.debugInfo || err);
            if (err.code && err.code.startsWith('auth/')) {
                switch (err.code) {
                    case 'auth/invalid-credential':
                        setError('Invalid email or password. Please try again.');
                        break;
                    case 'auth/email-already-in-use':
                        setError('This email is already registered. Please login or use a different email.');
                        break;
                    case 'auth/weak-password':
                        setError('Password should be at least 6 characters.');
                        break;
                    case 'auth/user-not-found': // Specific for login errors
                    case 'auth/wrong-password': // Specific for login errors
                        setError('Invalid email or password. Please try again.');
                        break;
                    default:
                        setError(err.message);
                }
            } else {
                setError(err.response?.data?.message || err.message || 'An unknown error occurred.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center capitalize">{role || mode || 'User'} {isSigningUp ? 'Sign Up' : 'Login'}</h2>
                {instituteId && <p className="text-center text-sm text-gray-500">Institute ID: {instituteId}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSigningUp && <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />}
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
                    {isSigningUp && role === 'student' && <input type="text" name="admissionId" placeholder="Student Registration Code" value={formData.admissionId} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />}

                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {message && <p className="text-sm text-green-600">{message}</p>}

                    <button type="submit" className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                        {isSigningUp ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                <p className="text-sm text-center">
                    {isSigningUp ? 'Already have an account?' : "Don't have an account?"}
                    <button onClick={() => {
                        setIsSigningUp(!isSigningUp);
                        setError(''); // Clear errors when switching
                        setMessage(''); // Clear messages when switching
                        setFormData({ email: '', password: '', name: '', admissionId: '' }); // Clear form when switching
                    }} className="ml-1 font-semibold text-green-600 hover:underline">
                        {isSigningUp ? 'Login' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
}
export default LoginPage;