import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { getLevelFromXP, getLevelTitle, getLevelColor } from '../utils/xpSystem';

const XPProgressBar = ({ className = '', showTitle = true }) => {
    const { currentUser } = useAuth();
    const [levelInfo, setLevelInfo] = useState({
        level: 1,
        currentLevelXP: 0,
        xpForNextLevel: 100,
        progress: 0
    });
    const [prevProgress, setPrevProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        // Real-time listener for XP
        const unsubscribe = onSnapshot(
            doc(db, 'users', currentUser.uid),
            (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    const totalXP = data.xp || 0;
                    const newLevelInfo = getLevelFromXP(totalXP);
                    
                    setPrevProgress(levelInfo.progress);
                    setLevelInfo(newLevelInfo);
                }
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching XP data:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser, levelInfo.progress]);

    if (!currentUser || loading) {
        return null;
    }

    const { level, currentLevelXP, xpForNextLevel, progress } = levelInfo;
    const levelTitle = getLevelTitle(level);
    const gradientColor = getLevelColor(level);
    const hasProgressChanged = prevProgress !== progress && prevProgress !== 0;

    return (
        <motion.div 
            className={`w-full ${className}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {showTitle && (
                <motion.div 
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-2">
                        <motion.span 
                            className="text-lg sm:text-xl md:text-2xl"
                            animate={hasProgressChanged ? {
                                rotate: [0, 10, -10, 10, -10, 0],
                                scale: [1, 1.3, 1]
                            } : {}}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            ⭐
                        </motion.span>
                        <div>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={level}
                                    initial={{ y: 10, opacity: 0, scale: 0.8 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: -10, opacity: 0, scale: 0.8 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="text-xs sm:text-sm md:text-base font-bold text-gray-800 dark:text-white"
                                >
                                    Level {level}
                                </motion.p>
                            </AnimatePresence>
                            <motion.p 
                                className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400"
                                animate={hasProgressChanged ? { scale: [1, 1.05, 1] } : {}}
                            >
                                {levelTitle}
                            </motion.p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={`${currentLevelXP}-${xpForNextLevel}`}
                                initial={{ y: 10, opacity: 0, scale: 0.8 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -10, opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400"
                            >
                                {currentLevelXP.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
                            </motion.p>
                        </AnimatePresence>
                        <motion.p 
                            className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500"
                            animate={hasProgressChanged ? { scale: [1, 1.1, 1] } : {}}
                        >
                            {Math.floor(progress)}% to next level
                        </motion.p>
                    </div>
                </motion.div>
            )}
            
            {/* Progress Bar */}
            <div className="relative w-full h-4 sm:h-5 md:h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <motion.div
                    className={`h-full bg-gradient-to-r ${gradientColor} rounded-full flex items-center justify-end pr-1 sm:pr-2 relative`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ 
                        duration: 1.2, 
                        ease: [0.4, 0, 0.2, 1],
                        type: "spring",
                        stiffness: 50,
                        damping: 20
                    }}
                >
                    {/* Pulse effect when progress changes */}
                    {hasProgressChanged && (
                        <motion.div
                            className="absolute inset-0 bg-white/30 rounded-full"
                            initial={{ opacity: 0.5, scale: 1 }}
                            animate={{ opacity: 0, scale: 1.5 }}
                            transition={{ duration: 0.6 }}
                        />
                    )}
                    
                    {/* Percentage text */}
                    {progress > 10 && (
                        <motion.span 
                            className="text-[10px] sm:text-xs md:text-sm font-bold text-white drop-shadow-lg relative z-10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                        >
                            {Math.floor(progress)}%
                        </motion.span>
                    )}
                    
                    {/* Animated glow effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 rounded-full"
                        animate={{
                            x: ['-100%', '100%']
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 1,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
                
                {/* Animated shine effect on bar background */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                    animate={{
                        x: ['-100%', '200%']
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                    }}
                />
                
                {/* Sparkle particles when progress changes */}
                {hasProgressChanged && (
                    <>
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full shadow-lg"
                                style={{
                                    left: `${Math.max(0, Math.min(100, progress - 10 + Math.random() * 20))}%`,
                                    top: `${Math.random() * 100}%`
                                }}
                                initial={{ opacity: 1, scale: 0 }}
                                animate={{ 
                                    opacity: 0, 
                                    scale: [0, 2, 0],
                                    y: [-5, -25],
                                    x: [0, (Math.random() - 0.5) * 20]
                                }}
                                transition={{ 
                                    duration: 1,
                                    delay: i * 0.08,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default XPProgressBar;
