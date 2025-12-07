
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import EcoPointsDisplay from './EcoPointsDisplay';

const ProfileHeader = ({ user, role }) => {
    const [ecoPoints, setEcoPoints] = useState(0);
    const [instituteName, setInstituteName] = useState('');
    const [userLocation, setUserLocation] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user.uid) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log('ProfileHeader: User data:', userData);
                        setEcoPoints(userData.ecoPoints || 0);
                        
                        // Set user location
                        if (userData.city && userData.country) {
                            setUserLocation(`${userData.city}, ${userData.country}`);
                        } else if (userData.city) {
                            setUserLocation(userData.city);
                        } else if (userData.country) {
                            setUserLocation(userData.country);
                        }
                        
                        // Fetch institute name if user has instituteId
                        if (userData.instituteId) {
                            console.log('ProfileHeader: Fetching institute:', userData.instituteId);
                            const instituteDoc = await getDoc(doc(db, 'institutes', userData.instituteId));
                            if (instituteDoc.exists()) {
                                const instituteName = instituteDoc.data().name || '';
                                console.log('ProfileHeader: Institute name:', instituteName);
                                setInstituteName(instituteName);
                            } else {
                                console.log('ProfileHeader: Institute document not found');
                            }
                        } else {
                            console.log('ProfileHeader: No instituteId found for user');
                        }
                    }
                } catch (error) {
                    console.error('ProfileHeader: Error fetching user data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [user.uid]);
    const getRoleBadgeColor = () => {
        switch (role) {
            case 'student':
                return 'bg-blue-500';
            case 'teacher':
                return 'bg-green-500';
            case 'admin':
                return 'bg-purple-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <motion.div
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <img
                className="w-24 h-24 rounded-full mr-6"
                src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`}
                alt="Profile Avatar"
            />
            <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.displayName || 'Anonymous User'}</h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                
                {/* Location */}
                {userLocation && !loading && (
                    <div className="flex items-center mt-1">
                        <span className="material-symbols-outlined text-sm mr-1 text-gray-500 dark:text-gray-400">location_on</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{userLocation}</span>
                    </div>
                )}
                
                {/* Institute Name or Join Message */}
                {(role === 'student' || role === 'teacher' || role === 'hod') && !loading && (
                    <div className="flex items-center mt-2">
                        {instituteName ? (
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <span className="material-symbols-outlined text-sm mr-1">school</span>
                                <span className="text-sm font-medium">{instituteName}</span>
                            </div>
                        ) : role === 'student' && (
                            <div className="flex items-center text-orange-600 dark:text-orange-400">
                                <span className="material-symbols-outlined text-sm mr-1">info</span>
                                <span className="text-sm font-medium">Not joined any institute</span>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {role && (
                        <span className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full ${getRoleBadgeColor()}`}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </span>
                    )}
                    {role === 'student' && (
                        <EcoPointsDisplay 
                            points={ecoPoints} 
                            size="small" 
                            showLabel={false} 
                            animate={false}
                            className="inline-block"
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileHeader;
