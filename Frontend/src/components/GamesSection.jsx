import React from 'react';

const GameCard = ({ title, description, imageUrl }) => (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="p-6">
            <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">{title}</h3>
            <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">{description}</p>
            <button className="mt-4 w-full py-2 px-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-light transition shadow-soft">
                Play Now
            </button>
        </div>
    </div>
);

const GamesSection = () => {
    const games = [
        {
            title: "Eco-Quiz Challenge",
            description: "Test your knowledge about climate change and sustainability.",
            imageUrl: "https://images.unsplash.com/photo-1576236262159-d8a2343a438b?q=80&w=2070&auto=format&fit=crop",
        },
        {
            title: "Recycle Rush",
            description: "Sort waste into the correct bins before time runs out.",
            imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=2070&auto=format&fit=crop",
        },
        {
            title: "Carbon Footprint Calculator",
            description: "Calculate your carbon footprint and learn how to reduce it.",
            imageUrl: "https://images.unsplash.com/photo-1542601906-9240ba4996d3?q=80&w=2070&auto=format&fit=crop",
        },
    ];

    return (
        <section className="py-12 md:py-20">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-center text-text-light dark:text-text-dark">Our Games</h2>
            <p className="mt-4 text-lg text-center text-text-secondary-light dark:text-text-secondary-dark">Learn and have fun while saving the planet.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {games.map((game, index) => (
                    <GameCard key={index} {...game} />
                ))}
            </div>
        </section>
    );
};

export default GamesSection;