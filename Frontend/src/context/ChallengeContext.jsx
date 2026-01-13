import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './useAuth';

import { ChallengeContext } from './ChallengeContextDefinition';



export const ChallengeProvider = ({ children }) => {
    const { currentUser, userRole } = useAuth();
    const [challenges, setChallenges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                q = query(collection(db, 'challenges'), where('instituteId', '==', userInstitute));
            } else if (userRole === 'teacher' || userRole === 'hod' || userRole === 'admin') {
                console.log(`[ChallengeProvider] User is a ${userRole}. Fetching created challenges...`);
                q = query(collection(db, 'challenges'), where('createdBy', '==', currentUser.uid));
            } else if (userRole === 'global') {
                console.log('[ChallengeProvider] User is global. Fetching global challenges...');
                q = query(collection(db, 'challenges'), where('isGlobal', '==', true));
            } else {
                console.log(`[ChallengeProvider] Unknown user role: ${userRole}`);
            }

            if (q) {
                const querySnapshot = await getDocs(q);
                const challengesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Log challenge dates for debugging
                console.log('📅 Challenge Dates:');
                challengesData.forEach(challenge => {
                    const startDate = challenge.startDate 
                        ? (challenge.startDate?.toDate?.() || new Date(challenge.startDate))
                        : challenge.createdAt?.toDate?.() || new Date();
                    const expiryDate = challenge.expiryDate?.toDate?.() || new Date(challenge.expiryDate);
                    console.log(`  ${challenge.title}:`);
                    console.log(`    Start: ${startDate}`);
                    console.log(`    Expiry: ${expiryDate}`);
                    console.log(`    Type: ${challenge.type}`);
                });
                
                if (userRole === 'student' && userData.class) {
                    const studentClass = userData.class;
                    console.log(`[ChallengeProvider] Filtering for student's class: ${studentClass}`);
                    const filteredChallenges = challengesData.filter(challenge => {
                        // Filter by class
                        const classMatch = !challenge.classes || 
                            (Array.isArray(challenge.classes) ? challenge.classes.includes(studentClass) : challenge.classes === studentClass);
                        
                        // Filter out expired challenges for students
                        const now = new Date();
                        const expiryDate = challenge.expiryDate?.toDate?.() || new Date(challenge.expiryDate);
                        const isNotExpired = !challenge.expiryDate || expiryDate > now;
                        
                        if (!isNotExpired) {
                            console.log(`⏰ Filtering out expired challenge: ${challenge.title} (expired: ${expiryDate})`);
                        }
                        
                        return classMatch && isNotExpired;
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
            console.error("[ChallengeProvider] Error fetching challenges:", error.message || error);
            setError('Failed to load challenges. Please try again.');
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
        error,
        setChallenges,
        refreshChallenges: fetchChallenges,
        clearError: () => setError(null),
    };

    return (
        <ChallengeContext.Provider value={value}>
            {children}
        </ChallengeContext.Provider>
    );
};
