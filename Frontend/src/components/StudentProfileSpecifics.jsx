import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/useAuth';
import { db } from '../services/firebase';
import { FileText, ClipboardCheck, Film, Loader } from 'lucide-react';
import ProfileCard from './ProfileCard';
import EcoPointsDisplay from './EcoPointsDisplay';

const getChallengeIcon = (type) => {
    switch (type) {
        case 'quiz':
            return <FileText className="w-5 h-5" />;
        case 'physical':
            return <ClipboardCheck className="w-5 h-5" />;
        case 'video':
            return <Film className="w-5 h-5" />;
        default:
            return <FileText className="w-5 h-5" />;
    }
};

const StudentProfileSpecifics = ({ variants }) => {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [challengeDetails, setChallengeDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user document
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());

                    // If user has completed challenges, fetch their details
                    const completedChallenges = userDoc.data().completedChallenges || [];
                    const challengeDetailsPromises = completedChallenges.map(async (challengeId) => {
                        const challengeDoc = await getDoc(doc(db, 'quizzes', challengeId));
                        return challengeDoc.exists() ? {
                            id: challengeDoc.id,
                            ...challengeDoc.data(),
                        } : null;
                    });

                    const details = await Promise.all(challengeDetailsPromises);
                    setChallengeDetails(details.filter(Boolean));
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser?.uid) {
            fetchData();
        }
    }, [currentUser]);

    const calculateNextMilestone = () => {
        const points = userData?.ecoPoints || 0;
        const milestone = Math.ceil(points / 500) * 500;
        return {
            target: milestone,
            progress: (points / milestone) * 100,
        };
    };

    if (loading) {
        return (
            <ProfileCard title="Eco-Points Breakdown" variants={variants}>
                <div className="flex justify-center items-center min-h-[200px]">
                    <Loader className="w-8 h-8 animate-spin text-green-600" />
                </div>
            </ProfileCard>
        );
    }

    const { target, progress } = calculateNextMilestone();
    const completedCount = challengeDetails.length;

    return (
        <ProfileCard title="Eco-Points Breakdown" variants={variants}>
            <div className="space-y-6">
                {/* Total Points Summary */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <EcoPointsDisplay 
                        points={userData?.ecoPoints || 0} 
                        size="large"
                        animate={false}
                    />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Earned from {completedCount} challenges
                    </p>
                </div>

                {/* Progress Section */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Next Milestone: {target} points
                        </span>
                        <span className="text-sm font-semibold">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Challenge History */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Challenge History</h3>
                    {challengeDetails.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {challengeDetails.map((challenge) => (
                                <div 
                                    key={challenge.id}
                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-green-600 dark:text-green-400">
                                            {getChallengeIcon(challenge.type)}
                                        </div>
                                        <div>
                                            <p className="font-medium">{challenge.title}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)} Challenge
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        +{challenge.rewardPoints || 10} pts
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                Start your eco-journey!
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Complete challenges to earn points and track your progress
                            </p>
                        </div>
                    )}
                </div>

                {/* Future Badges Section */}
                <div className="mt-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        🎖️ Badges: Coming Soon
                    </p>
                </div>
            </div>
        </ProfileCard>
    );
};

export default StudentProfileSpecifics;