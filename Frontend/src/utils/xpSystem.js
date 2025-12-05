// XP and Level System Utilities

/**
 * Calculate XP required for a specific level
 * Formula: 100 * level^1.5 (exponential growth)
 */
export const getXPForLevel = (level) => {
    return Math.floor(100 * Math.pow(level, 1.5));
};

/**
 * Calculate total XP required to reach a level
 */
export const getTotalXPForLevel = (level) => {
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += getXPForLevel(i);
    }
    return total;
};

/**
 * Calculate level from total XP
 */
export const getLevelFromXP = (totalXP) => {
    let level = 1;
    let xpNeeded = 0;
    
    while (totalXP >= xpNeeded + getXPForLevel(level)) {
        xpNeeded += getXPForLevel(level);
        level++;
    }
    
    return {
        level,
        currentLevelXP: totalXP - xpNeeded,
        xpForNextLevel: getXPForLevel(level),
        progress: ((totalXP - xpNeeded) / getXPForLevel(level)) * 100
    };
};

/**
 * XP rewards for different activities
 */
export const XP_REWARDS = {
    QUIZ_COMPLETE: 50,
    QUIZ_PERFECT: 100, // All answers correct
    GAME_LEVEL_1: 30,
    GAME_LEVEL_2: 40,
    GAME_LEVEL_3: 50,
    GAME_LEVEL_4: 60,
    GAME_LEVEL_5: 70,
    CHALLENGE_COMPLETE: 75,
    DAILY_LOGIN: 10,
    STREAK_BONUS: 20, // Per day of streak
};

/**
 * Calculate XP for game completion
 */
export const getGameXP = (level) => {
    const baseXP = 30;
    return baseXP + (level * 10);
};

/**
 * Calculate XP for quiz based on performance
 */
export const getQuizXP = (correctAnswers, totalQuestions) => {
    const baseXP = XP_REWARDS.QUIZ_COMPLETE;
    const perfectBonus = correctAnswers === totalQuestions ? XP_REWARDS.QUIZ_PERFECT - baseXP : 0;
    const performanceBonus = Math.floor((correctAnswers / totalQuestions) * 50);
    
    return baseXP + perfectBonus + performanceBonus;
};

/**
 * Get level title based on level number
 */
export const getLevelTitle = (level) => {
    if (level >= 50) return 'Eco Legend';
    if (level >= 40) return 'Planet Protector';
    if (level >= 30) return 'Green Guardian';
    if (level >= 20) return 'Eco Champion';
    if (level >= 15) return 'Nature Defender';
    if (level >= 10) return 'Eco Warrior';
    if (level >= 5) return 'Green Explorer';
    return 'Eco Beginner';
};

/**
 * Get level color based on level number
 */
export const getLevelColor = (level) => {
    if (level >= 50) return 'from-purple-500 to-pink-500';
    if (level >= 40) return 'from-red-500 to-orange-500';
    if (level >= 30) return 'from-yellow-500 to-orange-500';
    if (level >= 20) return 'from-green-500 to-emerald-500';
    if (level >= 10) return 'from-blue-500 to-cyan-500';
    return 'from-gray-500 to-gray-600';
};
