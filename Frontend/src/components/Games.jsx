import React from 'react';
import { Link } from 'react-router-dom';
import { games } from '../data/games';

const Games = () => {
    const featuredGame = games.find(game => game.featured);
    const otherGames = games.filter(game => !game.featured);

    return (
        <div className="container mx-auto p-4">
            <header className="flex justify-between items-center mb-6 lg:hidden">
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <span className="material-icons">menu</span>
                </button>
                <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <span className="material-icons">notifications</span>
                    <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>
            </header>
            <div className="hidden lg:flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Browse games</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input type="text" placeholder="Search games..." className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary" />
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    </div>
                    <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <span className="material-icons">notifications</span>
                        <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                </div>
            </div>
            <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
                <button className="px-4 py-2 text-sm font-semibold rounded-full bg-primary text-white shadow-md">Action</button>
                <button className="px-4 py-2 text-sm font-semibold rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">Family</button>
                <button className="px-4 py-2 text-sm font-semibold rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">Puzzle</button>
                <button className="px-4 py-2 text-sm font-semibold rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">Racing</button>
                <button className="px-4 py-2 text-sm font-semibold rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">Adventure</button>
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Featured games</h2>
            <Link to={featuredGame.path} className="block">
                <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8 h-48 md:h-64 lg:h-96">
                    <img 
                        alt={featuredGame.title} 
                        className="w-full h-full object-cover" 
                        src={featuredGame.thumbnail}
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <button className="absolute top-4 right-4 p-2 rounded-full bg-white/30 text-white backdrop-blur-sm">
                        <span className="material-icons">favorite_border</span>
                    </button>
                    <div className="absolute bottom-0 left-0 p-4 text-white lg:p-8">
                        <h3 className="text-xl lg:text-3xl font-bold">{featuredGame.title}</h3>
                        <p className="text-xs text-gray-300 mt-1 lg:text-sm">{featuredGame.description}</p>
                    </div>
                </div>
            </Link>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">All Games</h2>
                <a className="text-sm text-primary font-semibold" href="#">See all</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherGames.map(game => {
                    return (
                        <div key={game.id} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                            <img 
                                alt={game.title} 
                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover mr-3 sm:mr-4 flex-shrink-0" 
                                src={game.thumbnailSquare || game.thumbnail}
                                loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 dark:text-white truncate">{game.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{game.description}</p>
                            </div>
                            <Link 
                                to={game.path} 
                                className="px-3 py-2 sm:px-5 text-sm font-semibold rounded-full bg-primary/20 dark:bg-primary/30 text-primary dark:text-blue-300 flex-shrink-0"
                            >
                                Play
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Games;