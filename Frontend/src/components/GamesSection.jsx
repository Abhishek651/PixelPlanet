import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import ecoQuizImg from '../assets/images/eco-quiz.png';
import recycleRushImg from '../assets/images/recycle-rush.png';
import carbonFootprintImg from '../assets/images/carbon-footprint.png';

const GameCard = ({ title, description, imageUrl, link, isLoggedIn }) => {
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            navigate('/login');
        }
    };

    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
            <div className="p-6">
                <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">{title}</h3>
                <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">{description}</p>
                <Link 
                    to={link} 
                    onClick={handleClick}
                    className="mt-4 w-full py-2 px-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-light transition shadow-soft block text-center"
                >
                    {isLoggedIn ? 'Play Now' : 'Login to Play'}
                </Link>
            </div>
        </div>
    );
};

const GamesSection = () => {
    const { currentUser } = useAuth();
    const games = [
        {
            title: "Eco-Quiz Challenge",
            description: "Test your knowledge about climate change and sustainability.",
            imageUrl: ecoQuizImg,
            link: "/games/quiz",
        },
        {
            title: "Recycle Rush",
            description: "Sort waste into the correct bins before time runs out.",
            imageUrl: recycleRushImg,
            link: "/games/waste-segregator",
        },
        {
            title: "Carbon Footprint Calculator",
            description: "Calculate your carbon footprint and learn how to reduce it.",
            imageUrl: carbonFootprintImg,
            link: "/games",
        },
    ];

    return (
        <section className="py-12 md:py-20">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-center text-text-light dark:text-text-dark">Our Games</h2>
            <p className="mt-4 text-lg text-center text-text-secondary-light dark:text-text-secondary-dark">Learn and have fun while saving the planet.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {games.map((game, index) => (
                    <GameCard key={index} {...game} isLoggedIn={!!currentUser} />
                ))}
            </div>
        </section>
    );
};

export default GamesSection;