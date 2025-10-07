// frontend/src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const LogoutButton = ({ className }) => {
    const { currentUser, loading } = useAuth(); // Also get loading here for deeper insight
    const navigate = useNavigate();

    console.log("LogoutButton RENDER - Current User:", currentUser?.uid, "Loading:", loading);

    const handleLogout = async () => {
        try {
            console.log("Attempting to log out...");
            await signOut(auth);
            console.log("Logged out successfully. Navigating to /");
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Failed to log out. Check console for details.");
        }
    };

    if (loading) {
        console.log("LogoutButton: AuthContext is still loading, returning null for now.");
        return null; // Don't render if auth context is still loading
    }

    if (!currentUser) {
        console.log("LogoutButton: No currentUser found, returning null.");
        return null; // If no user, button shouldn't show
    }

    console.log("LogoutButton: Rendering button.");
    const defaultClassName = "px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition";

    return (
        <button
            onClick={handleLogout}
            className={className || defaultClassName}
        >
            Logout
        </button>
    );
};

export default LogoutButton;