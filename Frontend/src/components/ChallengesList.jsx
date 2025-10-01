import React from 'react';

const ChallengesList = () => {
    // Placeholder challenges data
    const challenges = [
        { id: 1, name: 'Waste Segregation Week', ep: 150 },
        { id: 2, name: 'Plant a Sapling', ep: 200 },
        { id: 3, name: 'Energy Saver Quiz', ep: 50 },
        { id: 4, name: 'Recycle Right', ep: 100 },
    ];

    return (
        <div className="glassmorphism rounded-lg p-6 flex-grow flex flex-col shadow-soft-lg">
            <h3 className="text-lg font-bold font-display mb-4">New Challenges</h3>
            <div className="space-y-4">
                {challenges.map((challenge) => (
                    <div
                        key={challenge.id}
                        className="bg-background-light/50 dark:bg-background-dark/30 p-4 rounded-lg flex items-center justify-between shadow-soft"
                    >
                        <div>
                            <p className="font-semibold">{challenge.name}</p>
                            <p className="text-sm text-text-light/70 dark:text-text-dark/70">{challenge.ep} EP</p>
                        </div>
                        <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors shadow-soft">
                            Start
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChallengesList;