
import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import { useAuth } from '../context/useAuth';
import { signOut, updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import EditProfileModal from './EditProfileModal';

const ProfileSettings = ({ variants }) => {
    const { refreshAuth, currentUser } = useAuth();
    const [showEditModal, setShowEditModal] = useState(false);

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
        <>
            <ProfileCard title="Profile Settings" variants={variants}>
                <div className="space-y-3">
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="w-full p-4 font-semibold text-gray-800 bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">edit</span>
                        Edit Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full p-4 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Logout
                    </button>
                </div>
            </ProfileCard>
            
            <EditProfileModal 
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
            />
        </>
    );
};

export default ProfileSettings;
