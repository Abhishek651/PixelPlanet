import React from 'react';

const features = [
    { icon: 'joystick', title: 'Gamified Learning', description: 'Turn sustainability into a game with points, badges, and leaderboards.' },
    { icon: 'forest', title: 'Real-World Impact', description: 'Complete quests that translate to tangible actions like planting trees.' },
    { icon: 'groups', title: 'Community Challenges', description: 'Collaborate with your class or school to achieve collective goals.' },
    { icon: 'bar_chart_4_bars', title: 'Track Your Progress', description: 'Visualize your positive impact with detailed analytics and stats.' },
];

const FeaturesSection = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold font-display text-text-light dark:text-text-dark mb-6">Why PixelPlanet?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {features.map((feature) => (
                    <div key={feature.title} className="glassmorphism p-6 rounded-2xl shadow-soft flex flex-col items-start">
                        <div className="p-3 bg-primary/20 rounded-xl mb-4">
                            <span className="material-symbols-outlined text-3xl text-primary">{feature.icon}</span>
                        </div>
                        <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">{feature.title}</h3>
                        <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesSection;