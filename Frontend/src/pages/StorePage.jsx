import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import BottomNavbar from '../components/BottomNavbar';
import SideNavbar from '../components/SideNavbar';

const StorePage = () => {
    const { currentUser } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('badges');
    const [userPoints] = useState(1250); // Mock user points

    const categories = [
        { id: 'badges', name: 'Badges', icon: 'military_tech' },
        { id: 'avatars', name: 'Avatars', icon: 'face' },
        { id: 'themes', name: 'Themes', icon: 'palette' },
        { id: 'powerups', name: 'Power-ups', icon: 'bolt' },
        { id: 'titles', name: 'Titles', icon: 'star' }
    ];

    const storeItems = {
        badges: [
            { id: 1, name: 'Eco Warrior', price: 100, icon: '🌱', rarity: 'common', owned: false },
            { id: 2, name: 'Tree Hugger', price: 150, icon: '🌳', rarity: 'common', owned: true },
            { id: 3, name: 'Ocean Guardian', price: 200, icon: '🌊', rarity: 'rare', owned: false },
            { id: 4, name: 'Solar Champion', price: 300, icon: '☀️', rarity: 'rare', owned: false },
            { id: 5, name: 'Planet Protector', price: 500, icon: '🌍', rarity: 'epic', owned: false },
            { id: 6, name: 'Climate Hero', price: 750, icon: '⚡', rarity: 'legendary', owned: false }
        ],
        avatars: [
            { id: 1, name: 'Eco Explorer', price: 200, icon: '👨‍🌾', rarity: 'common', owned: false },
            { id: 2, name: 'Nature Scientist', price: 250, icon: '👩‍🔬', rarity: 'common', owned: false },
            { id: 3, name: 'Forest Ranger', price: 350, icon: '🧑‍🌲', rarity: 'rare', owned: false },
            { id: 4, name: 'Ocean Diver', price: 400, icon: '🤿', rarity: 'rare', owned: false },
            { id: 5, name: 'Space Environmentalist', price: 600, icon: '👨‍🚀', rarity: 'epic', owned: false }
        ],
        themes: [
            { id: 1, name: 'Forest Green', price: 150, icon: '🌲', rarity: 'common', owned: false },
            { id: 2, name: 'Ocean Blue', price: 200, icon: '🌊', rarity: 'common', owned: false },
            { id: 3, name: 'Sunset Orange', price: 300, icon: '🌅', rarity: 'rare', owned: false },
            { id: 4, name: 'Aurora Borealis', price: 500, icon: '🌌', rarity: 'epic', owned: false }
        ],
        powerups: [
            { id: 1, name: '2x Points Boost', price: 100, icon: '⚡', rarity: 'common', owned: false, duration: '1 hour' },
            { id: 2, name: 'Challenge Skip', price: 150, icon: '⏭️', rarity: 'common', owned: false, uses: '1 use' },
            { id: 3, name: 'Hint Revealer', price: 75, icon: '💡', rarity: 'common', owned: false, uses: '3 uses' },
            { id: 4, name: 'Streak Protector', price: 200, icon: '🛡️', rarity: 'rare', owned: false, uses: '1 use' }
        ],
        titles: [
            { id: 1, name: 'Eco Novice', price: 50, icon: '🌱', rarity: 'common', owned: true },
            { id: 2, name: 'Green Guardian', price: 200, icon: '🛡️', rarity: 'rare', owned: false },
            { id: 3, name: 'Earth\'s Champion', price: 400, icon: '👑', rarity: 'epic', owned: false },
            { id: 4, name: 'Planet Savior', price: 800, icon: '🌟', rarity: 'legendary', owned: false }
        ]
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return 'border-gray-300 bg-gray-50';
            case 'rare': return 'border-blue-300 bg-blue-50';
            case 'epic': return 'border-purple-300 bg-purple-50';
            case 'legendary': return 'border-yellow-300 bg-yellow-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    const getRarityTextColor = (rarity) => {
        switch (rarity) {
            case 'common': return 'text-gray-600';
            case 'rare': return 'text-blue-600';
            case 'epic': return 'text-purple-600';
            case 'legendary': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <SideNavbar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button className="lg:hidden" onClick={() => window.history.back()}>
                                <span className="material-symbols-outlined text-2xl text-gray-600">arrow_back</span>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">Eco Store</h1>
                        </div>
                        <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                            <span className="material-symbols-outlined text-green-600">eco</span>
                            <span className="font-bold text-green-700">{userPoints.toLocaleString()}</span>
                            <span className="text-green-600 text-sm">points</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
                {/* Categories */}
                <div className="mb-8">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                                    selectedCategory === category.id
                                        ? 'bg-green-500 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">{category.icon}</span>
                                <span className="font-medium">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Store Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {storeItems[selectedCategory]?.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-md ${getRarityColor(item.rarity)} ${
                                item.owned ? 'opacity-75' : ''
                            }`}
                        >
                            {/* Item Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-4xl">{item.icon}</div>
                                <div className="flex flex-col items-end">
                                    <span className={`text-xs font-medium uppercase tracking-wide ${getRarityTextColor(item.rarity)}`}>
                                        {item.rarity}
                                    </span>
                                    {item.owned && (
                                        <span className="text-xs text-green-600 font-medium mt-1">OWNED</span>
                                    )}
                                </div>
                            </div>

                            {/* Item Info */}
                            <div className="mb-4">
                                <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                                {item.duration && (
                                    <p className="text-sm text-gray-600">Duration: {item.duration}</p>
                                )}
                                {item.uses && (
                                    <p className="text-sm text-gray-600">Uses: {item.uses}</p>
                                )}
                            </div>

                            {/* Price and Action */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                    <span className="material-symbols-outlined text-green-600 text-lg">eco</span>
                                    <span className="font-bold text-gray-800">{item.price}</span>
                                </div>
                                
                                {item.owned ? (
                                    <button className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed">
                                        Owned
                                    </button>
                                ) : userPoints >= item.price ? (
                                    <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
                                        Buy
                                    </button>
                                ) : (
                                    <button className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed">
                                        Not enough points
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Daily Deals Section */}
                <section className="mt-12">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Daily Deals</h2>
                                <p className="opacity-90">Limited time offers - refresh in 12:34:56</p>
                            </div>
                            <span className="material-symbols-outlined text-4xl">local_offer</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border-2 border-purple-300 bg-purple-50 p-6 relative overflow-hidden">
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                50% OFF
                            </div>
                            <div className="text-4xl mb-4">🏆</div>
                            <h3 className="font-bold text-gray-800 mb-2">Victory Crown</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="material-symbols-outlined text-green-600">eco</span>
                                    <span className="line-through text-gray-500">400</span>
                                    <span className="font-bold text-gray-800">200</span>
                                </div>
                                <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-300 bg-blue-50 p-6 relative overflow-hidden">
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                30% OFF
                            </div>
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="font-bold text-gray-800 mb-2">Rocket Boost</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="material-symbols-outlined text-green-600">eco</span>
                                    <span className="line-through text-gray-500">150</span>
                                    <span className="font-bold text-gray-800">105</span>
                                </div>
                                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border-2 border-yellow-300 bg-yellow-50 p-6 relative overflow-hidden">
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                25% OFF
                            </div>
                            <div className="text-4xl mb-4">🌟</div>
                            <h3 className="font-bold text-gray-800 mb-2">Star Collector</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="material-symbols-outlined text-green-600">eco</span>
                                    <span className="line-through text-gray-500">300</span>
                                    <span className="font-bold text-gray-800">225</span>
                                </div>
                                <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                </main>
                <BottomNavbar />
            </div>
        </div>
    );
};

export default StorePage;