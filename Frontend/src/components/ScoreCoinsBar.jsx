import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { getLevelFromXP } from '../utils/xpSystem';

const ScoreCoinsBar = ({ className = '' }) => {
    const { currentUser } = useAuth();
    const [ecoPoints, setEcoPoints] = useState(0);
    const [coins, setCoins] = useState(0);
    const [level, setLevel] = useState(1);
    const [loading, setLoading] = useState(true);
    const [prevValues, setPrevValues] = useState({ ecoPoints: 0, coins: 0, level: 1 });

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        // Real-time listener for user data
        const unsubscribe = onSnapshot(
            doc(db, 'users', currentUser.uid),
            (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    const newEcoPoints = data.ecoPoints || 0;
                    const newCoins = data.coins || 0;
                    
                    // Calculate level from XP
                    const xp = data.xp || 0;
                    const levelInfo = getLevelFromXP(xp);
                    const newLevel = levelInfo.level;
                    
                    // Store previous values for animation detection
                    setPrevValues({ ecoPoints, coins, level });
                    
                    setEcoPoints(newEcoPoints);
                    setCoins(newCoins);
                    setLevel(newLevel);
                }
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser, ecoPoints, coins, level]);

    if (!currentUser || loading) {
        return null;
    }

    const hasLevelChanged = prevValues.level !== level;
    const hasEcoPointsChanged = prevValues.ecoPoints !== ecoPoints;
    const hasCoinsChanged = prevValues.coins !== coins;

    const badgeVariants = {
        initial: { scale: 0.8, opacity: 0, y: 20 },
        animate: { 
            scale: 1, 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15
            }
        },
        hover: { 
            scale: 1.05,
            y: -2,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        },
        tap: { scale: 0.95 }
    };

    return (
        <div className={`flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 ${className}`}>
            {/* Level Badge */}
            <motion.div
                variants={badgeVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full shadow-lg cursor-pointer relative overflow-hidden min-w-[80px] sm:min-w-[100px]"
            >
                {/* Shine effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                        x: ['-100%', '100%']
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                    }}
                />
                {/* Pulse effect when level changes */}
                {hasLevelChanged && (
                    <motion.div
                        className="absolute inset-0 bg-white/30 rounded-full"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    />
                )}
                <motion.span 
                    className="text-base sm:text-lg md:text-xl relative z-10"
                    animate={hasLevelChanged ? { 
                        rotate: [0, 360],
                        scale: [1, 1.3, 1]
                    } : {}}
                    transition={{ duration: 0.8 }}
                >
                    ⭐
                </motion.span>
                <div className="flex flex-col relative z-10">
                    <span className="text-[10px] sm:text-xs font-medium opacity-90 leading-tight">Level</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={level}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="text-sm sm:text-base md:text-lg font-bold leading-none"
                        >
                            {level}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Eco Points Badge */}
            <motion.div
                variants={badgeVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full shadow-lg cursor-pointer relative overflow-hidden min-w-[90px] sm:min-w-[120px]"
            >
                {/* Shine effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                        x: ['-100%', '100%']
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        delay: 0.5
                    }}
                />
                {/* Pulse effect when points change */}
                {hasEcoPointsChanged && (
                    <motion.div
                        className="absolute inset-0 bg-white/30 rounded-full"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    />
                )}
                <motion.span 
                    className="text-base sm:text-lg md:text-xl relative z-10"
                    animate={hasEcoPointsChanged ? { 
                        rotate: [0, 10, -10, 10, -10, 0],
                        scale: [1, 1.2, 1]
                    } : {}}
                    transition={{ duration: 0.6 }}
                >
                    🌱
                </motion.span>
                <div className="flex flex-col relative z-10">
                    <span className="text-[10px] sm:text-xs font-medium opacity-90 leading-tight hidden sm:block">Eco Points</span>
                    <span className="text-[10px] sm:hidden font-medium opacity-90 leading-tight">Points</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={ecoPoints}
                            initial={{ y: 10, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -10, opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="text-sm sm:text-base md:text-lg font-bold leading-none"
                        >
                            {ecoPoints.toLocaleString()}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Coins Badge */}
            <motion.div
                variants={badgeVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full shadow-lg cursor-pointer relative overflow-hidden min-w-[80px] sm:min-w-[100px]"
            >
                {/* Shine effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                        x: ['-100%', '100%']
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        delay: 1
                    }}
                />
                {/* Pulse effect when coins change */}
                {hasCoinsChanged && (
                    <motion.div
                        className="absolute inset-0 bg-white/30 rounded-full"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    />
                )}
                <motion.span 
                    className="text-base sm:text-lg md:text-xl relative z-10"
                    animate={hasCoinsChanged ? { 
                        rotate: [0, 360],
                        scale: [1, 1.3, 1]
                    } : {}}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                    🪙
                </motion.span>
                <div className="flex flex-col relative z-10">
                    <span className="text-[10px] sm:text-xs font-medium opacity-90 leading-tight">Coins</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={coins}
                            initial={{ y: 10, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -10, opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="text-sm sm:text-base md:text-lg font-bold leading-none"
                        >
                            {coins.toLocaleString()}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ScoreCoinsBar;
