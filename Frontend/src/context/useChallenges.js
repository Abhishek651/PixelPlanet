import { useContext } from 'react';
import { ChallengeContext } from './ChallengeContextDefinition';

export const useChallenges = () => {
    return useContext(ChallengeContext);
};