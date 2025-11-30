import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChallengeTypeModal from '../components/ChallengeTypeModal';

const CreateChallengePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const navigate = useNavigate();

    const handleClose = () => {
        setIsModalOpen(false);
        navigate(-1); // Go back to previous page
    };

    return (
        <ChallengeTypeModal 
            isOpen={isModalOpen} 
            onClose={handleClose} 
        />
    );
};

export default CreateChallengePage;
