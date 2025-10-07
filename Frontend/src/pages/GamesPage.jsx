import React from 'react';
import Games from '../components/Games';

const GamesPage = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white transition-colors duration-300">
            <Games />
        </div>
    );
};

export default GamesPage;