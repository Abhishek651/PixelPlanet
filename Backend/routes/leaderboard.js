const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const { db, admin } = require('../firebaseConfig');

// --- MIDDLEWARE: VERIFY FIREBASE ID TOKEN ---
const verifyToken = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).send({ message: 'Authorization header missing.' });
    }
    const token = header.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'Token missing.' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.uid = decodedToken.uid;
        req.userRole = decodedToken.role;
        req.instituteId = decodedToken.instituteId;
        
        // If custom claims are missing, fetch from Firestore
        if (!req.instituteId || !req.userRole) {
            const userDoc = await db.collection('users').doc(req.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                req.instituteId = req.instituteId || userData.instituteId;
                req.userRole = req.userRole || userData.role;
            }
        }
        
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).send({ message: 'Invalid or expired token.' });
    }
};

// --- HELPER FUNCTIONS ---
const getTimeRangeFilter = (timeRange) => {
    const now = admin.firestore.Timestamp.now();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    
    switch (timeRange) {
        case 'week':
            return now.toMillis() - (7 * millisecondsPerDay);
        case 'month':
            return now.toMillis() - (30 * millisecondsPerDay);
        default:
            return 0;
    }
};

const buildLeaderboardResponse = (users, startRank = 1) => {
    return users.map((user, index) => ({
        rank: startRank + index,
        name: user.name,
        ecoPoints: user.ecoPoints || 0,
        class: user.class,
        section: user.section,
    }));
};

const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

// GET /global - Global Leaderboard
router.get('/global', [
    query('class').optional(),
    query('activityType').optional().isIn(['physical', 'quiz_auto', 'quiz_manual', 'video']),
    query('timeRange').optional().isIn(['week', 'month', 'all']),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { class: classValue, activityType, timeRange = 'all', limit = 50 } = req.query;
        let users = [];

        if (activityType) {
            const userIds = new Set();
            const challengesQuery = db.collection('challenges').where('type', '==', activityType);
            const challengesSnapshot = await challengesQuery.get();
            const timeFilter = timeRange !== 'all' ? getTimeRangeFilter(timeRange) : 0;
            
            challengesSnapshot.forEach(doc => {
                const challenge = doc.data();
                if (challenge.submissions) {
                    challenge.submissions
                        .filter(sub => 
                            sub.isVerified && 
                            sub.approved && 
                            (timeRange === 'all' || 
                             (sub.submittedAt && sub.submittedAt.toMillis() >= timeFilter))
                        )
                        .forEach(sub => userIds.add(sub.studentId));
                }
            });

            if (userIds.size === 0) {
                return res.json({ leaderboard: [] });
            }

            const userIdChunks = chunkArray(Array.from(userIds), 10);
            for (const chunk of userIdChunks) {
                const chunkQuery = db.collection('users')
                    .where(admin.firestore.FieldPath.documentId(), 'in', chunk)
                    .where('role', '==', 'student');

                const chunkSnapshot = await chunkQuery.get();
                chunkSnapshot.forEach(doc => {
                    const userData = doc.data();
                    if (!classValue || userData.class === classValue) {
                        users.push(userData);
                    }
                });
            }
        } else {
            let usersQuery = db.collection('users').where('role', '==', 'student');

            if (classValue) {
                usersQuery = usersQuery.where('class', '==', classValue);
                const usersSnapshot = await usersQuery.get();
                usersSnapshot.forEach(doc => {
                    users.push(doc.data());
                });
            } else {
                usersQuery = usersQuery.orderBy('ecoPoints', 'desc').limit(limit);
                const usersSnapshot = await usersQuery.get();
                usersSnapshot.forEach(doc => {
                    users.push(doc.data());
                });
            }
        }

        users.sort((a, b) => (b.ecoPoints || 0) - (a.ecoPoints || 0));
        users = users.slice(0, limit);

        const leaderboard = buildLeaderboardResponse(users);
        res.json({ leaderboard });

    } catch (error) {
        console.error('Error fetching global leaderboard:', error);
        res.status(500).json({ message: 'Failed to fetch leaderboard.' });
    }
});

// GET /institute - Institute Specific Leaderboard
router.get('/institute', verifyToken, [
    query('class').optional(),
    query('activityType').optional().isIn(['physical', 'quiz_auto', 'quiz_manual', 'video']),
    query('timeRange').optional().isIn(['week', 'month', 'all']),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { class: classValue, activityType, timeRange = 'all', limit = 50 } = req.query;
        let users = [];

        // Check if user has instituteId
        if (!req.instituteId) {
            console.error('User missing instituteId:', req.uid);
            // Fallback: return global leaderboard
            const usersQuery = db.collection('users')
                .where('role', '==', 'student')
                .orderBy('ecoPoints', 'desc')
                .limit(limit);
            
            const usersSnapshot = await usersQuery.get();
            usersSnapshot.forEach(doc => {
                users.push(doc.data());
            });
            
            const leaderboard = buildLeaderboardResponse(users);
            return res.json({ leaderboard, fallback: true });
        }

        if (activityType) {
            const userIds = new Set();
            const challengesQuery = db.collection('challenges')
                .where('type', '==', activityType)
                .where('instituteId', '==', req.instituteId);

            const challengesSnapshot = await challengesQuery.get();
            const timeFilter = timeRange !== 'all' ? getTimeRangeFilter(timeRange) : 0;
            
            challengesSnapshot.forEach(doc => {
                const challenge = doc.data();
                if (challenge.submissions) {
                    challenge.submissions
                        .filter(sub => 
                            sub.isVerified && 
                            sub.approved && 
                            (timeRange === 'all' || 
                             (sub.submittedAt && sub.submittedAt.toMillis() >= timeFilter))
                        )
                        .forEach(sub => userIds.add(sub.studentId));
                }
            });

            if (userIds.size === 0) {
                return res.json({ leaderboard: [] });
            }

            const userIdChunks = chunkArray(Array.from(userIds), 10);
            for (const chunk of userIdChunks) {
                const chunkQuery = db.collection('users')
                    .where(admin.firestore.FieldPath.documentId(), 'in', chunk)
                    .where('role', '==', 'student')
                    .where('instituteId', '==', req.instituteId);

                const chunkSnapshot = await chunkQuery.get();
                chunkSnapshot.forEach(doc => {
                    const userData = doc.data();
                    if (!classValue || userData.class === classValue) {
                        users.push(userData);
                    }
                });
            }
        } else {
            let usersQuery = db.collection('users')
                .where('role', '==', 'student')
                .where('instituteId', '==', req.instituteId);

            if (classValue) {
                usersQuery = usersQuery.where('class', '==', classValue);
                const usersSnapshot = await usersQuery.get();
                usersSnapshot.forEach(doc => {
                    users.push(doc.data());
                });
            } else {
                usersQuery = usersQuery.orderBy('ecoPoints', 'desc').limit(limit);
                const usersSnapshot = await usersQuery.get();
                usersSnapshot.forEach(doc => {
                    users.push(doc.data());
                });
            }
        }

        users.sort((a, b) => (b.ecoPoints || 0) - (a.ecoPoints || 0));
        users = users.slice(0, limit);

        const leaderboard = buildLeaderboardResponse(users);
        res.json({ leaderboard });

    } catch (error) {
        console.error('Error fetching institute leaderboard:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            message: 'Failed to fetch institute leaderboard.',
            error: error.message 
        });
    }
});

// GET /teacher-students - Teacher's Students Leaderboard
router.get('/teacher-students', verifyToken, async (req, res) => {
    if (req.userRole !== 'teacher') {
        return res.status(403).json({ message: 'Only teachers can access this endpoint.' });
    }

    try {
        const challengesSnapshot = await db.collection('challenges')
            .where('createdBy', '==', req.uid)
            .get();

        const targetClasses = new Set();
        challengesSnapshot.forEach(doc => {
            const challenge = doc.data();
            if (challenge.targetClass) {
                targetClasses.add(challenge.targetClass);
            }
        });

        if (targetClasses.size === 0) {
            return res.json({ leaderboard: [], classes: [] });
        }

        const classesArray = Array.from(targetClasses);
        const classChunks = chunkArray(classesArray, 10);
        let users = [];

        for (const chunk of classChunks) {
            const chunkSnapshot = await db.collection('users')
                .where('role', '==', 'student')
                .where('instituteId', '==', req.instituteId)
                .where('class', 'in', chunk)
                .get();

            chunkSnapshot.forEach(doc => {
                users.push(doc.data());
            });
        }

        users.sort((a, b) => (b.ecoPoints || 0) - (a.ecoPoints || 0));
        users = users.slice(0, 50);

        const leaderboard = buildLeaderboardResponse(users);
        res.json({ 
            leaderboard,
            classes: Array.from(targetClasses)
        });

    } catch (error) {
        console.error('Error fetching teacher students leaderboard:', error);
        res.status(500).json({ message: 'Failed to fetch teacher students leaderboard.' });
    }
});

module.exports = router;