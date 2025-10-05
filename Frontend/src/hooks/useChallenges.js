// frontend/src/hooks/useChallenges.js
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export const useChallenges = () => {
    const { currentUser, userRole } = useAuth();
    const [challenges, setChallenges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            if (!currentUser) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            console.log(`Fetching challenges for role: ${userRole}`);

            try {
                let q;
                if (userRole === 'teacher' || userRole === 'hod' || userRole === 'admin') {
                    // For elevated roles, fetch challenges created by them
                    q = query(collection(db, 'quizzes'), where('createdBy', '==', currentUser.uid));
                } else {
                    // For students, fetch challenges assigned to their class
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const userClass = userData.class;
                        if (userClass) {
                            console.log(`Student is in class: ${userClass}. Fetching challenges for this class.`);
                            q = query(collection(db, 'quizzes'), where('classes', 'array-contains', userClass));
                        } else {
                            console.log('Student has no class assigned.');
                        }
                    }
                }

                if (q) {
                    const querySnapshot = await getDocs(q);
                    const challengesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setChallenges(challengesData);
                    console.log('Fetched challenges:', challengesData);
                } else {
                    setChallenges([]);
                }
            } catch (error) {
                console.error("Error fetching challenges:", error);
                setChallenges([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChallenges();
    }, [currentUser, userRole]);

    return { challenges, isLoading };
};
