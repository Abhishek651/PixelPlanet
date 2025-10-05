// frontend/src/context/ChallengeContext.jsx
import React, { createContext, useState, useContext } from 'react';

const ChallengeContext = createContext();

export const useChallenges = () => {
    return useContext(ChallengeContext);
};

const mockChallenges = [
    { title: 'Intro to Sustainability', classes: 'Class A', type: 'Quiz-Auto', questions: 10, rewardPoints: 150 },
    { title: 'Recycling Basics', classes: 'Class B', type: 'Video', questions: 1, rewardPoints: 50 },
    { title: 'Waste Reduction Challenge', classes: 'Class A, Class C', type: 'Physical', questions: 1, rewardPoints: 200 },
];

export const ChallengeProvider = ({ children }) => {
    const [challenges, setChallenges] = useState(mockChallenges);

    const addChallenge = (challenge) => {
        console.log('ChallengeContext: addChallenge called with:', challenge);
        setChallenges(prevChallenges => {
            const newChallenges = [...prevChallenges, { ...challenge, id: prevChallenges.length + 1 }];
            console.log('ChallengeContext: Updated challenges state:', newChallenges);
            return newChallenges;
        });
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
