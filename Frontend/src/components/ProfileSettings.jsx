
import React from 'react';
import ProfileCard from './ProfileCard';
import { useAuth } from '../context/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const ProfileSettings = ({ variants }) => {
    const { refreshAuth } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            await refreshAuth(); // Refresh auth state after logout
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Failed to log out.");
        }
    };

    return (
        <ProfileCard title="Profile Settings" variants={variants}>
            <button
                onClick={handleLogout}
                className="w-full p-4 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
                Logout
            </button>
        </ProfileCard>
    );
};

export default ProfileSettings;
