import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Loader, CheckCircle, Trophy } from 'lucide-react';
import EcoPointsDisplay from './EcoPointsDisplay';

const ProfileCard = ({ title, children, variants }) => {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const shouldShowDashboard = !children && currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    setError('User profile not found');
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        if (currentUser?.uid) {
            fetchUserData();
        }
    }, [currentUser]);

    if (loading) {
        return (
            <motion.div
                className="glassmorphism rounded-lg p-6 shadow-soft-lg flex items-center justify-center min-h-[200px]"
                variants={variants}
            >
                <Loader className="w-8 h-8 animate-spin text-green-600" />
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                className="glassmorphism rounded-lg p-6 shadow-soft-lg"
                variants={variants}
            >
                <p className="text-red-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                    Retry
                </button>
            </motion.div>
        );
    }

    if (shouldShowDashboard) {
        return (
            <motion.div
                className="glassmorphism rounded-lg p-6 shadow-soft-lg"
                variants={variants}
            >
                {/* User Avatar & Basic Info */}
                <div className="flex items-center space-x-4 mb-6">
                    <img
                        src={currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`}
                        alt={userData?.name}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="text-xl font-bold">{userData?.name || 'Anonymous User'}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{currentUser.email}</p>
                    </div>
                </div>

                {/* Eco-Points Display */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                    <EcoPointsDisplay 
                        points={userData?.ecoPoints || 0} 
                        size="large" 
                        animate={true}
                    />
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                            <p className="text-lg font-bold">
                                {userData?.completedChallenges?.length || 0}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Rank</p>
                            <p className="text-lg font-bold">#--</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4"
            variants={variants}
        >
            {title && <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>}
            <div>{children}</div>
        </motion.div>
    );
};

export default ProfileCard;