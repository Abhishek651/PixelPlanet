
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChallengesList from '../components/ChallengesList';
import ChallengeCreatorFAB from '../components/ChallengeCreatorFAB';
import ChallengeTypeModal from '../components/ChallengeTypeModal';

const ChallengePage = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <DashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">List of Challenges Created</h1>
                <ChallengesList />
            </div>
            <ChallengeCreatorFAB onClick={() => setModalOpen(true)} />
            <ChallengeTypeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </DashboardLayout>
    );
};

export default ChallengePage;
