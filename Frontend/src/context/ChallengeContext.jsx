import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './useAuth';

import { ChallengeContext } from './ChallengeContextDefinition';



export const ChallengeProvider = ({ children }) => {
    const { currentUser, userRole } = useAuth();
    const [challenges, setChallenges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchChallenges = useCallback(async () => {
        if (!currentUser) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        console.log(`[ChallengeProvider] Fetching challenges for user: ${currentUser.uid}, role: ${userRole}`);

        try {
            let q;
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                console.log('[ChallengeProvider] User document not found.');
                setChallenges([]);
                setIsLoading(false);
                return;
            }

            const userData = userDoc.data();
            const userInstitute = userData.instituteId;

            if (!userInstitute) {
                console.log('[ChallengeProvider] User has no institute assigned.');
                setChallenges([]);
                setIsLoading(false);
                return;
            }

            if (userRole === 'student') {
                console.log('[ChallengeProvider] User is a student. Fetching challenges for institute:', userInstitute);
                q = query(collection(db, 'quizzes'), where('instituteId', '==', userInstitute));
            } else if (userRole === 'teacher' || userRole === 'hod' || userRole === 'admin') {
                console.log(`[ChallengeProvider] User is a ${userRole}. Fetching created challenges...`);
                q = query(collection(db, 'quizzes'), where('createdBy', '==', currentUser.uid));
            } else {
                console.log(`[ChallengeProvider] Unknown user role: ${userRole}`);
            }

            if (q) {
                const querySnapshot = await getDocs(q);
                const challengesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                if (userRole === 'student' && userData.class) {
                    const studentClass = userData.class;
                    console.log(`[ChallengeProvider] Filtering for student's class: ${studentClass}`);
                    const filteredChallenges = challengesData.filter(challenge => {
                        if (!challenge.classes) {
                            return true; // Challenge is for all classes
                        }
                        if (Array.isArray(challenge.classes)) {
                            return challenge.classes.includes(studentClass);
                        }
                        return challenge.classes === studentClass;
                    });
                    setChallenges(filteredChallenges);
                    console.log('[ChallengeProvider] Filtered challenges for student:', filteredChallenges);
                } else {
                    setChallenges(challengesData);
                    console.log('[ChallengeProvider] Fetched challenges:', challengesData);
                }
            } else {
                console.log('[ChallengeProvider] No query created, setting challenges to empty array.');
                setChallenges([]);
            }
        } catch (error) {
            console.error("[ChallengeProvider] Error fetching challenges:", error);
            setChallenges([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentUser, userRole]);

    useEffect(() => {
        fetchChallenges();
    }, [fetchChallenges]);

    const value = {
        challenges,
        isLoading,
        setChallenges,
        refreshChallenges: fetchChallenges,
    };

    return (
        <ChallengeContext.Provider value={value}>
            {children}
        </ChallengeContext.Provider>
    );
};
