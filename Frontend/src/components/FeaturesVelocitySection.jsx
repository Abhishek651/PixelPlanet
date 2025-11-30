import React from 'react';
import ScrollVelocity from './ScrollVelocity';

const FeaturesVelocitySection = ({ scrollContainerRef }) => {
    return (
        <div className="py-12 overflow-hidden bg-background-light dark:bg-background-dark">
            <ScrollVelocity
                scrollContainerRef={scrollContainerRef}
                texts={['Gamified Learning', 'Real World Impact', 'Global Leaderboards', 'AI Powered Education']}
                velocity={5} // Reduced velocity for smoother scroll effect
                className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
        </div>
    );
};

export default FeaturesVelocitySection;
