import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import VariableProximity from './VariableProximity';

const HeroSection = () => {
    const containerRef = useRef(null);

    return (
        <div className="relative w-full h-[350px] md:h-[400px] lg:h-[450px] rounded-3xl overflow-hidden shadow-soft-lg group mt-4 md:mt-6">
            {/* Background Image with Parallax Effect */}
            <motion.div
                className="absolute inset-0 w-full h-full"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            >
                <img
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
                    alt="Lush green forest"
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            {/* Floating Elements */}
            <motion.div
                className="absolute top-4 right-4 md:top-6 md:right-6 lg:top-10 lg:right-10 hidden md:block"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                <div className="bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl p-2 md:p-3 lg:p-4 text-white shadow-lg border border-white/10">
                    <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="material-icons text-white text-lg md:text-xl">recycling</span>
                        </div>
                        <div>
                            <div className="text-xs md:text-sm font-bold">Waste Sorted!</div>
                            <div className="text-xs opacity-90 text-green-200">+50 XP</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="absolute top-20 md:top-24 lg:top-28 left-4 md:left-6 lg:left-10 hidden lg:block"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
            >
                <div className="bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl p-2 md:p-3 lg:p-4 text-white shadow-lg border border-white/10">
                    <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="material-icons text-white text-lg md:text-xl">water_drop</span>
                        </div>
                        <div>
                            <div className="text-xs md:text-sm font-bold">Save Water</div>
                            <div className="text-xs opacity-90 text-blue-200">Daily Goal</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="relative h-full flex flex-col justify-end p-4 md:p-8 lg:p-12 pb-6 md:pb-10 lg:pb-12 z-10">
                <motion.h1
                    className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-white drop-shadow-xl leading-tight"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div
                        ref={containerRef}
                        style={{ position: 'relative', display: 'inline-block' }}
                    >
                        <VariableProximity
                            label={'Join the'}
                            className={'text-white cursor-pointer mr-2 md:mr-4'}
                            fromFontVariationSettings="'wght' 400, 'opsz' 9"
                            toFontVariationSettings="'wght' 1000, 'opsz' 40"
                            containerRef={containerRef}
                            radius={100}
                            falloff='linear'
                        />
                        <br />
                        <VariableProximity
                            label={'Green Revolution'}
                            className={'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 cursor-pointer'}
                            fromFontVariationSettings="'wght' 400, 'opsz' 9"
                            toFontVariationSettings="'wght' 1000, 'opsz' 40"
                            containerRef={containerRef}
                            radius={100}
                            falloff='linear'
                        />
                        <span className="text-white">.</span>
                    </div>
                </motion.h1>
                <motion.p
                    className="mt-3 md:mt-4 lg:mt-6 text-sm md:text-lg lg:text-xl text-gray-100 max-w-xl md:max-w-2xl drop-shadow-md leading-relaxed"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                >
                    PixelPlanet transforms environmental education into engaging quests and real-world impact. Start your journey today.
                </motion.p>
            </div>
        </div>
    );
};

export default HeroSection;