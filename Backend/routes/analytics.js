const express = require('express');
const router = express.Router();
const { db, admin } = require('../firebaseConfig');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing.' });
    
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.uid = decoded.uid;
        req.userRole = decoded.role;
        req.instituteId = decoded.instituteId;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
    }
};

// Global Leaderboard
router.get('/leaderboard/global', async (req, res) => {
    try {
        const snapshot = await db.collection('users')
            .where('role', '==', 'student')
            .orderBy('ecoPoints', 'desc')
            .limit(50)
            .get();

        const leaderboard = snapshot.docs.map((doc, index) => ({
            rank: index + 1,
            ...doc.data(),
            uid: undefined
        }));

        res.json({ leaderboard });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch leaderboard.' });
    }
});

// Institute Leaderboard
router.get('/leaderboard/institute', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('users')
            .where('role', '==', 'student')
            .where('instituteId', '==', req.instituteId)
            .orderBy('ecoPoints', 'desc')
            .limit(50)
            .get();

        const leaderboard = snapshot.docs.map((doc, index) => ({
            rank: index + 1,
            ...doc.data(),
            uid: undefined
        }));

        res.json({ leaderboard });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch leaderboard.' });
    }
});

// Institute Analytics (HOD only)
router.get('/institute-analytics', verifyToken, async (req, res) => {
    if (req.userRole !== 'hod') return res.status(403).json({ message: 'HOD access required.' });

    try {
        const [studentsSnapshot, teachersSnapshot, challengesSnapshot] = await Promise.all([
            db.collection('users').where('instituteId', '==', req.instituteId).where('role', '==', 'student').get(),
            db.collection('users').where('instituteId', '==', req.instituteId).where('role', '==', 'teacher').where('isVerified', '==', true).get(),
            db.collection('challenges').where('instituteId', '==', req.instituteId).get()
        ]);

        const students = studentsSnapshot.docs.map(doc => doc.data());
        const challenges = challengesSnapshot.docs.map(doc => doc.data());

        const totalEcoPoints = students.reduce((sum, student) => sum + (student.ecoPoints || 0), 0);
        
        const classStats = {};
        students.forEach(student => {
            const className = student.class;
            if (!classStats[className]) classStats[className] = { count: 0, totalPoints: 0 };
            classStats[className].count++;
            classStats[className].totalPoints += student.ecoPoints || 0;
        });

        const challengeStats = {
            total: challenges.length,
            active: challenges.filter(c => c.isActive).length,
            byType: {
                physical: challenges.filter(c => c.type === 'physical').length,
                quiz_auto: challenges.filter(c => c.type === 'quiz_auto').length,
                quiz_manual: challenges.filter(c => c.type === 'quiz_manual').length,
                video: challenges.filter(c => c.type === 'video').length
            }
        };

        res.json({
            overview: {
                totalStudents: students.length,
                totalTeachers: teachersSnapshot.size,
                totalEcoPoints,
                averageEcoPoints: students.length > 0 ? Math.round(totalEcoPoints / students.length) : 0
            },
            classStats,
            challengeStats,
            recentChallenges: challenges.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10),
            topPerformers: students.sort((a, b) => (b.ecoPoints || 0) - (a.ecoPoints || 0)).slice(0, 10)
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch analytics.' });
    }
});

module.exports = router;