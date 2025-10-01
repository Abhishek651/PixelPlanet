import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileCard = () => {
    const { currentUser, userRole } = useAuth();

    if (!currentUser) return null; // Don't render if no user

    // Placeholder data (replace with actual user data from props or context if needed)
    const userName = currentUser.displayName || currentUser.email.split('@')[0];
    const userAvatar = currentUser.photoURL || `https://ui-avatars.com/api/?name=${userName}&background=22c55e&color=fff&size=128`;
    const userLevel = '5'; // Placeholder
    const userTitle = 'Eco-Cadet'; // Placeholder
    const currentEP = 1250; // Placeholder
    const totalEPForNextLevel = 3000; // Placeholder
    const progress = (currentEP / totalEPForNextLevel) * 100;

    return (
        <div className="glassmorphism rounded-lg p-6 flex flex-col shadow-soft-lg">
            <div className="flex items-center space-x-4">
                <img
                    alt="Student avatar"
                    className="w-20 h-20 rounded-full border-4 border-white/80 dark:border-green-200/80"
                    src={userAvatar}
                />
                <div>
                    <h2 className="text-2xl font-bold text-text-light dark:text-text-dark font-display">{userName}</h2>
                    <p className="text-green-700 dark:text-green-300">{userTitle} | Level {userLevel}</p>
                </div>
            </div>
            <div className="mt-4">
                <div className="w-full bg-green-200/50 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-text-light/70 dark:text-text-dark/70 mt-1 text-right">
                    {currentEP} / {totalEPForNextLevel} EP
                </p>
            </div>
        </div>
    );
};

export default ProfileCard;