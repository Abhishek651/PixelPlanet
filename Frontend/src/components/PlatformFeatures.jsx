import React from 'react';

const PlatformFeatures = () => {
    return (
        <section id="features" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Platform Features</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Discover how PixelPlanet transforms environmental education through gamification, AI-powered content creation, and real-world impact tracking.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    <div className="card-hover bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
                        <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
                            <span className="material-icons text-white text-3xl">monetization_on</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">EcoPoints System</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Earn points for every environmental action. Plant trees, sort waste, reduce energy consumption, and watch your impact grow.
                        </p>
                    </div>

                    <div className="card-hover bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
                        <div className="w-16 h-16 bg-secondary rounded-xl mx-auto mb-6 flex items-center justify-center">
                            <span className="material-icons text-white text-3xl">sports_esports</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Interactive Mini-Games</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Learn through play with engaging games like waste sorting, carbon footprint calculators, and ecosystem builders.
                        </p>
                    </div>

                    <div className="card-hover bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
                        <div className="w-16 h-16 bg-green-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
                            <span className="material-icons text-white text-3xl">emoji_events</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Leaderboards</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Compete with classmates and schools worldwide. Track your progress and celebrate environmental achievements together.
                        </p>
                    </div>

                    <div className="card-hover bg-gradient-to-br from-orange-500/5 to-orange-500/10 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
                        <div className="w-16 h-16 bg-orange-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
                            <span className="material-icons text-white text-3xl">assignment</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Real-World Challenges</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Complete meaningful environmental tasks in your community. From beach cleanups to energy audits, make a real difference.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlatformFeatures;
