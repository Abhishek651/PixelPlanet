const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

let db, admin;
try {
    const firebaseConfig = require('../firebaseConfig');
    db = firebaseConfig.db;
    admin = firebaseConfig.admin;
} catch (error) {
    console.error('Firebase not initialized in game-profile route:', error.message);
}

// Get player profile
router.get('/profile/:userId', verifyToken, async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not available' });
        }
        const { userId } = req.params;
        
        // Verify user can only access their own profile (unless admin)
        if (req.uid !== userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const profileDoc = await db.collection('gameProfiles').doc(userId).get();
        
        if (!profileDoc.exists) {
            // Create new profile
            const newProfile = createNewProfile(userId);
            await db.collection('gameProfiles').doc(userId).set(newProfile);
            return res.json(newProfile);
        }
        
        res.json(profileDoc.data());
    } catch (error) {
        console.error('Error loading profile:', error);
        res.status(500).json({ error: 'Failed to load profile' });
    }
});

// Save player profile
router.post('/profile', verifyToken, async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not available' });
        }
        const profile = req.body;
        
        // Verify user can only save their own profile
        if (req.uid !== profile.userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        profile.lastUpdated = new Date().toISOString();
        
        await db.collection('gameProfiles').doc(profile.userId).set(profile, { merge: true });
        
        res.json({ success: true, profile });
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ error: 'Failed to save profile' });
    }
});

// Log game session for analytics
router.post('/session', verifyToken, async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not available' });
        }
        const { userId, levelId, performance, duration } = req.body;
        
        // Verify user
        if (req.uid !== userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const session = {
            userId,
            levelId,
            performance,
            duration,
            timestamp: new Date().toISOString()
        };
        
        await db.collection('gameSessions').add(session);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error logging session:', error);
        res.status(500).json({ error: 'Failed to log session' });
    }
});

// Get user's game statistics
router.get('/stats/:userId', verifyToken, async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not available' });
        }
        const { userId } = req.params;
        
        if (req.uid !== userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const profile = await db.collection('gameProfiles').doc(userId).get();
        
        if (!profile.exists) {
            return res.json({ totalGames: 0, levelStats: {}, categoryMastery: {} });
        }
        
        const data = profile.data();
        res.json({
            totalGames: data.totalGamesPlayed || 0,
            currentLevel: data.currentLevelId || 1,
            bestLevel: data.bestLevelUnlocked || 1,
            levelStats: data.levelStats || {},
            categoryMastery: data.categoryMastery || {}
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

function createNewProfile(userId) {
    return {
        userId: userId,
        username: "Player",
        currentLevelId: 1,
        bestLevelUnlocked: 1,
        totalGamesPlayed: 0,
        seenBins: [],
        seenItems: [],
        levelStats: {},
        categoryMastery: {},
        confusionMatrix: {},
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
}

module.exports = router;
