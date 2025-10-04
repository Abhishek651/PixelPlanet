// frontend/src/context/ChallengeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, serverTimestamp, where, query } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const ChallengeContext = createContext();

export const useChallenges = () => useContext(ChallengeContext);

export const ChallengeProvider = ({ children }) => {
    const [challenges, setChallenges] = useState([]);
    const { instituteId, currentUser } = useAuth();

    const fetchChallenges = async () => {
        if (instituteId) {
            const challengesCollection = collection(db, 'challenges');
            const q = query(challengesCollection, where("instituteId", "==", instituteId));
            const challengesSnapshot = await getDocs(q);
            const challengesList = challengesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setChallenges(challengesList);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, [instituteId]);

    const addChallenge = async (challenge) => {
        if (instituteId && currentUser) {
            const newChallenge = {
                ...challenge,
                instituteId,
                teacherId: currentUser.uid,
                teacherName: currentUser.displayName, // Assumes displayName is set
                status: 'Active',
                completion: '0/0',
                createdAt: serverTimestamp(),
            };
            await addDoc(collection(db, 'challenges'), newChallenge);
            fetchChallenges(); // Refetch challenges after adding a new one
        }
    };

    const value = {
        challenges,
        addChallenge,
    };

    return (
        <ChallengeContext.Provider value={value}>
            {children}
        </ChallengeContext.Provider>
    );
};
