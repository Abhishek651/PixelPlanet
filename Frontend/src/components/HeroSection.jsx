import React from 'react';

const HeroSection = () => {
    return (
        <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-soft-lg">
            <img 
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop" 
                alt="Lush green forest" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                <h1 className="text-4xl md:text-6xl font-bold font-display text-white drop-shadow-lg">
                    Join the Green Revolution.
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-xl drop-shadow-md">
                    PixelPlanet transforms environmental education into engaging quests and real-world impact. Start your journey today.
                </p>
            </div>
        </div>
    );
};

export default HeroSection;