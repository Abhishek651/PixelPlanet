import React, { useState } from 'react';
import BottomNavbar from '../components/BottomNavbar';
import SideNavbar from '../components/SideNavbar';

const GreenFeedPage = () => {
    const [activeTab, setActiveTab] = useState('posts');

    const posts = [
        {
            id: 1,
            user: 'EcoWarrior_Sarah',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2940&auto=format&fit=crop',
            caption: 'Planted 50 trees today with my local community! 🌳 Every small action counts towards a greener future. #TreePlanting #EcoAction',
            likes: 234,
            comments: 18,
            time: '2h'
        },
        {
            id: 2,
            user: 'GreenTech_Mike',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2940&auto=format&fit=crop',
            caption: 'Solar panel installation complete! ☀️ Now generating 100% clean energy for our home. The future is renewable! #SolarPower #CleanEnergy',
            likes: 189,
            comments: 25,
            time: '4h'
        },
        {
            id: 3,
            user: 'OceanSaver_Lisa',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2940&auto=format&fit=crop',
            caption: 'Beach cleanup success! 🏖️ Removed 200kg of plastic waste today. Together we can save our oceans! #BeachCleanup #OceanConservation',
            likes: 312,
            comments: 42,
            time: '6h'
        }
    ];

    const reels = [
        {
            id: 1,
            user: 'EcoTips_Daily',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            video: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2940&auto=format&fit=crop',
            title: '5 Easy Ways to Reduce Plastic Waste',
            views: '12.5K',
            likes: 892
        },
        {
            id: 2,
            user: 'PlantBased_Chef',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
            video: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2940&auto=format&fit=crop',
            title: 'Quick Plant-Based Meal Prep',
            views: '8.2K',
            likes: 654
        },
        {
            id: 3,
            user: 'Urban_Gardener',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            video: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2940&auto=format&fit=crop',
            title: 'Growing Herbs in Small Spaces',
            views: '15.7K',
            likes: 1203
        }
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <SideNavbar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b sticky top-0 z-30">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <span className="material-symbols-outlined text-green-500 mr-2">eco</span>
                            Green Feed
                        </h1>
                        <button className="p-2 text-gray-600">
                            <span className="material-symbols-outlined text-2xl">add_circle</span>
                        </button>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex mt-4 border-b">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex-1 py-2 text-center font-medium ${
                                activeTab === 'posts' 
                                    ? 'text-green-500 border-b-2 border-green-500' 
                                    : 'text-gray-500'
                            }`}
                        >
                            Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('reels')}
                            className={`flex-1 py-2 text-center font-medium ${
                                activeTab === 'reels' 
                                    ? 'text-green-500 border-b-2 border-green-500' 
                                    : 'text-gray-500'
                            }`}
                        >
                            Reels
                        </button>
                    </div>
                </div>
            </header>

            <main className="p-4">
                {activeTab === 'posts' ? (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                {/* Post Header */}
                                <div className="flex items-center p-4">
                                    <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full" />
                                    <div className="ml-3 flex-1">
                                        <p className="font-semibold text-gray-800">{post.user}</p>
                                        <p className="text-xs text-gray-500">{post.time} ago</p>
                                    </div>
                                    <button className="text-gray-400">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </div>

                                {/* Post Image */}
                                <img src={post.image} alt="Post" className="w-full h-64 object-cover" />

                                {/* Post Actions */}
                                <div className="p-4">
                                    <div className="flex items-center space-x-4 mb-3">
                                        <button className="flex items-center space-x-1 text-gray-600">
                                            <span className="material-symbols-outlined text-red-500">favorite</span>
                                            <span className="text-sm">{post.likes}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 text-gray-600">
                                            <span className="material-symbols-outlined">chat_bubble</span>
                                            <span className="text-sm">{post.comments}</span>
                                        </button>
                                        <button className="text-gray-600">
                                            <span className="material-symbols-outlined">share</span>
                                        </button>
                                    </div>
                                    <p className="text-gray-800 text-sm">{post.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {reels.map((reel) => (
                            <div key={reel.id} className="relative bg-black rounded-xl overflow-hidden aspect-[9/16]">
                                <img src={reel.video} alt="Reel" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                
                                {/* Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <span className="material-symbols-outlined text-white text-2xl">play_arrow</span>
                                    </button>
                                </div>

                                {/* Reel Info */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                    <div className="flex items-center mb-2">
                                        <img src={reel.avatar} alt={reel.user} className="w-6 h-6 rounded-full mr-2" />
                                        <span className="text-xs font-medium">{reel.user}</span>
                                    </div>
                                    <p className="text-sm font-semibold mb-1">{reel.title}</p>
                                    <div className="flex items-center space-x-3 text-xs">
                                        <span className="flex items-center">
                                            <span className="material-symbols-outlined text-sm mr-1">visibility</span>
                                            {reel.views}
                                        </span>
                                        <span className="flex items-center">
                                            <span className="material-symbols-outlined text-sm mr-1">favorite</span>
                                            {reel.likes}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

                <BottomNavbar />
            </div>
        </div>
    );
};

export default GreenFeedPage;