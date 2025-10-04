// frontend/src/components/ChallengeCreatorFAB.jsx
import React from 'react';
import { Plus } from 'lucide-react'; // Using an icon library for a cleaner look

const ChallengeCreatorFAB = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-10 right-10 bg-blue-600 hover:bg-blue-700 text-white font-bold w-16 h-16 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-3xl z-40 transition-all duration-200"
            aria-label="Create Challenge"
        >
            <Plus size={32} />
        </button>
    );
};

export default ChallengeCreatorFAB;
