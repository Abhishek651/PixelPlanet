import React from 'react';

const GamifiedActions = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="glassmorphism rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-soft-lg hover:shadow-xl transition-shadow cursor-pointer">
                <span className="material-symbols-outlined text-5xl text-primary mb-2">joystick</span>
                <h4 className="text-lg font-bold font-display">Play Games</h4>
                <p className="text-sm text-text-light/70 dark:text-text-dark/70">Fun mini-games to learn</p>
            </div>
            <div className="glassmorphism rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-soft-lg hover:shadow-xl transition-shadow cursor-pointer">
                <span className="material-symbols-outlined text-5xl text-primary mb-2">smart_toy</span>
                <h4 className="text-lg font-bold font-display">EcoBot</h4>
                <p className="text-sm text-text-light/70 dark:text-text-dark/70">Ask me anything</p>
            </div>
        </div>
    );
};

export default GamifiedActions;