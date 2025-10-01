// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../services/firebase';

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { email, password } = formData;

        try {
            // --- LOGIN LOGIC ---
            await signInWithEmailAndPassword(auth, email, password);
            // App.jsx's ProtectedRoute/MainRedirect will handle role-based redirection from here.
            navigate('/');
        } catch (err) {
            console.error("Frontend caught error during authentication:", err);
            if (err.code && err.code.startsWith('auth/')) {
                switch (err.code) {
                    case 'auth/invalid-credential':
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        setError('Invalid email or password. Please try again.');
                        break;
                    default:
                        setError('An unexpected authentication error occurred.');
                }
            } else {
                setError(err.response?.data?.message || err.message || 'An unknown error occurred.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">User Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <button type="submit" className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                        Login
                    </button>
                </form>

                <div className="text-sm text-center text-gray-600 pt-4">
                    <p className="mb-2">Need to create an account?</p>
                    <div className="flex flex-col space-y-2">
                         <Link to="/register-institute" className="font-semibold text-green-600 hover:underline">Register a new Institute</Link>
                         <Link to="/join-institute" className="font-semibold text-green-600 hover:underline">Join an existing Institute</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;